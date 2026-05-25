# QuickCart - Production-Grade Grocery Delivery Platform

**A complete microservices-based grocery delivery platform** built with modern cloud-native technologies. Perfect for learning, portfolios, and as a foundation for real-world applications.

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- Git

### 1. Clone and Setup
```bash
cd QuickCart
cp .env.example .env
```

### 2. Start Everything
```bash
docker-compose up --build
```

### 3. Access Services
| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| API Gateway | http://localhost | - |
| NGINX | http://localhost | - |
| RabbitMQ Dashboard | http://localhost:15672 | guest/guest |
| MinIO Console | http://localhost:9001 | minioadmin/minioadmin |
| PostgreSQL | localhost:5432 | quickcart/quickcart123 |
| Redis | localhost:6379 | - |

---

## 📋 Project Overview

QuickCart simulates a real-world grocery delivery platform like Instacart, Blinkit, Zepto, or Swiggy Instamart using a **microservices architecture** with:

✅ **6 Independent Microservices** - Each handling specific business domains
✅ **Event-Driven Communication** - RabbitMQ for async processing
✅ **Real-Time Tracking** - Socket.IO for live delivery updates
✅ **Scalable Architecture** - Easy to add more services or scale horizontally
✅ **Production-Ready Code** - Clean, modular, and well-documented
✅ **Complete Frontend** - React with TypeScript and Tailwind CSS
✅ **Docker Containerized** - Run everything locally with Docker Compose

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (3000)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              NGINX API Gateway (Port 80)                    │
│    Routes requests to appropriate microservices             │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
   ┌────▼────┐   ┌─────▼────┐  ┌─────▼────┐  ┌─────▼────┐
   │Auth Srv.│   │Product Sv│  │Cart Srv. │  │Order Srv.│
   │ (3001)  │   │  (3002)  │  │  (3003)  │  │  (3004)  │
   └────┬────┘   └────┬─────┘  └────┬─────┘  └─────┬────┘
        │             │             │              │
        │        ┌────▼─────────────▼──────┐      │
        │        │   Notification Service  │◄─────┤
        │        │    Delivery Service     │      │
        │        │      (3005, 3006)       │      │
        │        └────────────────────────┘      │
        │                                         │
        └──────────────┬──────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌─────▼────┐  ┌─────▼────┐
   │PostgreSQL│   │RabbitMQ  │  │  Redis   │
   │(Database)│   │(Events)  │  │ (Cache)  │
   └──────────┘   └──────────┘  └──────────┘
```

---

## 🔧 Microservices

### 1. **Auth Service** (Port 3001)
Handles authentication, authorization, and user management.

**Key Features:**
- User registration & login
- JWT token management
- Role-based access control (USER, ADMIN, DELIVERY_AGENT)
- Password hashing with bcrypt
- Token refresh mechanism

**Database:** PostgreSQL (auth_db)

---

### 2. **Product Service** (Port 3002)
Manages products, categories, inventory, and images.

**Key Features:**
- Product CRUD operations
- Category management
- Inventory tracking
- Image uploads to MinIO
- Redis caching for performance
- Product search & filtering

**Database:** PostgreSQL (product_db)
**Cache:** Redis

---

### 3. **Cart Service** (Port 3003)
Handles shopping cart operations.

**Key Features:**
- Add/remove cart items
- Update quantities
- Cart persistence in Redis
- Cart sync across devices
- Cart calculations

**Database:** Redis (in-memory, with optional PostgreSQL backup)

---

### 4. **Order Service** (Port 3004)
Manages orders and publishes events.

**Key Features:**
- Order placement from cart
- Order status tracking
- Order history
- RabbitMQ event publishing
- Integration with product & cart services

**Database:** PostgreSQL (order_db)
**Events Published:**
- `order.created`
- `order.confirmed`
- `order.shipped`
- `order.delivered`

---

### 5. **Notification Service** (Port 3005)
Consumes events and sends notifications.

**Key Features:**
- RabbitMQ event consumption
- Email notifications (simulated)
- SMS notifications (simulated)
- Notification history
- User notification preferences

**Database:** PostgreSQL (notification_db)

---

### 6. **Delivery Service** (Port 3006)
Manages delivery tracking and agent assignment.

**Key Features:**
- Delivery agent management
- Real-time delivery tracking (Socket.IO)
- Order assignment to agents
- Live location updates
- Delivery status management

**Database:** PostgreSQL (delivery_db)
**Real-Time:** Socket.IO

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts with roles
- **products** - Product catalog
- **categories** - Product categories
- **carts** - Shopping carts
- **orders** - Customer orders
- **order_items** - Items in orders
- **deliveries** - Delivery tracking
- **delivery_agents** - Delivery personnel
- **notifications** - Notification history

See `docs/DATABASE_SCHEMA.md` for complete schema.

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh-token     - Refresh JWT token
GET    /api/auth/verify            - Verify token validity
POST   /api/auth/logout            - Logout user
```

### Products
```
GET    /api/products               - List all products
GET    /api/products/:id           - Get product details
GET    /api/products/search        - Search products
POST   /api/products               - Create product (admin)
PUT    /api/products/:id           - Update product (admin)
DELETE /api/products/:id           - Delete product (admin)
```

### Cart
```
GET    /api/cart                   - Get user's cart
POST   /api/cart/items             - Add item to cart
PUT    /api/cart/items/:id         - Update cart item
DELETE /api/cart/items/:id         - Remove from cart
DELETE /api/cart                   - Clear cart
```

### Orders
```
POST   /api/orders                 - Place new order
GET    /api/orders                 - Get user's orders
GET    /api/orders/:id             - Get order details
PUT    /api/orders/:id/status      - Update order status (admin)
```

### Notifications
```
GET    /api/notifications          - Get user's notifications
PUT    /api/notifications/:id/read - Mark as read
```

### Delivery
```
GET    /api/deliveries/:orderId    - Get delivery details
POST   /api/deliveries/:orderId    - Create delivery
PUT    /api/deliveries/:orderId    - Update delivery status
GET    /api/delivery-agents        - List delivery agents
```

See `docs/API_REFERENCE.md` for complete API documentation.

---

## 🎯 Features

### User Features
- ✅ Browse products by category
- ✅ Search & filter products
- ✅ Add items to cart
- ✅ Checkout & place orders
- ✅ Track delivery in real-time
- ✅ View order history
- ✅ Receive notifications
- ✅ Manage profile

### Admin Features
- ✅ Add/edit/delete products
- ✅ Manage inventory
- ✅ Upload product images
- ✅ View all orders
- ✅ View delivery metrics
- ✅ Manage users & roles

### Delivery Agent Features
- ✅ View assigned orders
- ✅ Update delivery status
- ✅ Share live location
- ✅ Report delivery completion

---

## 🛠️ Development Setup

### Local Development (Without Docker)

#### 1. Install Dependencies

```bash
# Auth Service
cd services/auth-service
npm install

# Product Service
cd ../product-service
npm install

# ... (repeat for other services)

# Frontend
cd ../../frontend
npm install
```

#### 2. Setup Environment Variables

```bash
# Copy .env.example files
cp services/auth-service/.env.example services/auth-service/.env
cp services/product-service/.env.example services/product-service/.env
# ... (repeat for other services)
cp frontend/.env.example frontend/.env
```

#### 3. Start Services

```bash
# Terminal 1: Auth Service
cd services/auth-service
npm run dev

# Terminal 2: Product Service
cd services/product-service
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev

# ... (etc.)
```

#### 4. Start PostgreSQL, Redis, RabbitMQ

```bash
# Using Docker for infrastructure only
docker-compose -f docker-compose.dev.yml up
```

---

## 📦 Docker Deployment

### Build & Run Everything

```bash
# Build all images and start services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service

# Stop all services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

---

## 🧪 Testing

### Using Postman
1. Import `postman/QuickCart.postman_collection.json`
2. Set environment: `postman/environment.postman_environment.json`
3. Run requests

### API Testing Examples

```bash
# Register user
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get products (with token)
curl -X GET http://localhost/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔐 Security

✅ JWT authentication & authorization
✅ Role-based access control (RBAC)
✅ Bcrypt password hashing
✅ Environment variable secrets
✅ CORS configuration
✅ Input validation & sanitization
✅ Secure password reset flow
✅ Rate limiting ready (configurable)

---

## 📈 Performance

✅ Redis caching for products
✅ Database connection pooling
✅ Pagination on list endpoints
✅ Lazy loading in frontend
✅ Optimized database queries
✅ Asynchronous event processing

---

## 🚨 Troubleshooting

### Services won't start
```bash
# Check Docker daemon
docker --version

# View service logs
docker-compose logs auth-service

# Restart services
docker-compose down
docker-compose up --build
```

### Database connection errors
```bash
# Wait for PostgreSQL to be healthy
docker-compose logs postgres

# Check database URL in .env
# Default: postgresql://quickcart:quickcart123@postgres:5432/quickcart_db
```

### Port conflicts
```bash
# Change ports in docker-compose.yml
# Or kill existing processes
lsof -i :3001  # Find process on port 3001
kill -9 <PID>
```

### RabbitMQ not working
```bash
# Access RabbitMQ management UI
http://localhost:15672  # Default: guest/guest

# Check RabbitMQ logs
docker-compose logs rabbitmq
```

See `docs/TROUBLESHOOTING.md` for more solutions.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design & architecture |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Project structure overview |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | Complete API documentation |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Database design |
| [docs/EVENT_FLOWS.md](docs/EVENT_FLOWS.md) | Event-driven patterns |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Development guide |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues & solutions |

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ Microservices architecture patterns
- ✅ Event-driven architecture with RabbitMQ
- ✅ RESTful API design
- ✅ Database design & optimization
- ✅ Authentication & authorization (JWT, RBAC)
- ✅ Caching strategies (Redis)
- ✅ Docker & containerization
- ✅ Real-time communication (Socket.IO)
- ✅ Frontend architecture (React, TypeScript, Zustand)
- ✅ Clean code & SOLID principles

Perfect for:
- 📖 Learning microservices
- 💼 Portfolio projects
- 🎯 Interview preparation
- 🚀 SaaS foundation
- ☁️ Cloud deployment practice

---

## 🤝 Contributing

To extend QuickCart:

1. **Add a new service** - Copy service template, implement business logic
2. **Add features** - Extend existing services
3. **Improve frontend** - Add new pages & components
4. **Add tests** - Implement Jest tests
5. **Documentation** - Update docs for changes

---

## 📝 License

MIT License - Feel free to use for learning and projects.

---

## 🎯 Next Steps

1. **Start Services** - `docker-compose up --build`
2. **Register User** - Create account at frontend
3. **Browse Products** - View product catalog
4. **Add to Cart** - Test cart functionality
5. **Place Order** - Complete checkout
6. **Track Delivery** - View real-time tracking
7. **Explore APIs** - Use Postman collection

---

## 💡 Tips

- **Check logs** - `docker-compose logs -f [service-name]`
- **Inspect database** - Connect with DBeaver/pgAdmin to postgres:5432
- **Test APIs** - Use Postman collection or curl
- **Monitor services** - Watch Docker stats: `docker stats`
- **Reset everything** - `docker-compose down -v && docker-compose up --build`

---

## 🎉 You're Ready!

QuickCart is now running locally. Explore the codebase, modify services, add features, and build on top of this foundation.

**Happy coding!** 🚀

---

**Questions or Issues?** 
- Check `docs/TROUBLESHOOTING.md`
- Review service logs: `docker-compose logs`
- Examine ARCHITECTURE.md for design patterns
