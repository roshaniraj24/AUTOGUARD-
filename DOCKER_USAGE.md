# 🐳 How Docker is Used in AutoGuard Project

## 📋 Table of Contents
1. [Docker Overview in AutoGuard](#docker-overview-in-autoguard)
2. [Docker Architecture](#docker-architecture)
3. [Docker Compose Explained](#docker-compose-explained)
4. [Individual Dockerfiles](#individual-dockerfiles)
5. [How Each Service Uses Docker](#how-each-service-uses-docker)
6. [Docker Networking](#docker-networking)
7. [Docker Volumes (Data Persistence)](#docker-volumes-data-persistence)
8. [Docker Commands for AutoGuard](#docker-commands-for-autoguard)
9. [Why Docker is Essential](#why-docker-is-essential)

---

## 🎯 Docker Overview in AutoGuard

### **What is Docker Doing in This Project?**

Docker is the **foundation** of AutoGuard. It's like a **shipping container for software** - everything your application needs is packaged together and can run anywhere.

```
Without Docker (Traditional):
┌─────────────────────────────────────────────────┐
│  Your Computer                                  │
│  - Install Python 3.11 ❌ Conflicts with 3.9   │
│  - Install PostgreSQL ❌ Port already used      │
│  - Install Redis ❌ Different OS versions       │
│  - Install Node.js ❌ Version mismatch          │
│  - Install Nagios ❌ Complex setup              │
│  Result: "It works on my machine!" 😩          │
└─────────────────────────────────────────────────┘

With Docker (AutoGuard):
┌─────────────────────────────────────────────────┐
│  Your Computer                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │Python  │ │Postgres│ │ Redis  │ │ Node   │ │
│  │  in    │ │   in   │ │   in   │ │   in   │ │
│  │Container│ │Container│ │Container│ │Container│ │
│  └────────┘ └────────┘ └────────┘ └────────┘ │
│  Result: Works everywhere! 🎉                  │
└─────────────────────────────────────────────────┘
```

---

## 🏗️ Docker Architecture

### **Complete Docker Structure in AutoGuard:**

```
autoguard-project/
├── docker-compose.yml          ← Orchestrates ALL containers
├── backend/
│   ├── Dockerfile             ← Builds Python Flask container
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile             ← Builds React container
│   ├── package.json
│   └── src/
├── monitoring/
│   └── nagios/
│       ├── Dockerfile         ← Builds Nagios container
│       └── etc/
└── ansible/
    └── Dockerfile             ← Builds Ansible container
```

### **12 Docker Containers Running:**

| # | Container Name | Image | What It Does | Dockerfile? |
|---|----------------|-------|--------------|-------------|
| 1 | `autoguard_backend` | Custom | Flask API server | ✅ Yes |
| 2 | `autoguard_frontend` | Custom | React dashboard | ✅ Yes |
| 3 | `autoguard_postgres` | postgres:15 | Database | ❌ Pre-built |
| 4 | `autoguard_redis` | redis:7-alpine | Cache | ❌ Pre-built |
| 5 | `autoguard_nginx` | nginx:alpine | Web server/proxy | ❌ Pre-built |
| 6 | `autoguard_nagios` | Custom | Monitoring engine | ✅ Yes |
| 7 | `autoguard_prometheus` | prom/prometheus | Metrics collector | ❌ Pre-built |
| 8 | `autoguard_grafana` | grafana/grafana | Visualization | ❌ Pre-built |
| 9 | `autoguard_ansible` | Custom | Automation | ✅ Yes |
| 10 | `webserver1` | nginx:alpine | Test server 1 | ❌ Pre-built |
| 11 | `webserver2` | nginx:alpine | Test server 2 | ❌ Pre-built |

**Total: 11 containers** working together as ONE application!

---

## 📦 Docker Compose Explained

### **What is docker-compose.yml?**

`docker-compose.yml` is the **master control file** that orchestrates all containers. Think of it as a **recipe book** that tells Docker:
- What containers to create
- How to configure them
- How they connect to each other
- What data to persist

### **Let's Break Down the docker-compose.yml:**

#### **1. Backend Service (Flask API)**

```yaml
backend:
  build:
    context: ./backend          # ← Where is the Dockerfile?
    dockerfile: Dockerfile      # ← Name of the Dockerfile
  container_name: autoguard_backend  # ← Container name
  environment:                  # ← Environment variables
    DATABASE_URL: postgresql://autoguard_user:secure_password123@postgres:5432/autoguard_db
    REDIS_URL: redis://:redis_password123@redis:6379/0
    FLASK_ENV: production
  volumes:                      # ← Mount folders/files
    - ./backend:/app            # ← Share code with container
    - /var/run/docker.sock:/var/run/docker.sock  # ← Control Docker
  ports:
    - "5000:5000"              # ← Expose port (host:container)
  depends_on:                   # ← Start after these services
    - postgres
    - redis
  networks:
    - autoguard_network        # ← Connect to network
```

**What This Means:**

```
1. BUILD PHASE:
   Docker reads ./backend/Dockerfile
   → Creates custom Python image with Flask
   → Installs all dependencies from requirements.txt
   → Names it "autoguard_backend"

2. RUN PHASE:
   Docker starts the container
   → Sets environment variables (DB connection, Redis URL)
   → Mounts ./backend folder so code changes reflect immediately
   → Exposes port 5000 (Flask API accessible at http://localhost:5000)
   → Waits for postgres and redis to be healthy first
   → Joins autoguard_network (can talk to other containers)

3. RESULT:
   Flask API running in isolated container
   ✅ Can access postgres by hostname "postgres"
   ✅ Can access redis by hostname "redis"
   ✅ Isolated from host machine
```

---

#### **2. Frontend Service (React)**

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  container_name: autoguard_frontend
  environment:
    REACT_APP_API_URL: http://localhost:5000/api
    REACT_APP_WS_URL: ws://localhost:5000
  ports:
    - "3000:3000"
  volumes:
    - ./frontend:/app
    - /app/node_modules       # ← Don't override node_modules
  depends_on:
    - backend
  networks:
    - autoguard_network
```

**What This Means:**

```
1. BUILD PHASE:
   Docker reads ./frontend/Dockerfile
   → Uses Node.js 18 Alpine image (lightweight)
   → Runs npm install (installs React, dependencies)
   → Copies frontend code into container

2. RUN PHASE:
   → Runs "npm start" (starts React dev server)
   → Exposes port 3000 (dashboard at http://localhost:3000)
   → Shares code folder (hot reload works!)
   → Waits for backend to start first

3. RESULT:
   React dashboard running in container
   ✅ Can call backend API at http://localhost:5000
   ✅ Live code reloading (edit code, see changes instantly)
```

---

#### **3. PostgreSQL Database**

```yaml
postgres:
  image: postgres:15           # ← Use official PostgreSQL image
  container_name: autoguard_postgres
  environment:
    POSTGRES_DB: autoguard_db  # ← Create this database
    POSTGRES_USER: autoguard_user
    POSTGRES_PASSWORD: secure_password123
  volumes:
    - postgres_data:/var/lib/postgresql/data  # ← Persist data
    - ./monitoring/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
  ports:
    - "5432:5432"
  networks:
    - autoguard_network
  healthcheck:                 # ← Check if database is ready
    test: ["CMD-SHELL", "pg_isready -U autoguard_user -d autoguard_db"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**What This Means:**

```
1. No Dockerfile needed (uses official image from Docker Hub)
2. Creates database "autoguard_db" automatically
3. Runs init.sql script on first startup (creates tables)
4. Data stored in "postgres_data" volume (survives restarts)
5. Health check ensures database is ready before starting backend
```

---

#### **4. Redis Cache**

```yaml
redis:
  image: redis:7-alpine        # ← Lightweight Redis image
  container_name: autoguard_redis
  command: redis-server --requirepass redis_password123
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data         # ← Persist cache data
  networks:
    - autoguard_network
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 30s
```

**What This Means:**

```
Fast in-memory cache running in container
✅ Backend can access at redis://redis:6379
✅ Data persists across restarts
✅ Password-protected
```

---

#### **5. Nginx Web Server**

```yaml
nginx:
  image: nginx:alpine
  container_name: autoguard_nginx
  volumes:
    - ./monitoring/nginx/nginx.conf:/etc/nginx/nginx.conf
  ports:
    - "80:80"                  # ← Main web port
    - "443:443"                # ← HTTPS port
  depends_on:
    - backend
    - frontend
  networks:
    - autoguard_network
```

**What This Means:**

```
Acts as REVERSE PROXY:

User → http://localhost:80
        ↓
      Nginx decides:
        ↓
   /api/* → Backend (port 5000)
   /*     → Frontend (port 3000)
```

---

#### **6. Nagios Monitoring**

```yaml
nagios:
  build:
    context: ./monitoring/nagios
    dockerfile: Dockerfile
  container_name: autoguard_nagios
  volumes:
    - ./monitoring/nagios/etc:/opt/nagios/etc
    - nagios_var:/opt/nagios/var
  ports:
    - "8080:80"                # ← Nagios UI at port 8080
  networks:
    - autoguard_network
```

**What This Means:**

```
Nagios monitoring system in container
✅ Monitors all other containers
✅ Access web UI at http://localhost:8080
✅ Configuration in ./monitoring/nagios/etc/
```

---

## 📄 Individual Dockerfiles

### **1. Backend Dockerfile (Flask)**

**Location:** `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim           # ← Base image: Python 3.11

WORKDIR /app                    # ← Set working directory

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \                       # ← Compiler for Python packages
    libpq-dev \                 # ← PostgreSQL development headers
    curl \                      # ← For health checks
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .         # ← Copy requirements file
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .                        # ← Copy all backend code

# Create directories
RUN mkdir -p /app/logs /app/data

EXPOSE 5000                     # ← Expose Flask port

CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "app:app"]
```

**What Each Line Does:**

```
Line 1: FROM python:3.11-slim
   → Start with official Python 3.11 image (minimal version)
   → This gives us Python, pip, and basic Unix tools

Line 3: WORKDIR /app
   → All commands run in /app directory
   → Like doing "cd /app" automatically

Lines 5-9: Install system dependencies
   → gcc: Compile C extensions for Python packages
   → libpq-dev: Connect to PostgreSQL
   → curl: Health check endpoint

Lines 12-13: Install Python packages
   → Copy requirements.txt into container
   → Run pip install (Flask, SQLAlchemy, etc.)

Line 16: COPY . .
   → Copy all files from ./backend to /app in container

Line 19: Create directories
   → Logs and data folders for application

Line 21: EXPOSE 5000
   → Tell Docker this container uses port 5000
   → (Documentation only, actual port mapping in docker-compose.yml)

Line 23: CMD
   → Start Flask using Gunicorn (production server)
   → --worker-class eventlet: For WebSocket support
   → -w 1: One worker process
   → --bind 0.0.0.0:5000: Listen on all interfaces
```

---

### **2. Frontend Dockerfile (React)**

**Location:** `frontend/Dockerfile`

```dockerfile
FROM node:18-alpine             # ← Lightweight Node.js image

WORKDIR /app                    # ← Working directory

COPY package*.json ./           # ← Copy package files first
RUN npm install                 # ← Install dependencies

COPY . .                        # ← Copy all source code

EXPOSE 3000                     # ← React dev server port

CMD ["npm", "start"]            # ← Start React app
```

**What Each Line Does:**

```
Line 1: FROM node:18-alpine
   → Alpine Linux: Super small (40MB vs 1GB)
   → Node.js 18: JavaScript runtime for React

Line 5-6: Copy package files and install
   → Why copy package.json first?
   → Docker caching! If package.json unchanged, skip npm install
   → Saves time on rebuilds

Line 8: Copy source code
   → Copy all React components, CSS, etc.

Line 12: Start React
   → npm start = react-scripts start
   → Runs development server with hot reload
```

---

### **3. Nagios Dockerfile**

**Location:** `monitoring/nagios/Dockerfile`

```dockerfile
FROM jasonrivers/nagios:latest  # ← Pre-built Nagios image

# Install additional plugins
RUN apt-get update && apt-get install -y \
    nagios-plugins-contrib \    # ← More monitoring plugins
    nagios-nrpe-plugin \        # ← Remote execution
    && rm -rf /var/lib/apt/lists/*

# Copy custom configuration
COPY etc/ /opt/nagios/etc/      # ← Our Nagios config files

# Set permissions
RUN chown -R nagios:nagios /opt/nagios/etc/

EXPOSE 80                       # ← Nagios web interface
```

**What This Does:**

```
1. Starts with Nagios pre-installed
2. Adds extra monitoring plugins
3. Copies our custom configuration (what to monitor, how often)
4. Sets correct file permissions
```

---

## 🔗 Docker Networking

### **How Containers Talk to Each Other**

Docker creates a **virtual network** called `autoguard_network`:

```yaml
networks:
  autoguard_network:
    driver: bridge              # ← Bridge network (default)
    ipam:
      config:
        - subnet: 172.20.0.0/16 # ← IP range for containers
```

### **Network Topology:**

```
┌─────────────────────────────────────────────────────┐
│           autoguard_network (172.20.0.0/16)        │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Frontend │───→│ Backend  │───→│Postgres  │     │
│  │172.20.0.2│    │172.20.0.3│    │172.20.0.4│     │
│  └──────────┘    └──────────┘    └──────────┘     │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  Redis   │    │ Nagios   │    │Prometheus│     │
│  │172.20.0.5│    │172.20.0.6│    │172.20.0.7│     │
│  └──────────┘    └──────────┘    └──────────┘     │
└─────────────────────────────────────────────────────┘
         ↑
         │ All containers can talk to each other by NAME
         │
         Example:
         Backend connects to: postgresql://postgres:5432
                              Not: postgresql://172.20.0.4:5432
```

### **DNS Resolution:**

Docker provides **automatic DNS** for container names:

```python
# Backend code can use hostnames:
DATABASE_URL = "postgresql://postgres:5432/autoguard_db"
REDIS_URL = "redis://redis:6379"

# Docker translates:
postgres → 172.20.0.4
redis    → 172.20.0.5
nagios   → 172.20.0.6
```

---

## 💾 Docker Volumes (Data Persistence)

### **The Problem:**

```
Container is TEMPORARY:
1. Start container → Create files
2. Stop container → Files DELETED!
3. Start again → Fresh container, files GONE!
```

### **The Solution: Volumes**

```yaml
volumes:
  postgres_data:      # ← Database files survive restarts
  redis_data:         # ← Cache data survives restarts
  nagios_var:         # ← Nagios logs survive restarts
  prometheus_data:    # ← Metrics survive restarts
  grafana_data:       # ← Dashboards survive restarts
```

### **How Volumes Work:**

```
┌────────────────────────────────────────────────────┐
│  Host Machine (Your Computer)                      │
│                                                     │
│  C:\Docker\volumes\                                │
│  ├── postgres_data\         ← Actual database files│
│  │   └── pgdata\                                   │
│  ├── redis_data\            ← Cache files          │
│  └── nagios_var\            ← Logs                 │
│                                                     │
│  ┌──────────────────────────────────────┐         │
│  │  Container: autoguard_postgres       │         │
│  │                                      │         │
│  │  /var/lib/postgresql/data ────→ postgres_data  │
│  │       (mounted volume)               │         │
│  └──────────────────────────────────────┘         │
└────────────────────────────────────────────────────┘

Result:
✅ Stop container → Data stays in volume
✅ Start container → Data loads from volume
✅ Delete container → Data STILL in volume
✅ Update container → Data preserved
```

### **Two Types of Volumes:**

#### **1. Named Volumes (Data Persistence)**

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
      ↑                    ↑
   Volume name        Container path
```

#### **2. Bind Mounts (Code Sharing)**

```yaml
volumes:
  - ./backend:/app
      ↑         ↑
   Host path  Container path
```

**Difference:**

```
Named Volume:
- Docker manages location
- Survives container deletion
- Best for data (databases, logs)

Bind Mount:
- You specify exact host path
- Share code with container
- Best for development (live reload)
```

---

## 🚀 Docker Commands for AutoGuard

### **Starting AutoGuard:**

```bash
# Start all services (build if needed)
docker-compose up -d

# What happens:
# 1. Reads docker-compose.yml
# 2. Builds custom images (backend, frontend, nagios, ansible)
# 3. Pulls pre-built images (postgres, redis, nginx, etc.)
# 4. Creates network (autoguard_network)
# 5. Creates volumes (postgres_data, redis_data, etc.)
# 6. Starts containers in dependency order:
#    - postgres, redis (first)
#    - backend (after postgres, redis healthy)
#    - frontend (after backend)
#    - nginx (after frontend, backend)
# 7. Runs in background (-d = detached)

# Result: All 11 containers running!
```

### **Viewing Running Containers:**

```bash
docker-compose ps

# Output:
NAME                   IMAGE               STATUS
autoguard_backend      autoguard_backend   Up 2 hours
autoguard_frontend     autoguard_frontend  Up 2 hours
autoguard_postgres     postgres:15         Up 2 hours (healthy)
autoguard_redis        redis:7-alpine      Up 2 hours (healthy)
autoguard_nginx        nginx:alpine        Up 2 hours
autoguard_nagios       autoguard_nagios    Up 2 hours
autoguard_prometheus   prom/prometheus     Up 2 hours
autoguard_grafana      grafana/grafana     Up 2 hours
```

### **Viewing Logs:**

```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs backend
docker-compose logs frontend

# Follow logs (real-time)
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### **Restarting Containers:**

```bash
# Restart all
docker-compose restart

# Restart one service
docker-compose restart backend

# Rebuild and restart (after code changes)
docker-compose up -d --build
```

### **Stopping AutoGuard:**

```bash
# Stop all containers (keep volumes)
docker-compose stop

# Stop and remove containers (keep volumes)
docker-compose down

# Stop and remove EVERYTHING (including volumes)
docker-compose down -v

# DANGER: This deletes your database!
```

### **Accessing Container Shell:**

```bash
# Enter backend container
docker-compose exec backend bash

# Now you're inside the container:
root@autoguard_backend:/app# ls
root@autoguard_backend:/app# python
root@autoguard_backend:/app# exit

# Enter database container
docker-compose exec postgres psql -U autoguard_user -d autoguard_db

# Now you can run SQL:
autoguard_db=# SELECT * FROM services;
autoguard_db=# \q
```

### **Debugging:**

```bash
# Check container health
docker-compose ps

# Inspect container
docker inspect autoguard_backend

# Check networks
docker network ls
docker network inspect autoguard_network

# Check volumes
docker volume ls
docker volume inspect postgres_data

# View container processes
docker-compose top

# View resource usage
docker stats
```

---

## ⚡ Why Docker is Essential

### **1. Environment Consistency**

```
Developer 1 (Windows):
✅ docker-compose up
✅ Everything works!

Developer 2 (Mac):
✅ docker-compose up
✅ Everything works! (same environment)

Production Server (Linux):
✅ docker-compose up
✅ Everything works! (same environment)

Traditional Approach:
❌ "Works on my machine!"
❌ Different Python versions
❌ Missing dependencies
❌ Configuration differences
```

### **2. Easy Setup**

```
Without Docker:
1. Install Python 3.11 (30 min)
2. Install PostgreSQL (20 min)
3. Install Redis (15 min)
4. Install Node.js (10 min)
5. Install Nagios (60 min)
6. Configure everything (120 min)
7. Debug conflicts (180 min)
Total: ~7 hours

With Docker:
1. Install Docker (10 min)
2. Run docker-compose up (5 min)
Total: 15 minutes
```

### **3. Isolation**

```
Without Docker:
Project A needs Python 3.9 ─┐
                             ├─→ CONFLICT! ❌
Project B needs Python 3.11 ─┘

With Docker:
Project A: Python 3.9 in container ✅
Project B: Python 3.11 in container ✅
Both run simultaneously! ✅
```

### **4. Easy Cleanup**

```
Without Docker:
Uninstall PostgreSQL ❌ (leaves files)
Uninstall Redis ❌ (config remains)
Remove Python packages ❌ (dependencies mess)
Total mess: Reinstall OS 😭

With Docker:
docker-compose down -v ✅
Everything gone! Clean system! 🎉
```

### **5. Scalability**

```yaml
# Need more web servers? Just add:
webserver3:
  image: nginx:alpine
  container_name: webserver3
  networks:
    - autoguard_network

# Scale a service:
docker-compose up -d --scale webserver1=5
# Now 5 web server instances!
```

---

## 🎯 Docker in AutoGuard: Complete Picture

### **Data Flow with Docker:**

```
1. USER opens http://localhost:3000
   ↓
2. Browser talks to Docker container: autoguard_frontend
   ↓
3. React app calls API: http://localhost:5000/api
   ↓
4. Request goes to Docker container: autoguard_nginx
   ↓
5. Nginx routes to: autoguard_backend
   ↓
6. Flask queries: autoguard_postgres (database)
   ↓
7. Flask checks: autoguard_redis (cache)
   ↓
8. Flask calls: autoguard_nagios (monitoring status)
   ↓
9. Response flows back through containers
   ↓
10. User sees dashboard!

All communication happens on autoguard_network (virtual network)
All data persists in Docker volumes
All services isolated in containers
```

### **Auto-Healing with Docker:**

```
1. Nagios detects: webserver1 is DOWN
   ↓
2. Nagios event handler runs Python script
   ↓
3. Script calls Docker API:
   docker restart webserver1
   ↓
4. Docker restarts container in 2 seconds
   ↓
5. Service back online!
   ↓
6. Dashboard updates (WebSocket)
```

---

## 📊 Summary: Docker in AutoGuard

| Aspect | How Docker is Used |
|--------|-------------------|
| **Orchestration** | docker-compose.yml manages 11 containers |
| **Backend** | Python Flask in custom container |
| **Frontend** | React in custom container |
| **Database** | PostgreSQL in official container |
| **Cache** | Redis in official container |
| **Monitoring** | Nagios in custom container |
| **Networking** | Bridge network connects all containers |
| **Data** | 8 volumes persist data across restarts |
| **Ports** | 9 ports exposed (3000, 5000, 5432, etc.) |
| **Commands** | docker-compose up/down/logs/restart |
| **Benefits** | Easy setup, isolation, portability |

---

## 🎉 Key Takeaways

1. **Docker Compose** = Master orchestrator (one file controls everything)
2. **11 Containers** = 11 isolated services working together
3. **Networking** = Containers talk by name (DNS resolution)
4. **Volumes** = Data persists across container restarts
5. **Dockerfiles** = Custom images for backend, frontend, Nagios
6. **One Command** = `docker-compose up` starts entire platform
7. **Portability** = Same setup works on Windows, Mac, Linux
8. **Isolation** = No conflicts, clean environment
9. **Auto-Healing** = Docker API allows restarting containers

**Docker is the BACKBONE of AutoGuard - without it, the project wouldn't work!** 🐳

---

*AutoGuard Docker Documentation - Complete Guide*  
*November 11, 2025* 🛡️
