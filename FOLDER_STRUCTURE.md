# QuickCart - Complete Folder Structure

```
QuickCart/
│
├── .gitignore                          # Git ignore file
├── docker-compose.yml                  # Docker Compose configuration
├── ARCHITECTURE.md                     # Architecture documentation
├── FOLDER_STRUCTURE.md                # This file
├── README.md                           # Project README
├── SETUP_GUIDE.md                      # Setup & installation guide
│
│
├── frontend/                           # React Frontend
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   │
│   ├── public/
│   │   └── favicon.ico
│   │
│   └── src/
│       ├── main.tsx                   # Entry point
│       ├── App.tsx                    # Root component
│       ├── index.css                  # Global styles
│       │
│       ├── api/                       # API client setup
│       │   ├── client.ts              # Axios instance
│       │   ├── endpoints.ts           # API endpoints
│       │   └── types.ts               # API response types
│       │
│       ├── store/                     # State management (Zustand)
│       │   ├── authStore.ts
│       │   ├── cartStore.ts
│       │   ├── productStore.ts
│       │   └── notificationStore.ts
│       │
│       ├── hooks/                     # Custom hooks
│       │   ├── useAuth.ts
│       │   ├── useCart.ts
│       │   ├── useProducts.ts
│       │   └── useApi.ts
│       │
│       ├── components/                # Reusable components
│       │   ├── Navbar.tsx
│       │   ├── Sidebar.tsx
│       │   ├── ProductCard.tsx
│       │   ├── CartCard.tsx
│       │   ├── OrderCard.tsx
│       │   ├── Toast.tsx
│       │   ├── LoadingSpinner.tsx
│       │   ├── Modal.tsx
│       │   ├── Button.tsx
│       │   └── Input.tsx
│       │
│       ├── pages/                     # Route pages
│       │   ├── public/
│       │   │   ├── Home.tsx
│       │   │   ├── Login.tsx
│       │   │   ├── Signup.tsx
│       │   │   ├── ProductListing.tsx
│       │   │   └── ProductDetails.tsx
│       │   │
│       │   ├── user/
│       │   │   ├── Cart.tsx
│       │   │   ├── Checkout.tsx
│       │   │   ├── Orders.tsx
│       │   │   ├── OrderDetails.tsx
│       │   │   ├── DeliveryTracking.tsx
│       │   │   └── Profile.tsx
│       │   │
│       │   └── admin/
│       │       ├── Dashboard.tsx
│       │       ├── AddProduct.tsx
│       │       ├── ManageProducts.tsx
│       │       ├── ManageOrders.tsx
│       │       └── ManageInventory.tsx
│       │
│       ├── router/                    # React Router config
│       │   └── routes.tsx
│       │
│       ├── types/                     # TypeScript types
│       │   ├── user.ts
│       │   ├── product.ts
│       │   ├── order.ts
│       │   └── common.ts
│       │
│       ├── utils/                     # Utility functions
│       │   ├── formatting.ts
│       │   ├── validation.ts
│       │   └── constants.ts
│       │
│       └── assets/                    # Static assets
│           └── icons/
│
│
├── gateway-nginx/                     # NGINX Configuration
│   ├── Dockerfile
│   ├── nginx.conf                    # Main NGINX config
│   └── conf.d/
│       └── default.conf              # Service routing
│
│
├── services/                          # Microservices
│   │
│   ├── auth-service/                 # Auth Service (Port 3001)
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   │
│   │   ├── src/
│   │   │   ├── main.ts               # Entry point
│   │   │   │
│   │   │   ├── app.module.ts         # Root module
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── jwt.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── auth.decorator.ts
│   │   │   │   │   └── roles.decorator.ts
│   │   │   │   └── dtos/
│   │   │   │       ├── signup.dto.ts
│   │   │   │       ├── login.dto.ts
│   │   │   │       └── login-response.dto.ts
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── user.module.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── dtos/
│   │   │   │       └── user.dto.ts
│   │   │   │
│   │   │   ├── database/
│   │   │   │   ├── prisma.service.ts
│   │   │   │   └── schema.prisma
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── filters/
│   │   │   │   │   └── http-exception.filter.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── response.interceptor.ts
│   │   │   │   ├── pipes/
│   │   │   │   │   └── validation.pipe.ts
│   │   │   │   └── constants/
│   │   │   │       └── error-messages.ts
│   │   │   │
│   │   │   └── config/
│   │   │       └── configuration.ts
│   │   │
│   │   └── prisma/
│   │       ├── migrations/
│   │       └── schema.prisma
│   │
│   ├── product-service/              # Product Service (Port 3002)
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   │
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── product.module.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── dtos/
│   │   │   │   │   ├── create-product.dto.ts
│   │   │   │   │   └── update-product.dto.ts
│   │   │   │   └── entities/
│   │   │   │       └── product.entity.ts
│   │   │   │
│   │   │   ├── category/
│   │   │   │   ├── category.module.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   ├── category.controller.ts
│   │   │   │   └── dtos/
│   │   │   │       └── create-category.dto.ts
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── inventory.module.ts
│   │   │   │   ├── inventory.service.ts
│   │   │   │   ├── inventory.controller.ts
│   │   │   │   └── dtos/
│   │   │   │       └── update-inventory.dto.ts
│   │   │   │
│   │   │   ├── storage/
│   │   │   │   ├── minio.service.ts
│   │   │   │   └── storage.module.ts
│   │   │   │
│   │   │   ├── cache/
│   │   │   │   ├── redis.service.ts
│   │   │   │   └── cache.decorator.ts
│   │   │   │
│   │   │   ├── database/
│   │   │   │   └── prisma.service.ts
│   │   │   │
│   │   │   └── config/
│   │   │       └── configuration.ts
│   │   │
│   │   └── prisma/
│   │       ├── migrations/
│   │       └── schema.prisma
│   │
│   ├── cart-service/                 # Cart Service (Port 3003)
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   │
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── cart.module.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── cart.controller.ts
│   │   │   │   └── dtos/
│   │   │   │       ├── add-to-cart.dto.ts
│   │   │   │       └── update-cart-item.dto.ts
│   │   │   │
│   │   │   ├── cache/
│   │   │   │   └── redis.service.ts
│   │   │   │
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   │
│   │   │   └── config/
│   │   │       └── configuration.ts
│   │   │
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   ├── order-service/                # Order Service (Port 3004)
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   │
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── order.module.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── dtos/
│   │   │   │   │   ├── create-order.dto.ts
│   │   │   │   │   └── order-response.dto.ts
│   │   │   │   └── entities/
│   │   │   │       └── order.entity.ts
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── event.producer.ts
│   │   │   │   ├── event.types.ts
│   │   │   │   └── rabbitmq.service.ts
│   │   │   │
│   │   │   ├── database/
│   │   │   │   └── prisma.service.ts
│   │   │   │
│   │   │   └── config/
│   │   │       └── configuration.ts
│   │   │
│   │   └── prisma/
│   │       ├── migrations/
│   │       └── schema.prisma
│   │
│   ├── notification-service/         # Notification Service (Port 3005)
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   │
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   │
│   │   │   ├── notification/
│   │   │   │   ├── notification.module.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── notification.controller.ts
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── sms.service.ts
│   │   │   │   └── dtos/
│   │   │   │       └── notification.dto.ts
│   │   │   │
│   │   │   ├── events/
│   │   │   │   ├── event.consumer.ts
│   │   │   │   ├── event.types.ts
│   │   │   │   └── rabbitmq.service.ts
│   │   │   │
│   │   │   ├── database/
│   │   │   │   └── prisma.service.ts
│   │   │   │
│   │   │   └── config/
│   │   │       └── configuration.ts
│   │   │
│   │   └── prisma/
│   │       ├── migrations/
│   │       └── schema.prisma
│   │
│   └── delivery-service/             # Delivery Service (Port 3006)
│       ├── Dockerfile
│       ├── .dockerignore
│       ├── .gitignore
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       │
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   │
│       │   ├── delivery/
│       │   │   ├── delivery.module.ts
│       │   │   ├── delivery.service.ts
│       │   │   ├── delivery.controller.ts
│       │   │   ├── dtos/
│       │   │   │   ├── create-delivery.dto.ts
│       │   │   │   └── update-delivery.dto.ts
│       │   │   └── entities/
│       │   │       └── delivery.entity.ts
│       │   │
│       │   ├── delivery-agent/
│       │   │   ├── delivery-agent.module.ts
│       │   │   ├── delivery-agent.service.ts
│       │   │   ├── delivery-agent.controller.ts
│       │   │   └── dtos/
│       │   │       └── update-agent.dto.ts
│       │   │
│       │   ├── tracking/
│       │   │   ├── tracking.gateway.ts   # Socket.IO gateway
│       │   │   └── tracking.service.ts
│       │   │
│       │   ├── database/
│       │   │   └── prisma.service.ts
│       │   │
│       │   └── config/
│       │       └── configuration.ts
│       │
│       └── prisma/
│           ├── migrations/
│           └── schema.prisma
│
│
├── infra/                            # Infrastructure & DevOps
│   │
│   ├── postgres/
│   │   ├── init.sql                  # Database initialization
│   │   └── data/                     # Volume for PostgreSQL
│   │
│   ├── rabbitmq/
│   │   └── data/                     # Volume for RabbitMQ
│   │
│   ├── redis/
│   │   └── data/                     # Volume for Redis
│   │
│   └── minio/
│       └── data/                     # Volume for MinIO
│
│
├── docs/                             # Documentation
│   ├── API_REFERENCE.md              # Complete API documentation
│   ├── SETUP.md                      # Setup guide
│   ├── DEVELOPMENT.md                # Development guide
│   ├── DATABASE_SCHEMA.md            # Database design
│   ├── EVENT_FLOWS.md                # Event-driven patterns
│   └── TROUBLESHOOTING.md            # Common issues & solutions
│
│
├── scripts/                          # Utility scripts
│   ├── create-admin.sh               # Create admin user
│   ├── seed-products.sh              # Seed products
│   ├── health-check.sh               # Health check script
│   └── logs.sh                       # View service logs
│
│
├── postman/                          # Postman collection examples
│   ├── QuickCart.postman_collection.json
│   └── environment.postman_environment.json
│
│
└── .env.example                      # Example environment variables
```

---

## File Descriptions

### Root Level Files
- **docker-compose.yml** - Orchestrates all services, databases, and infrastructure
- **ARCHITECTURE.md** - System design and architecture documentation
- **README.md** - Project overview and quick start
- **SETUP_GUIDE.md** - Step-by-step setup instructions

### Frontend (`frontend/`)
- **React application** with TypeScript and Vite
- Organized by features (api, store, hooks, pages)
- Tailwind CSS for styling
- Zustand for state management

### Services (`services/`)
Each service follows a similar structure:
- **NestJS framework** with TypeScript
- **Prisma ORM** for database access
- **DTOs** for request/response validation
- **Controllers** for HTTP endpoints
- **Services** for business logic
- **Modules** for feature organization

### Infrastructure (`infra/`)
- Database initialization scripts
- Volume mount points for persistence
- Configuration for external services

### Documentation (`docs/`)
- Complete API reference
- Setup and deployment guides
- Database schema documentation
- Event flow diagrams

### Postman
- Pre-built API requests for testing
- Environment variables for different setups

---

## Service Port Allocation

| Service | Port | Description |
|---------|------|-------------|
| NGINX (API Gateway) | 80 | Web traffic |
| Auth Service | 3001 | Authentication & authorization |
| Product Service | 3002 | Product management |
| Cart Service | 3003 | Shopping cart |
| Order Service | 3004 | Order management |
| Notification Service | 3005 | Notifications |
| Delivery Service | 3006 | Delivery tracking |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| RabbitMQ | 5672 | Message queue |
| RabbitMQ Management | 15672 | Admin panel |
| MinIO | 9000 | Object storage |
| MinIO Console | 9001 | MinIO admin |

---

## Database Schemas

### Users (Auth Service)
```sql
- user_id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR)
- role (ENUM: USER, ADMIN, DELIVERY_AGENT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Products (Product Service)
```sql
- product_id (UUID, PK)
- category_id (UUID, FK)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- quantity_available (INTEGER)
- image_url (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Orders (Order Service)
```sql
- order_id (UUID, PK)
- user_id (UUID, FK)
- total_amount (DECIMAL)
- status (ENUM)
- delivery_address (TEXT)
- delivery_agent_id (UUID, FK)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### More schemas in DATABASE_SCHEMA.md

---

## Next Steps

1. **Create the folder structure** - Use the provided bash script
2. **Setup docker-compose.yml** - Configure all services
3. **Implement services** - Start with Auth Service
4. **Add frontend** - React components and pages
5. **Test integration** - End-to-end testing
6. **Deploy** - Docker Compose deployment

