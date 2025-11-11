#!/usr/bin/env python3
"""
DevOps Monitoring Platform - Simplified Backend
Provides WebSocket connection and mock data for the dashboard
"""

from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import psutil
import time
import threading
import random
import json
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'devops-monitoring-secret'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Global state
connected_clients = 0
metrics_data = {
    'totalServers': 12,
    'onlineServers': 11,
    'cpuUsage': 67,
    'memoryUsage': 82,
    'diskUsage': 45,
    'networkTraffic': 1.2,
    'uptime': 99.8,
    'responseTime': 145,
    'throughput': 2340,
    'activeConnections': 1247,
    'securityThreats': 3,
    'lastBackup': '2h ago',
    'apiCalls': 15420,
    'errors': 12,
    'warnings': 7
}

alerts_data = [
    {
        'id': 1,
        'type': 'warning',
        'message': 'High CPU usage detected on web-server-01',
        'timestamp': datetime.now().isoformat(),
        'severity': 'medium',
        'source': 'web-server-01',
        'status': 'active'
    },
    {
        'id': 2,
        'type': 'error',
        'message': 'Database connection timeout exceeded',
        'timestamp': datetime.now().isoformat(),
        'severity': 'high',
        'source': 'db-server',
        'status': 'active'
    },
    {
        'id': 3,
        'type': 'info',
        'message': 'System backup completed successfully',
        'timestamp': datetime.now().isoformat(),
        'severity': 'low',
        'source': 'backup-service',
        'status': 'resolved'
    }
]

servers_data = [
    {'id': 1, 'name': 'Web Server 1', 'status': 'online', 'cpu': 45, 'memory': 62, 'uptime': '15d 8h', 'connections': 342},
    {'id': 2, 'name': 'Web Server 2', 'status': 'online', 'cpu': 38, 'memory': 55, 'uptime': '12d 14h', 'connections': 289},
    {'id': 3, 'name': 'Database Server', 'status': 'warning', 'cpu': 78, 'memory': 89, 'uptime': '22d 3h', 'connections': 156},
    {'id': 4, 'name': 'Load Balancer', 'status': 'online', 'cpu': 23, 'memory': 41, 'uptime': '30d 12h', 'connections': 1247}
]

def get_system_metrics():
    """Get real system metrics where possible, mock others"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Update with real data where available
        metrics_data.update({
            'cpuUsage': round(cpu_percent, 1),
            'memoryUsage': round(memory.percent, 1),
            'diskUsage': round(disk.percent, 1)
        })
    except Exception as e:
        print(f"Error getting system metrics: {e}")
        # Add some realistic variation to mock data
        metrics_data['cpuUsage'] = max(0, min(100, metrics_data['cpuUsage'] + random.uniform(-5, 5)))
        metrics_data['memoryUsage'] = max(0, min(100, metrics_data['memoryUsage'] + random.uniform(-3, 3)))
        metrics_data['diskUsage'] = max(0, min(100, metrics_data['diskUsage'] + random.uniform(-1, 1)))
    
    # Add variation to other metrics
    metrics_data['networkTraffic'] = max(0, metrics_data['networkTraffic'] + random.uniform(-0.2, 0.3))
    metrics_data['responseTime'] = max(50, metrics_data['responseTime'] + random.uniform(-10, 15))
    metrics_data['throughput'] = max(1000, metrics_data['throughput'] + random.uniform(-100, 150))
    metrics_data['activeConnections'] = max(0, metrics_data['activeConnections'] + random.randint(-50, 50))
    metrics_data['apiCalls'] += random.randint(10, 100)
    metrics_data['errors'] = max(0, metrics_data['errors'] + random.randint(-2, 3))

def broadcast_metrics():
    """Broadcast updated metrics to all connected clients"""
    while True:
        try:
            get_system_metrics()
            socketio.emit('metrics_update', metrics_data)
            
            # Occasionally send new alerts
            if random.random() < 0.1:  # 10% chance every 5 seconds
                new_alert = {
                    'id': len(alerts_data) + 1,
                    'type': random.choice(['info', 'warning', 'error']),
                    'message': random.choice([
                        'System backup started',
                        'High memory usage detected',
                        'API response time increased',
                        'New security update available',
                        'Database cleanup completed'
                    ]),
                    'timestamp': datetime.now().isoformat(),
                    'severity': random.choice(['low', 'medium', 'high']),
                    'source': random.choice(['web-server-01', 'db-server', 'load-balancer', 'backup-service']),
                    'status': 'active'
                }
                alerts_data.insert(0, new_alert)
                alerts_data[:] = alerts_data[:50]  # Keep only last 50 alerts
                socketio.emit('new_alert', new_alert)
            
            time.sleep(5)  # Update every 5 seconds
        except Exception as e:
            print(f"Error in broadcast_metrics: {e}")
            time.sleep(5)

# API Routes
@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'connected_clients': connected_clients
    })

@app.route('/api/metrics')
def get_metrics():
    """Get current metrics"""
    get_system_metrics()
    return jsonify(metrics_data)

@app.route('/api/alerts')
def get_alerts():
    """Get current alerts"""
    return jsonify(alerts_data)

@app.route('/api/servers')
def get_servers():
    """Get server status"""
    # Update server metrics with some variation
    for server in servers_data:
        server['cpu'] = max(0, min(100, server['cpu'] + random.uniform(-5, 5)))
        server['memory'] = max(0, min(100, server['memory'] + random.uniform(-3, 3)))
        server['connections'] = max(0, server['connections'] + random.randint(-20, 20))
    
    return jsonify(servers_data)

@app.route('/api/performance')
def get_performance():
    """Get performance data for charts"""
    time_range = request.args.get('range', '1h')
    
    # Generate mock performance data
    performance_data = []
    for i in range(20):
        performance_data.append({
            'time': f"{i:02d}:00",
            'cpu': random.randint(40, 90),
            'memory': random.randint(50, 95),
            'network': round(random.uniform(0.5, 3.0), 1),
            'disk': random.randint(30, 60),
            'errors': random.randint(0, 10)
        })
    
    return jsonify(performance_data)

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    global connected_clients
    connected_clients += 1
    print(f'Client connected. Total clients: {connected_clients}')
    emit('connection_response', {'status': 'connected', 'message': 'Successfully connected to monitoring system'})

@socketio.on('disconnect')
def handle_disconnect():
    global connected_clients
    connected_clients = max(0, connected_clients - 1)
    print(f'Client disconnected. Total clients: {connected_clients}')

@socketio.on('request_metrics')
def handle_metrics_request():
    """Handle manual metrics request"""
    get_system_metrics()
    emit('metrics_update', metrics_data)

@socketio.on('resolve_alert')
def handle_resolve_alert(data):
    """Handle alert resolution"""
    alert_id = data.get('alert_id')
    for alert in alerts_data:
        if alert['id'] == alert_id:
            alert['status'] = 'resolved'
            break
    emit('alert_resolved', alert_id, broadcast=True)

if __name__ == '__main__':
    print("🚀 Starting DevOps Monitoring Backend...")
    print("📊 Dashboard: http://localhost:3000")
    print("🔗 API: http://localhost:5000")
    print("🔌 WebSocket: ws://localhost:5000")
    
    # Start background metrics broadcaster
    metrics_thread = threading.Thread(target=broadcast_metrics, daemon=True)
    metrics_thread.start()
    
    # Run the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)