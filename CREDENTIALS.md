# 🔐 AutoGuard - All Service Credentials

## Grafana (http://localhost:3001)
```
Username: admin
Password: admin123
```

## Nagios (http://localhost:8080/nagios)
```
Username: admin
Password: admin
```

## PostgreSQL Database (localhost:5432)
```
Host: localhost
Port: 5432
Database: monitoring_db
Username: devops_user
Password: secure_password123
```

## Redis Cache (localhost:6379)
```
Host: localhost
Port: 6379
Password: redis_password123
```

## Backend API (http://localhost:5000)
```
No authentication required (development mode)
```

## Frontend Dashboard (http://localhost:3000)
```
No authentication required
```

---

## 🔍 Why Grafana Login Failed?

**Problem:** You tried to login with:
- Username: `roshu24`
- Password: `*********`

**Solution:** Use the correct credentials:
- Username: `admin`
- Password: `admin123`

---

## 📝 How to Login to Grafana:

1. Go to http://localhost:3001/login
2. Clear the username field
3. Type: **admin**
4. Clear the password field  
5. Type: **admin123**
6. Click "Log in"

---

## 🔒 Security Note:

These are **development credentials**. For production deployment:
- Change all default passwords
- Enable authentication on all services
- Use environment variables for secrets
- Enable HTTPS/TLS
- Implement proper access controls

---

**Need to change passwords?** Edit `docker-compose.yml` and restart containers:
```bash
docker-compose restart grafana
```
