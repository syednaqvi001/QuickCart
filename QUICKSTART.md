# QuickCart - Quick Start Guide (5 minutes) ⚡

The fastest way to get QuickCart running on your local machine.

---

## Prerequisites

Make sure you have:
- Docker & Docker Compose installed
- A terminal/command prompt

---

## Step 1: Setup (1 minute)

```bash
# Navigate to QuickCart directory
cd QuickCart

# Create .env file from template
cp .env.example .env

# That's it! No manual configuration needed for local dev
```

---

## Step 2: Start (2 minutes)

```bash
# Start all services (PostgreSQL, Redis, RabbitMQ, MinIO, NGINX, Services)
docker-compose up --build

# First time? This will take 2-3 minutes to build all images
# Subsequent starts are faster (~30 seconds)
```

**Wait for this message:**
```
✅ Auth Service running on http://localhost:3001
```

---

## Step 3: Test (1 minute)

Open another terminal and test the API:

```bash
# 1. Register a user
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test@1234",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Should return: {"message": "User registered successfully", "data": {...}}
```

```bash
# 2. Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test@1234"
  }'

# Save the accessToken from response
```

```bash
# 3. Verify token (replace TOKEN with your actual token)
curl -X GET http://localhost/api/auth/verify \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Should return: {"message": "Token is valid", "data": {...}}
```

---

## 🎉 Success!

QuickCart is running! Here's what you have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web UI (coming soon) |
| **API** | http://localhost | REST API Gateway |
| **Auth Service** | http://localhost:3001 | User authentication |
| **RabbitMQ** | http://localhost:15672 | Message queue (guest/guest) |
| **MinIO** | http://localhost:9001 | File storage (minioadmin/minioadmin) |
| **PostgreSQL** | localhost:5432 | Database (quickcart/quickcart123) |

---

## 📚 Next Steps

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
```

### Stop Services
```bash
# Stop all (keeps data)
docker-compose down

# Stop and remove everything
docker-compose down -v
```

### Access Database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U quickcart -d quickcart_db

# Useful commands:
# \dt              - List tables
# SELECT * FROM users; - View users
# \q               - Exit
```

### Use Postman

1. Import: `postman/QuickCart.postman_collection.json`
2. Set environment: `postman/environment.postman_environment.json`
3. Test all endpoints with pre-configured requests

---

## 🚨 Troubleshooting

### Ports Already in Use
```bash
# Change ports in docker-compose.yml
# OR
lsof -i :3001  # Find process
kill -9 <PID>  # Kill it
```

### Services Not Starting
```bash
# Check logs
docker-compose logs

# Rebuild
docker-compose down -v
docker-compose up --build
```

### Database Connection Failed
```bash
# Wait longer for postgres
sleep 10 && docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

---

## 📖 Detailed Documentation

- **Full Setup** → See `SETUP_GUIDE.md`
- **Architecture** → See `ARCHITECTURE.md`
- **Folder Structure** → See `FOLDER_STRUCTURE.md`
- **API Reference** → See `docs/API_REFERENCE.md` (Phase 2)
- **Phase 1 Summary** → See `PHASE_1_COMPLETE.md`

---

## 💡 Key Features Implemented

✅ **Authentication** - Register, login, JWT tokens
✅ **Authorization** - Role-based access control
✅ **API Gateway** - NGINX routing
✅ **Database** - PostgreSQL with Prisma ORM
✅ **Caching** - Redis ready
✅ **Message Queue** - RabbitMQ configured
✅ **File Storage** - MinIO setup
✅ **Containerization** - Docker & Docker Compose
✅ **Security** - Password hashing, JWT, CORS
✅ **Documentation** - Comprehensive guides

---

## 🎯 What's Working Now

- ✅ User registration & login
- ✅ JWT token generation & validation
- ✅ Role-based authorization
- ✅ User profile management
- ✅ Token refresh
- ✅ API Gateway routing
- ✅ All infrastructure services

## 🚀 Coming Next (Phases 2-7)

- 🎯 Product Service (CRUD, inventory, search)
- 🎯 Cart Service (shopping cart)
- 🎯 Order Service (checkout, tracking)
- 🎯 Event-Driven System (RabbitMQ events)
- 🎯 Delivery Service (tracking, Socket.IO)
- 🎯 Frontend (React, TypeScript)

---

## 📊 Architecture Overview

```
Frontend (React)
       ↓
   NGINX (Port 80)
       ↓
   ┌───┴────┬────────┬─────────┐
   ↓        ↓        ↓         ↓
 Auth   Product   Cart      Order
       ↓        ↓         ↓
    PostgreSQL  Redis  RabbitMQ
```

---

## ⚙️ Common Commands

```bash
# Start
docker-compose up --build

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart auth-service

# Execute command
docker-compose exec auth-service npm run dev

# Remove everything
docker-compose down -v
```

---

## ✨ Tips & Tricks

1. **Save API Token**
   ```bash
   TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test@1234"}' | jq -r '.data.accessToken')
   echo $TOKEN
   ```

2. **Test with Saved Token**
   ```bash
   curl -X GET http://localhost/api/auth/verify \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Monitor Services**
   ```bash
   docker stats
   ```

4. **View Database**
   ```bash
   docker-compose exec postgres psql -U quickcart -d quickcart_db
   ```

---

## 📞 Need Help?

1. **Check logs** → `docker-compose logs -f`
2. **Read guides** → See `SETUP_GUIDE.md`
3. **Review architecture** → See `ARCHITECTURE.md`
4. **Common issues** → See `docs/TROUBLESHOOTING.md`

---

## 🎓 Learning Resources

This project demonstrates:
- Microservices architecture
- Event-driven design
- API gateway pattern
- JWT authentication
- Database design
- Docker containerization
- NestJS framework
- Prisma ORM
- RBAC patterns

Perfect for:
- Learning modern backend architecture
- Building portfolio projects
- Interview preparation
- SaaS foundation

---

## 🚀 You're All Set!

QuickCart is running. Explore the code, add features, and build something amazing!

**Happy coding!** ✨

---

**Questions?** Check the documentation files in the project root.

