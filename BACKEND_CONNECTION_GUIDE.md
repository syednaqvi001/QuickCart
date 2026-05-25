# QuickCart Backend Connection Guide ✅

## 🎯 Current Status

- ✅ **Frontend:** Complete and running on http://localhost:5174 (or 5173)
- ✅ **Database Schema:** Created (init_database.sql with all tables)
- ✅ **Docker Compose:** Configured and ready
- ✅ **Environment:** .env file created
- 🔄 **Backend Services:** Ready to start (awaiting Docker Desktop)

---

## 🚀 Quick Start - 3 Steps

### Step 1: Start Docker Desktop
1. Click Windows Start menu
2. Search for **"Docker Desktop"**
3. Click to launch it
4. Wait for it to start (2-3 minutes)

### Step 2: Start Backend Services
Run this in your project root:
```bash
docker-compose up --build
```

Or use the convenient batch file:
- **Windows:** Double-click `START_BACKEND.bat`
- **Terminal:** `bash START_BACKEND.sh` (for Git Bash)

### Step 3: Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173** or **http://localhost:5174**

---

## 📋 What Gets Created

### Docker Services (Automatically Started)
| Service | Port | Purpose |
|---------|------|---------|
| **PostgreSQL** | 5432 | Main database |
| **Redis** | 6379 | Caching layer |
| **RabbitMQ** | 5672 | Message queue |
| **MinIO** | 9000/9001 | File storage |
| **NGINX** | 80 | API Gateway |
| **Auth Service** | 3001 | User authentication |
| **Product Service** | 3002 | Product management |
| **Cart Service** | 3003 | Shopping cart |
| **Order Service** | 3004 | Order processing |
| **Notification Service** | 3005 | Notifications |
| **Delivery Service** | 3006 | Delivery tracking |

### Database Tables Created Automatically
The PostgreSQL database will be initialized with:
- ✅ **users** - User accounts with roles
- ✅ **refresh_tokens** - JWT token management
- ✅ **categories** - Product categories (Fruits, Vegetables, Dairy, etc.)
- ✅ **products** - Product catalog (6 sample products)
- ✅ **product_images** - Product images
- ✅ **inventory** - Stock tracking
- ✅ **orders** - Customer orders
- ✅ **order_items** - Items in orders
- ✅ **deliveries** - Delivery information
- ✅ **delivery_agents** - Delivery personnel
- ✅ **delivery_tracking** - Tracking history
- ✅ **notifications** - User notifications
- ✅ **carts** - Shopping carts
- ✅ **cart_items** - Items in carts

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React 19)                        │
│         http://localhost:5173 (Vite dev server)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              NGINX API Gateway (Port 80)                     │
│              Routes to all microservices                     │
└────┬──────────┬──────────┬──────────┬──────────┬──────────┘
     │          │          │          │          │
     ▼          ▼          ▼          ▼          ▼
  Auth    Product    Cart     Order   Notification
  (3001)   (3002)   (3003)   (3004)    (3005)
                                       ▲
                                       │
                                 Delivery (3006)
```

### Service Communication
```
┌─────────────────────────────────────────────────────────┐
│            Infrastructure & Data Layer                  │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis   │  RabbitMQ  │   MinIO         │
│   (Database) │ (Cache)  │  (Queue)   │ (File Storage)  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Test Credentials

Once backend is running, use these to test:

### Regular User
```
Email: test@test.com
Password: Test@1234
Role: USER
```

### Admin User
```
Email: admin@example.com
Password: Admin@1234
Role: ADMIN
```

### Demo Mode
- Click "Try Demo Mode" on login page
- No credentials needed
- Full app functionality

---

## 📱 Frontend → Backend Connection

The frontend is already configured to connect to the backend:

### API Client (`src/api/client.ts`)
```typescript
const apiClient = axios.create({
  baseURL: 'http://localhost',  // NGINX Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### How It Works
1. Frontend makes request to `http://localhost`
2. NGINX routes to appropriate microservice
3. Service processes request
4. Response returned to frontend
5. Token automatically attached to requests

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT
- `GET /api/auth/verify` - Check token validity

**Products:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Product details
- `GET /api/products/search?query=` - Search products
- `GET /api/categories` - List categories

**Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Order details

**Cart:**
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item
- `PUT /api/cart/items/:id` - Update quantity
- `DELETE /api/cart/items/:id` - Remove item

---

## 🐛 Troubleshooting

### Docker Desktop Not Running
```
Error: Docker Desktop is unable to start
```
**Solution:** Manually start Docker Desktop from Windows Start menu

### Port Already in Use
```
Error: Port 5432 is already in use
```
**Solutions:**
1. Stop other PostgreSQL instances: `docker-compose down`
2. Check what's using the port: `netstat -ano | findstr :5432`
3. Kill the process if needed
4. Or change port in docker-compose.yml

### Services Won't Start
```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service

# Check service status
docker-compose ps
```

### Frontend Can't Connect to Backend
```
Error: Failed to fetch from http://localhost
```
**Solutions:**
1. Ensure docker-compose is running: `docker-compose ps`
2. Check NGINX is healthy: `docker-compose logs nginx`
3. Check backend services: `docker-compose logs auth-service`
4. Verify ports aren't blocked by firewall

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solutions:**
1. Ensure PostgreSQL container is running: `docker-compose ps postgres`
2. Check it's healthy: `docker-compose logs postgres`
3. Wait 30 seconds for database to initialize
4. Check connection string in .env file

---

## ✅ Verification Checklist

After starting services, verify:

- [ ] Docker Desktop is running
- [ ] `docker-compose ps` shows all containers running
- [ ] PostgreSQL is healthy (check logs)
- [ ] Can connect to http://localhost/health
- [ ] Frontend can reach backend (check browser console)
- [ ] Can login with test@test.com / Test@1234
- [ ] Can browse products (loaded from database)
- [ ] Can add items to cart
- [ ] Can place an order

---

## 🔄 Development Workflow

### Terminal 1: Backend
```bash
cd QuickCart
docker-compose up --build
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: Monitoring (Optional)
```bash
# Watch service logs
docker-compose logs -f

# Or for specific service
docker-compose logs -f auth-service
```

---

## 📊 Database Connection Details

### Direct Database Access
```bash
# Using psql (if installed)
psql -h localhost -U quickcart -d quickcart_db

# Connection string
postgresql://quickcart:quickcart123@localhost:5432/quickcart_db
```

### Using Database UI Tools
- **pgAdmin:** http://localhost:5050 (optional, not in docker-compose)
- **DBeaver:** Download and connect to `localhost:5432`
- **VS Code:** Use PostgreSQL extension

---

## 🚀 Performance Tips

1. **First Start is Slow** - Docker needs to build images (5-10 minutes)
2. **Subsequent Starts are Fast** - Only starts containers
3. **Database Init** - First startup initializes database (automatic)
4. **Rebuild Services**: `docker-compose up --build`
5. **Clean Everything**: `docker-compose down -v`

---

## 🔒 Security Notes

⚠️ **Development Only Configuration:**
- JWT secrets are hardcoded
- Database password visible in .env
- CORS is open to localhost
- Password validation is minimal

**For Production:**
- Use environment-based secrets
- Implement proper CORS policies
- Use strong database passwords
- Enable HTTPS/TLS
- Implement rate limiting
- Add input validation

---

## 📚 Additional Resources

| Document | Purpose |
|----------|---------|
| [START_HERE.md](START_HERE.md) | Quick overview |
| [RUNNING_THE_APP.md](RUNNING_THE_APP.md) | How to run the app |
| [FRONTEND_COMPLETE.md](FRONTEND_COMPLETE.md) | Frontend details |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed setup |

---

## 💡 Next Steps

1. **Start Docker Desktop** (if not running)
2. **Run docker-compose** in project root
3. **Wait for services** to be healthy (3-5 minutes)
4. **Start frontend** in another terminal
5. **Open browser** to http://localhost:5173
6. **Test the app** with demo mode or test credentials
7. **Check logs** if anything fails: `docker-compose logs`

---

## 🆘 Getting Help

If services won't start:

1. **Check Docker:** `docker ps`
2. **Check logs:** `docker-compose logs`
3. **Verify .env:** Should exist and match docker-compose.yml
4. **Check ports:** Ensure 5432, 6379, 80, 3001-3006 are free
5. **Restart everything:** `docker-compose down && docker-compose up --build`

---

**You're all set! Your QuickCart application is ready for full-stack development!** 🎉

Start with Step 1 above and follow the Quick Start guide.
