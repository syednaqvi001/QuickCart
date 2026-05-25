# QuickCart - Complete Setup Guide

Complete step-by-step guide to set up and run the QuickCart application locally using Docker Compose.

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Docker** - Install from [docker.com](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** - Usually comes with Docker Desktop
3. **Git** - For version control
4. **Node.js 18+** - For local development (optional, not needed for Docker)

### Verify Installation
```bash
docker --version        # Docker version
docker-compose --version  # Docker Compose version
git --version          # Git version
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Clone/Navigate to Project
```bash
cd QuickCart
```

### Step 2: Setup Environment Variables
```bash
# Copy the example .env file
cp .env.example .env

# The default .env should work fine for local development
cat .env  # Review the configuration
```

### Step 3: Start All Services
```bash
# Build images and start services
docker-compose up --build

# This will:
# ✅ Build all service images
# ✅ Start PostgreSQL database
# ✅ Start Redis cache
# ✅ Start RabbitMQ message queue
# ✅ Start MinIO object storage
# ✅ Start NGINX gateway
# ✅ Start all 6 microservices
# ✅ Start frontend
```

### Step 4: Access Services

Once all services are running (look for "ready to accept connections" in logs):

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web application |
| API Gateway | http://localhost | REST APIs |
| RabbitMQ Dashboard | http://localhost:15672 | Message queue admin (guest/guest) |
| MinIO Console | http://localhost:9001 | Object storage admin (minioadmin/minioadmin) |

### Step 5: Create Test Account

Using Postman or curl:
```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'

# Response:
# {
#   "message": "User registered successfully",
#   "data": {
#     "id": "uuid",
#     "email": "test@example.com",
#     "firstName": "John",
#     "lastName": "Doe",
#     "role": "USER"
#   }
# }
```

---

## 🐳 Docker Compose Operations

### View Service Status
```bash
# Check all services
docker-compose ps

# View service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service
docker-compose logs -f product-service

# Follow logs with timestamps
docker-compose logs -f --timestamps
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart auth-service

# Restart with rebuild
docker-compose up -d --build
```

### Stop Services
```bash
# Stop all services (keeps data)
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# Stop in background
docker-compose stop
```

### Clean Up
```bash
# Remove stopped containers
docker-compose rm

# Prune unused images
docker image prune -a

# Clear all Docker resources (WARNING: destructive)
docker system prune -a --volumes
```

---

## 🔧 Environment Configuration

### Important Variables

Update `.env` if needed:

```bash
# Database
DB_USER=quickcart          # PostgreSQL user
DB_PASSWORD=quickcart123   # PostgreSQL password
DB_NAME=quickcart_db       # Database name

# JWT
JWT_SECRET=change-this-in-production
JWT_EXPIRATION=15m

# MinIO S3 Storage
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
```

### Create .env File
```bash
# Copy from example
cp .env.example .env

# Edit as needed
nano .env  # or use your editor

# Source it in shell
source .env
```

---

## 🗄️ Database Setup

### Access PostgreSQL
```bash
# Connect to PostgreSQL container
docker-compose exec postgres psql -U quickcart -d quickcart_db

# Useful commands:
# \dt              - List tables
# \l               - List databases
# \c quickcart_db  - Connect to database
# SELECT * FROM users; - Query users
# \q               - Quit
```

### Run Migrations

Migrations happen automatically when services start:

```bash
# If needed, manually run migrations in a service
docker-compose exec auth-service npx prisma migrate dev

# View migration status
docker-compose exec auth-service npx prisma migrate status
```

### Database Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U quickcart quickcart_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U quickcart quickcart_db < backup.sql
```

---

## 🔌 Service Details

### Auth Service (Port 3001)

**Base URL:** `http://localhost:3001`

**Key Endpoints:**
```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

# Verify Token
GET /api/auth/verify
Headers: Authorization: Bearer YOUR_TOKEN

# Refresh Token
POST /api/auth/refresh-token
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

### Product Service (Port 3002)

**Base URL:** `http://localhost:3002`

**Key Endpoints:**
```bash
GET /api/products
GET /api/products/:id
GET /api/products/search?query=apple
GET /api/categories
```

### Cart Service (Port 3003)

**Base URL:** `http://localhost:3003`

```bash
GET /api/cart
POST /api/cart/items
PUT /api/cart/items/:id
DELETE /api/cart/items/:id
```

### Order Service (Port 3004)

**Base URL:** `http://localhost:3004`

```bash
POST /api/orders
GET /api/orders
GET /api/orders/:id
```

### More services in ARCHITECTURE.md

---

## 🧪 Testing

### Using curl

```bash
# 1. Register
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@1234","firstName":"Test","lastName":"User"}'

# 2. Login (save token)
TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@1234"}' | jq -r '.data.accessToken')

# 3. Verify token
curl -X GET http://localhost/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"

# 4. Get products
curl -X GET http://localhost/api/products \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import `postman/QuickCart.postman_collection.json`
2. Set environment: `postman/environment.postman_environment.json`
3. Run requests

### Manual Testing

```bash
# Check service health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health

# Check NGINX
curl http://localhost/health

# Response:
# {"status":"ok","service":"auth-service","timestamp":"..."}
```

---

## 🐛 Troubleshooting

### Services Won't Start

**Problem:** `docker-compose up` fails immediately

**Solution:**
```bash
# Check logs
docker-compose logs

# Verify Docker daemon
docker ps

# Restart Docker Desktop and try again

# Check ports are available
netstat -tuln | grep 3001  # Should be empty
```

### Database Connection Error

**Problem:** "Cannot connect to database"

**Solution:**
```bash
# Ensure PostgreSQL is healthy
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Wait for database
sleep 10 && docker-compose logs postgres

# If still failing, restart database
docker-compose restart postgres
```

### Port Already in Use

**Problem:** "Port 3001 already in use"

**Solution:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Out of Disk Space

**Problem:** Docker image build fails

**Solution:**
```bash
# Clean up Docker
docker system prune -a --volumes

# Try again
docker-compose up --build
```

### Service Crashes Repeatedly

**Problem:** Container exits immediately

**Solution:**
```bash
# Check service logs
docker-compose logs auth-service

# Common issues:
# - Database not ready: wait longer
# - Invalid environment variables: check .env
# - Port conflict: change port
# - Memory issue: increase Docker resources
```

---

## 📊 Performance Tips

### Increase Docker Resources

For better performance:

1. **Docker Desktop Settings:**
   - Memory: 4GB minimum (8GB recommended)
   - CPUs: 4 cores minimum (6 recommended)
   - Disk: 50GB available space

2. **Docker Compose:**
```bash
# Run in background
docker-compose up -d --build

# Monitor resources
docker stats
```

### Database Performance

```bash
# Check index usage
docker-compose exec postgres psql -U quickcart -d quickcart_db \
  -c "SELECT * FROM pg_stat_user_indexes;"

# Analyze database
docker-compose exec postgres psql -U quickcart -d quickcart_db \
  -c "ANALYZE;"
```

---

## 📚 Development Workflow

### Local Development

If you want to run services locally instead of Docker:

```bash
# 1. Start only infrastructure
docker-compose up postgres redis rabbitmq minio

# 2. In terminal 1: Auth Service
cd services/auth-service
npm install
npm run dev

# 3. In terminal 2: Product Service
cd services/product-service
npm install
npm run dev

# 4. In terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### Adding a New Service

1. **Create folder:**
   ```bash
   mkdir -p services/new-service/src
   ```

2. **Add to docker-compose.yml**

3. **Implement NestJS service**

4. **Update NGINX config**

---

## 🔐 Security Notes

### For Production

1. **Change secrets:**
   ```bash
   # Generate strong secrets
   openssl rand -base64 32  # For JWT_SECRET
   ```

2. **Update environment variables**

3. **Enable HTTPS:**
   ```bash
   # Use Let's Encrypt certificates
   # Update NGINX config
   ```

4. **Database credentials:**
   ```bash
   # Use strong passwords
   # Don't commit .env to git
   ```

### Security Checklist

- [ ] JWT_SECRET changed from default
- [ ] Database password is strong
- [ ] CORS origins configured
- [ ] HTTPS enabled (production)
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] RBAC configured
- [ ] Secrets not in version control

---

## 📞 Getting Help

### Check Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [docs/API_REFERENCE.md](docs/API_REFERENCE.md) - API documentation
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - More solutions

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f [service-name]

# Last 50 lines
docker-compose logs --tail=50
```

### Health Checks

```bash
# Check all services
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All containers running: `docker-compose ps`
- [ ] Database connected: `curl http://localhost:3001/health`
- [ ] Can register user
- [ ] Can login
- [ ] Can generate JWT token
- [ ] NGINX routing works
- [ ] RabbitMQ accessible
- [ ] MinIO accessible
- [ ] Frontend loads
- [ ] API endpoints respond

---

## 🎉 You're Ready!

QuickCart is now set up and running. Start by:

1. Creating a user account
2. Exploring the APIs with Postman
3. Building features on top
4. Customizing for your needs

**Happy coding!** 🚀

---

## Quick Reference

```bash
# Start everything
docker-compose up --build

# View logs
docker-compose logs -f [service]

# Stop everything
docker-compose down

# Clean everything
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Run commands in container
docker-compose exec [service] [command]

# View running services
docker-compose ps
```
