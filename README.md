# 🛡️ AutoGuard
## DevOps Auto-Healing & Monitoring Platform

A comprehensive, modern DevOps monitoring and automation platform built with React, Flask, Docker, Ansible, and multiple monitoring tools. AutoGuard provides real-time infrastructure monitoring, automated deployment capabilities, intelligent alerting, and auto-healing functionality.

## ✨ Features

### 🎯 **Core Capabilities**
- **Real-time Monitoring** - Live system metrics, performance tracking, and health status
- **Beautiful Dashboard** - Modern glassmorphism UI with interactive visualizations
- **Auto-healing** - Intelligent automated remediation of common issues
- **Multi-container Orchestration** - Docker-based microservices architecture
- **CI/CD Pipeline** - Automated testing, building, and deployment
- **Alert Management** - Smart alerting with severity-based notifications

### 🛠 **Technology Stack**

#### Frontend
- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework with glassmorphism design
- **Framer Motion** - Smooth animations and transitions
- **Socket.IO Client** - Real-time communication
- **Recharts** - Interactive data visualizations
- **React Query** - Efficient data fetching and caching

#### Backend
- **Flask** - Python web framework with REST API
- **Socket.IO** - Real-time bidirectional communication
- **PostgreSQL** - Relational database for persistent data
- **Redis** - In-memory caching and session management
- **Docker SDK** - Container management and monitoring
- **Prometheus Client** - Metrics collection and export

#### Infrastructure
- **Docker & Docker Compose** - Containerization and orchestration
- **Ansible** - Configuration management and automation
- **Nginx** - Reverse proxy and load balancing
- **Nagios** - Traditional monitoring and alerting
- **Prometheus** - Metrics collection and time-series database
- **Grafana** - Advanced visualization and dashboards

#### DevOps
- **GitHub Actions** - CI/CD pipeline automation
- **GitLab CI** - Alternative CI/CD platform support
- **Trivy** - Container security scanning
- **Ansible Lint** - Playbook validation and best practices

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Flask Backend  │    │ Docker Services │
│                 │    │                  │    │                 │
│ • Dashboard     │◄──►│ • REST API       │◄──►│ • PostgreSQL    │
│ • Real-time UI  │    │ • WebSocket      │    │ • Redis         │
│ • Glassmorphism │    │ • Monitoring     │    │ • Nginx         │
│ • Animations    │    │ • Auto-healing   │    │ • Prometheus    │
└─────────────────┘    └──────────────────┘    │ • Grafana       │
                                               │ • Nagios        │
┌─────────────────┐    ┌──────────────────┐    └─────────────────┘
│ Ansible Control │    │   CI/CD Pipeline │
│                 │    │                  │
│ • Configuration │    │ • GitHub Actions │
│ • Deployment    │    │ • GitLab CI      │
│ • Auto-healing  │    │ • Security Scans │
│ • Orchestration │    │ • Automated Tests│
└─────────────────┘    └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Git** for cloning the repository
- **Node.js** (v18+) for local development (optional)
- **Python** (v3.11+) for local development (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/roshaniraj24/AUTOGUARD-.git
cd AUTOGUARD-
```

### 2. Environment Setup
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit configuration (optional - defaults work for development)
nano backend/.env
```

### 3. Start the Platform
```bash
# Build and start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### 4. Access the Platform
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Nagios Monitoring**: http://localhost:8080/nagios (admin/admin)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123)

### 5. Initialize Monitoring
```bash
# Run initial server configuration
docker-compose exec ansible ansible-playbook -i inventory.ini webserver-setup.yml

# Setup monitoring infrastructure
docker-compose exec ansible ansible-playbook -i inventory.ini monitoring-setup.yml
```

## 📱 Platform Components

### 🎨 Frontend Dashboard
The React-based dashboard provides a modern, responsive interface with:

- **Real-time Metrics** - Live CPU, memory, disk, and network usage
- **Server Management** - Start, stop, restart containers with one click
- **Deployment Control** - Trigger deployments and view history
- **Alert Management** - View, acknowledge, and auto-heal alerts
- **Settings Panel** - Configure monitoring thresholds and preferences

#### Key Features:
- Glassmorphism design with smooth animations
- Real-time updates via WebSocket
- Responsive layout for mobile and desktop
- Interactive charts and visualizations
- Dark theme optimized interface

### ⚙️ Backend API
The Flask backend provides comprehensive APIs and real-time capabilities:

#### REST Endpoints:
```bash
# Server Management
GET    /api/servers              # List all servers
POST   /api/servers/{id}/action  # Control server actions

# Deployment Management  
GET    /api/deployments          # List deployments
POST   /api/deployments          # Create new deployment

# Alert Management
GET    /api/alerts               # List alerts
POST   /api/alerts               # Create alert
POST   /api/alerts/{id}/resolve  # Resolve alert
POST   /api/alerts/{id}/auto-heal # Trigger auto-healing

# Metrics and Health
GET    /api/metrics              # System metrics
GET    /health                   # Health check
GET    /metrics                  # Prometheus metrics
```

#### WebSocket Events:
- `metrics_update` - Real-time system metrics
- `new_alert` - Alert notifications
- `alert_resolved` - Alert resolution updates
- `server_action` - Server state changes
- `deployment_complete` - Deployment status updates

### 🔧 Ansible Automation
Comprehensive playbooks for infrastructure management:

#### Available Playbooks:
- **`webserver-setup.yml`** - Configure Nginx web servers
- **`deploy.yml`** - Application deployment automation
- **`auto-heal.yml`** - Automated issue remediation
- **`monitoring-setup.yml`** - Monitoring infrastructure setup

#### Auto-healing Capabilities:
- High CPU usage mitigation
- Memory optimization
- Disk cleanup automation
- Service restart procedures
- Network connectivity fixes
- Database connection recovery

### 📊 Monitoring Stack

#### Nagios
- Traditional monitoring and alerting
- Host and service checks
- Email notifications
- Web interface for management

#### Prometheus
- Time-series metrics collection
- Advanced alerting rules
- Service discovery
- High-performance queries

#### Grafana
- Beautiful visualization dashboards
- Custom alerts and notifications
- Multiple data source support
- Template variables and annotations

## 🔧 Configuration

### Environment Variables
Key configuration options in `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://devops_user:secure_password123@postgres:5432/monitoring_db

# Cache
REDIS_URL=redis://:redis_password123@redis:6379/0

# Security
SECRET_KEY=your_secret_key_here_change_in_production

# Monitoring
MONITORING_INTERVAL=30
ALERT_RETENTION_DAYS=30
```

### Docker Compose Override
Create `docker-compose.override.yml` for local customizations:

```yaml
version: '3.8'
services:
  frontend:
    ports:
      - "3001:3000"  # Custom port
    environment:
      - REACT_APP_API_URL=http://localhost:5001/api
  
  backend:
    ports:
      - "5001:5000"  # Custom port
    environment:
      - LOG_LEVEL=DEBUG
```

### Monitoring Thresholds
Customize alert thresholds in the frontend settings or via API:

```json
{
  "cpu_threshold": 80,
  "memory_threshold": 85,
  "disk_threshold": 90,
  "response_time_threshold": 500
}
```

## 🚀 Deployment

### Development Environment
```bash
# Start with file watching for development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Run frontend in development mode
cd frontend && npm start

# Run backend in development mode
cd backend && python app.py
```

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose exec backend python migrations.py
```

### CI/CD Pipeline
The platform includes automated CI/CD pipelines for both GitHub Actions and GitLab CI:

#### GitHub Actions Features:
- Automated testing (frontend, backend, Ansible)
- Security scanning with Trivy
- Integration testing with full stack
- Automated deployment to staging/production
- Rollback capabilities
- Slack notifications

#### GitLab CI Features:
- Parallel testing stages
- Container security scanning
- Manual deployment approvals
- Environment-specific configurations
- Artifact management

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
docker-compose exec backend python -m pytest tests/ --cov=app

# Frontend tests
docker-compose exec frontend npm test -- --coverage

# Ansible syntax validation
docker-compose exec ansible ansible-playbook --syntax-check *.yml

# Integration tests
./scripts/run-integration-tests.sh
```

### Manual Testing
```bash
# Test API endpoints
curl http://localhost:5000/api/servers
curl http://localhost:5000/api/metrics
curl http://localhost:5000/health

# Test WebSocket connection
wscat -c ws://localhost:5000

# Test auto-healing
curl -X POST http://localhost:5000/api/alerts/1/auto-heal
```

## 🔐 Security

### Security Features
- **Container Security** - Regular base image updates and vulnerability scanning
- **Network Isolation** - Docker network segmentation
- **Authentication** - JWT-based API authentication (configurable)
- **HTTPS Support** - SSL/TLS termination at load balancer
- **Input Validation** - Comprehensive input sanitization
- **CORS Protection** - Configurable cross-origin resource sharing

### Security Best Practices
```bash
# Change default passwords
# Update backend/.env with secure passwords

# Enable authentication (optional)
ENABLE_AUTH=true
JWT_SECRET_KEY=your-super-secure-jwt-key

# Configure HTTPS
# Add SSL certificates to nginx configuration

# Regular updates
docker-compose pull  # Update base images
```

## 🛠 Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready -U devops_user

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### High Resource Usage
```bash
# Monitor resource usage
docker stats

# Scale down services
docker-compose up -d --scale webserver1=1 --scale webserver2=1

# Clean up unused resources
docker system prune -a
```

#### Alert System Not Working
```bash
# Check Redis connection
docker-compose exec redis redis-cli ping

# Test WebSocket connection
# Open browser console and check WebSocket connections

# Restart monitoring services
docker-compose restart backend prometheus nagios
```

### Performance Optimization

#### Frontend Optimization
```bash
# Build optimized production bundle
cd frontend && npm run build

# Analyze bundle size
cd frontend && npm run analyze
```

#### Backend Optimization
```bash
# Enable caching
REDIS_CACHE_TTL=300

# Database connection pooling
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20

# Optimize monitoring interval
MONITORING_INTERVAL=60  # Less frequent updates
```

#### Database Optimization
```bash
# Tune PostgreSQL settings
# Edit postgresql.conf for production workloads

# Monitor query performance
docker-compose exec postgres psql -U devops_user -c "SELECT * FROM pg_stat_activity;"
```

## 📈 Monitoring and Metrics

### Key Metrics Tracked
- **System Metrics**: CPU, Memory, Disk, Network usage
- **Application Metrics**: Response times, error rates, throughput
- **Container Metrics**: Resource usage, health status
- **Database Metrics**: Connection count, query performance
- **Custom Metrics**: Business-specific KPIs

### Alert Types
- **Critical**: Service down, database unavailable
- **Warning**: High resource usage, slow response times
- **Info**: Deployment completed, configuration changes

### Grafana Dashboard Panels
- System overview with key metrics
- Historical performance trends
- Alert timeline and status
- Resource utilization by service
- Network traffic analysis

## 🤝 Contributing

### Development Setup
```bash
# Fork the repository
git clone https://github.com/roshaniraj24/AUTOGUARD-.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
docker-compose up -d
npm test
python -m pytest

# Submit pull request
git push origin feature/amazing-feature
```

### Code Standards
- **Frontend**: ESLint + Prettier for JavaScript/React
- **Backend**: Black + Flake8 for Python
- **Ansible**: ansible-lint for playbook validation
- **Documentation**: Clear comments and README updates

### Pull Request Process
1. Update documentation for new features
2. Add tests for new functionality
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address feedback and merge

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Flask Team** - For the flexible Python web framework
- **Docker Team** - For containerization technology
- **Ansible Team** - For powerful automation capabilities
- **Prometheus/Grafana** - For excellent monitoring solutions
- **Open Source Community** - For countless libraries and tools

## 📞 Support

### Documentation
- **GitHub Repository**: https://github.com/roshaniraj24/AUTOGUARD-
- **Docker Hub Images**: https://hub.docker.com/u/roshani24
- **Issues**: Report bugs and request features on GitHub

---

## 🎯 Learning Outcomes

This project demonstrates:

### DevOps Concepts
- **Infrastructure as Code** - Docker Compose and Ansible
- **Continuous Integration/Deployment** - Automated pipelines
- **Monitoring and Observability** - Multiple monitoring tools
- **Configuration Management** - Ansible playbooks
- **Container Orchestration** - Docker services

### Development Skills
- **Full-stack Development** - React + Flask integration
- **Real-time Applications** - WebSocket communication
- **API Design** - RESTful endpoints and best practices
- **Database Management** - PostgreSQL with migrations
- **Testing Strategies** - Unit, integration, and security testing

### Production Readiness
- **Security Best Practices** - Vulnerability scanning and hardening
- **Performance Optimization** - Caching and resource management
- **Error Handling** - Comprehensive logging and monitoring
- **Scalability Planning** - Horizontal scaling capabilities
- **Disaster Recovery** - Backup and rollback procedures

Ready to deploy and monitor your infrastructure like a pro! 🚀

---

**Project Stats:**
- 🐳 **4 Docker Images** on Docker Hub (roshani24/autoguard-*)
- 📦 **11 Microservices** orchestrated with Docker Compose
- 🔧 **4 Ansible Playbooks** for automation
- 📊 **3 Monitoring Tools** (Nagios, Prometheus, Grafana)
- ⚡ **Real-time Dashboard** with WebSocket updates
- 🚀 **CI/CD Ready** with GitHub Actions & GitLab CI

---

*Built with ❤️ by Roshani Raj - DevOps Engineer*
