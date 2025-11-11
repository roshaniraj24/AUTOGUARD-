import os
import json
import time
import docker
import threading
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import redis
import subprocess
import yaml
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter, Gauge, Histogram

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
CORS(app, origins=["http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000"])

# Initialize Docker client
docker_client = docker.from_env()

# Initialize Redis client
redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

# Prometheus metrics
request_count = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
request_duration = Histogram('api_request_duration_seconds', 'API request duration')
server_cpu_usage = Gauge('server_cpu_usage_percent', 'Server CPU usage percentage', ['server'])
server_memory_usage = Gauge('server_memory_usage_percent', 'Server memory usage percentage', ['server'])

# Database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'postgres'),
            database=os.getenv('DB_NAME', 'monitoring_db'),
            user=os.getenv('DB_USER', 'devops_user'),
            password=os.getenv('DB_PASSWORD', 'secure_password123'),
            port=os.getenv('DB_PORT', '5432')
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Health check endpoint
@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# API Routes
@app.route('/api/servers', methods=['GET'])
def get_servers():
    request_count.labels(method='GET', endpoint='/api/servers').inc()
    
    try:
        servers = []
        containers = docker_client.containers.list(all=True)
        
        for container in containers:
            stats = container.stats(stream=False) if container.status == 'running' else None
            
            server_info = {
                'id': container.id[:12],
                'name': container.name,
                'status': container.status,
                'image': container.image.tags[0] if container.image.tags else 'unknown',
                'created': container.attrs['Created'],
                'ports': container.attrs.get('NetworkSettings', {}).get('Ports', {}),
                'networks': list(container.attrs.get('NetworkSettings', {}).get('Networks', {}).keys())
            }
            
            if stats and container.status == 'running':
                # Calculate CPU usage
                cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
                system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
                cpu_usage = (cpu_delta / system_delta) * len(stats['cpu_stats']['cpu_usage']['percpu_usage']) * 100
                
                # Calculate memory usage
                memory_usage = (stats['memory_stats']['usage'] / stats['memory_stats']['limit']) * 100
                
                server_info.update({
                    'cpu_usage': round(cpu_usage, 2),
                    'memory_usage': round(memory_usage, 2),
                    'memory_limit': stats['memory_stats']['limit'],
                    'network_rx': stats['networks']['eth0']['rx_bytes'] if 'networks' in stats else 0,
                    'network_tx': stats['networks']['eth0']['tx_bytes'] if 'networks' in stats else 0
                })
                
                # Update Prometheus metrics
                server_cpu_usage.labels(server=container.name).set(cpu_usage)
                server_memory_usage.labels(server=container.name).set(memory_usage)
            
            servers.append(server_info)
        
        return jsonify({'servers': servers})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/servers/<server_id>/action', methods=['POST'])
def server_action(server_id):
    request_count.labels(method='POST', endpoint='/api/servers/action').inc()
    
    try:
        action = request.json.get('action')
        container = docker_client.containers.get(server_id)
        
        if action == 'start':
            container.start()
        elif action == 'stop':
            container.stop()
        elif action == 'restart':
            container.restart()
        else:
            return jsonify({'error': 'Invalid action'}), 400
        
        # Emit real-time update
        socketio.emit('server_action', {
            'server_id': server_id,
            'action': action,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        return jsonify({'success': True, 'action': action})
    
    except docker.errors.NotFound:
        return jsonify({'error': 'Server not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/deployments', methods=['GET'])
def get_deployments():
    request_count.labels(method='GET', endpoint='/api/deployments').inc()
    
    # Mock deployment data - in a real scenario, this would come from a database
    deployments = [
        {
            'id': 1,
            'name': 'Web Application v2.1.0',
            'status': 'success',
            'environment': 'production',
            'branch': 'main',
            'commit': 'a1b2c3d',
            'timestamp': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
            'duration': '3m 45s'
        },
        {
            'id': 2,
            'name': 'API Service v1.8.2',
            'status': 'running',
            'environment': 'staging',
            'branch': 'develop',
            'commit': 'e4f5g6h',
            'timestamp': (datetime.utcnow() - timedelta(minutes=30)).isoformat(),
            'duration': '2m 12s'
        }
    ]
    
    return jsonify({'deployments': deployments})

@app.route('/api/deployments', methods=['POST'])
def create_deployment():
    request_count.labels(method='POST', endpoint='/api/deployments').inc()
    
    try:
        deployment_data = request.json
        
        # Run deployment using Ansible
        playbook_path = '/app/ansible/deploy.yml'
        inventory_path = '/app/ansible/inventory.ini'
        
        cmd = [
            'ansible-playbook',
            '-i', inventory_path,
            playbook_path,
            '--extra-vars', json.dumps(deployment_data)
        ]
        
        # Start deployment in background
        def run_deployment():
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
                
                # Emit deployment result
                socketio.emit('deployment_complete', {
                    'status': 'success' if result.returncode == 0 else 'failed',
                    'output': result.stdout,
                    'error': result.stderr,
                    'timestamp': datetime.utcnow().isoformat()
                })
                
            except subprocess.TimeoutExpired:
                socketio.emit('deployment_complete', {
                    'status': 'failed',
                    'error': 'Deployment timed out',
                    'timestamp': datetime.utcnow().isoformat()
                })
        
        thread = threading.Thread(target=run_deployment)
        thread.daemon = True
        thread.start()
        
        return jsonify({'success': True, 'message': 'Deployment started'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    request_count.labels(method='GET', endpoint='/api/alerts').inc()
    
    try:
        # Get alerts from Redis cache
        alerts_data = redis_client.get('alerts')
        if alerts_data:
            alerts = json.loads(alerts_data)
        else:
            alerts = []
        
        return jsonify({'alerts': alerts})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    request_count.labels(method='POST', endpoint='/api/alerts').inc()
    
    try:
        alert_data = request.json
        alert_data['id'] = int(time.time() * 1000)  # Simple ID generation
        alert_data['timestamp'] = datetime.utcnow().isoformat()
        alert_data['resolved'] = False
        
        # Store in Redis
        alerts_data = redis_client.get('alerts')
        alerts = json.loads(alerts_data) if alerts_data else []
        alerts.insert(0, alert_data)
        
        # Keep only last 100 alerts
        alerts = alerts[:100]
        redis_client.set('alerts', json.dumps(alerts))
        
        # Emit real-time alert
        socketio.emit('new_alert', alert_data)
        
        return jsonify({'success': True, 'alert': alert_data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<int:alert_id>/resolve', methods=['POST'])
def resolve_alert(alert_id):
    request_count.labels(method='POST', endpoint='/api/alerts/resolve').inc()
    
    try:
        alerts_data = redis_client.get('alerts')
        alerts = json.loads(alerts_data) if alerts_data else []
        
        for alert in alerts:
            if alert['id'] == alert_id:
                alert['resolved'] = True
                alert['resolved_at'] = datetime.utcnow().isoformat()
                break
        
        redis_client.set('alerts', json.dumps(alerts))
        
        # Emit alert resolved event
        socketio.emit('alert_resolved', alert_id)
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<int:alert_id>/auto-heal', methods=['POST'])
def auto_heal_alert(alert_id):
    request_count.labels(method='POST', endpoint='/api/alerts/auto-heal').inc()
    
    try:
        alerts_data = redis_client.get('alerts')
        alerts = json.loads(alerts_data) if alerts_data else []
        
        alert = next((a for a in alerts if a['id'] == alert_id), None)
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        # Run auto-healing playbook
        playbook_path = '/app/ansible/auto-heal.yml'
        inventory_path = '/app/ansible/inventory.ini'
        
        cmd = [
            'ansible-playbook',
            '-i', inventory_path,
            playbook_path,
            '--extra-vars', json.dumps({
                'alert_id': alert_id,
                'alert_type': alert.get('type', 'unknown'),
                'server': alert.get('source', 'unknown')
            })
        ]
        
        def run_auto_heal():
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
                
                if result.returncode == 0:
                    # Mark alert as resolved
                    alert['resolved'] = True
                    alert['resolved_at'] = datetime.utcnow().isoformat()
                    alert['auto_healed'] = True
                    redis_client.set('alerts', json.dumps(alerts))
                    
                    socketio.emit('alert_resolved', alert_id)
                    socketio.emit('auto_heal_complete', {
                        'alert_id': alert_id,
                        'status': 'success',
                        'message': 'Auto-healing completed successfully'
                    })
                else:
                    socketio.emit('auto_heal_complete', {
                        'alert_id': alert_id,
                        'status': 'failed',
                        'message': 'Auto-healing failed',
                        'error': result.stderr
                    })
                    
            except subprocess.TimeoutExpired:
                socketio.emit('auto_heal_complete', {
                    'alert_id': alert_id,
                    'status': 'failed',
                    'message': 'Auto-healing timed out'
                })
        
        thread = threading.Thread(target=run_auto_heal)
        thread.daemon = True
        thread.start()
        
        return jsonify({'success': True, 'message': 'Auto-healing started'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    request_count.labels(method='GET', endpoint='/api/metrics').inc()
    
    try:
        # Collect system metrics
        containers = docker_client.containers.list(filters={'status': 'running'})
        
        metrics = {
            'total_servers': len(docker_client.containers.list(all=True)),
            'online_servers': len(containers),
            'timestamp': datetime.utcnow().isoformat(),
            'system_health': 'healthy' if len(containers) > 0 else 'degraded'
        }
        
        # Calculate average CPU and memory usage
        if containers:
            total_cpu = 0
            total_memory = 0
            
            for container in containers:
                try:
                    stats = container.stats(stream=False)
                    
                    # CPU calculation
                    cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
                    system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
                    cpu_usage = (cpu_delta / system_delta) * len(stats['cpu_stats']['cpu_usage']['percpu_usage']) * 100
                    
                    # Memory calculation
                    memory_usage = (stats['memory_stats']['usage'] / stats['memory_stats']['limit']) * 100
                    
                    total_cpu += cpu_usage
                    total_memory += memory_usage
                    
                except Exception:
                    continue
            
            metrics.update({
                'avg_cpu_usage': round(total_cpu / len(containers), 2),
                'avg_memory_usage': round(total_memory / len(containers), 2)
            })
        
        return jsonify(metrics)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/metrics')
def prometheus_metrics():
    """Prometheus metrics endpoint"""
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'message': 'Connected to monitoring system'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

def monitor_system():
    """Background task to monitor system and emit real-time updates"""
    while True:
        try:
            # Get current metrics
            containers = docker_client.containers.list(filters={'status': 'running'})
            
            metrics = {
                'total_servers': len(docker_client.containers.list(all=True)),
                'online_servers': len(containers),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Check for issues and create alerts
            for container in containers:
                try:
                    stats = container.stats(stream=False)
                    
                    # CPU calculation
                    cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
                    system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
                    cpu_usage = (cpu_delta / system_delta) * len(stats['cpu_stats']['cpu_usage']['percpu_usage']) * 100
                    
                    # Memory calculation
                    memory_usage = (stats['memory_stats']['usage'] / stats['memory_stats']['limit']) * 100
                    
                    # Check thresholds and create alerts
                    if cpu_usage > 80:
                        alert = {
                            'id': int(time.time() * 1000),
                            'severity': 'critical' if cpu_usage > 90 else 'warning',
                            'message': f'High CPU usage on {container.name}: {cpu_usage:.1f}%',
                            'source': container.name,
                            'timestamp': datetime.utcnow().isoformat(),
                            'type': 'cpu_high',
                            'resolved': False
                        }
                        
                        # Store and emit alert
                        alerts_data = redis_client.get('alerts')
                        alerts = json.loads(alerts_data) if alerts_data else []
                        alerts.insert(0, alert)
                        alerts = alerts[:100]
                        redis_client.set('alerts', json.dumps(alerts))
                        
                        socketio.emit('new_alert', alert)
                    
                    if memory_usage > 85:
                        alert = {
                            'id': int(time.time() * 1000),
                            'severity': 'critical' if memory_usage > 95 else 'warning',
                            'message': f'High memory usage on {container.name}: {memory_usage:.1f}%',
                            'source': container.name,
                            'timestamp': datetime.utcnow().isoformat(),
                            'type': 'memory_high',
                            'resolved': False
                        }
                        
                        # Store and emit alert
                        alerts_data = redis_client.get('alerts')
                        alerts = json.loads(alerts_data) if alerts_data else []
                        alerts.insert(0, alert)
                        alerts = alerts[:100]
                        redis_client.set('alerts', json.dumps(alerts))
                        
                        socketio.emit('new_alert', alert)
                
                except Exception:
                    continue
            
            # Emit metrics update
            socketio.emit('metrics_update', metrics)
            
        except Exception as e:
            print(f"Monitoring error: {e}")
        
        time.sleep(30)  # Monitor every 30 seconds

# Start background monitoring
def start_monitoring():
    monitor_thread = threading.Thread(target=monitor_system)
    monitor_thread.daemon = True
    monitor_thread.start()

if __name__ == '__main__':
    start_monitoring()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)