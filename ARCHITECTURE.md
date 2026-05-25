# QuickCart - Architecture Overview

## Project Vision
QuickCart is a production-grade, cloud-native grocery delivery platform built with microservices architecture. It demonstrates modern full-stack development with event-driven communication, scalability, and clean architecture principles.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                           │
│  React + TypeScript + Vite + Tailwind CSS                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              API Gateway (NGINX)                             │
│  - Reverse proxy                                             │
│  - Load balancing                                            │
│  - Request routing                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐  ┌─────▼────┐  ┌──────▼───┐
   │ Services │  │  Services│  │ Services │
   └──────────┘  └──────────┘  └──────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Microservices Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Service │  │Product Service│  │ Cart Service │     │
│  │ (Port: 3001) │  │ (Port: 3002)  │  │(Port: 3003)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Order Service│  │Notification S.│  │Delivery Serv.│     │
│  │ (Port: 3004) │  │ (Port: 3005)  │  │(Port: 3006)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐  ┌─────▼────┐  ┌──────▼───┐
   │PostgreSQL│  │RabbitMQ  │  │  Redis   │
   │Database  │  │Event Bus │  │  Cache   │
   └──────────┘  └──────────┘  └──────────┘
        │
   ┌────▼────┐  ┌──────────┐
   │  MinIO  │  │ Socket.IO│
   │(S3 Compat)  │(Real-time)
   └─────────┘  └──────────┘
```

---

## Microservices

### 1. **Auth Service** (Port: 3001)
**Responsibilities:**
- User registration & login
- JWT token generation & validation
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Token refresh mechanism

**Database Tables:**
- users
- roles
- permissions

**Key Endpoints:**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh-token
GET    /auth/verify
POST   /auth/logout
```

---

### 2. **Product Service** (Port: 3002)
**Responsibilities:**
- Product CRUD operations
- Category management
- Inventory management
- Product search & filtering
- Image uploads to MinIO

**Database Tables:**
- products
- categories
- inventory
- product_images

**Key Endpoints:**
```
GET    /products
GET    /products/:id
POST   /products (admin)
PUT    /products/:id (admin)
DELETE /products/:id (admin)
GET    /categories
POST   /categories (admin)
GET    /products/search?query=...
GET    /inventory/:productId
```

**Caching:**
- Redis cache for product listings
- Cache invalidation on updates

---

### 3. **Cart Service** (Port: 3003)
**Responsibilities:**
- Add/remove items from cart
- Update quantities
- Cart persistence
- Cart retrieval

**Cache-Based Storage:**
- Redis for active carts
- Optional: PostgreSQL for backup

**Key Endpoints:**
```
GET    /cart (authenticated)
POST   /cart/items
PUT    /cart/items/:itemId
DELETE /cart/items/:itemId
DELETE /cart (clear cart)
```

---

### 4. **Order Service** (Port: 3004)
**Responsibilities:**
- Order placement
- Order status tracking
- Order history
- Publish order events to RabbitMQ

**Database Tables:**
- orders
- order_items

**Key Endpoints:**
```
POST   /orders
GET    /orders/:id
GET    /orders (user's orders)
PUT    /orders/:id/status (admin)
```

**Events Published:**
```
order.created
order.confirmed
order.shipped
order.delivered
order.cancelled
```

---

### 5. **Notification Service** (Port: 3005)
**Responsibilities:**
- Consume RabbitMQ events
- Simulate email notifications
- Simulate SMS notifications
- Store notification history

**Event Consumers:**
```
order.created
order.confirmed
order.shipped
order.delivered
order.cancelled
```

**Key Endpoints:**
```
GET    /notifications (authenticated)
PUT    /notifications/:id/read
```

---

### 6. **Delivery Service** (Port: 3006)
**Responsibilities:**
- Delivery agent assignment
- Live delivery tracking
- Order status updates
- Real-time tracking via Socket.IO

**Database Tables:**
- deliveries
- delivery_agents
- delivery_tracking

**Key Endpoints:**
```
GET    /deliveries/:orderId
POST   /deliveries/:orderId/assign
PUT    /deliveries/:orderId/status
GET    /delivery-agents (location, availability)
```

**Real-time Events (Socket.IO):**
```
delivery.started
delivery.en_route
delivery.nearby
delivery.arrived
delivery.completed
```

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Zustand** - State management
- **Socket.IO Client** - Real-time updates

### Backend
- **Node.js 18+** - Runtime
- **NestJS** - Framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **Class Validator** - DTO validation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT handling
- **RabbitMQ** - Message queue
- **Socket.IO** - Real-time communication

### Data & Cache
- **PostgreSQL 14+** - Primary database
- **Redis 7+** - Caching & sessions
- **MinIO** - S3-compatible object storage

### Message Queue & Events
- **RabbitMQ 3.11+** - Event bus

### API Gateway & Networking
- **NGINX** - Reverse proxy & load balancer

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Docker Volumes** - Persistence

---

## Event-Driven Architecture

### Event Flow

```
Order Service          RabbitMQ         Notification Service
     │                    │                     │
     ├──► order.created ──►│                     │
     │                    │                     │
     │                    ├──► [Consume] ───────┤
     │                    │                     │
     │                    │        [Send Email] │
     │                    │        [Send SMS]   │
     │                    │                     │
     │                    │  Delivery Service   │
     │                    │         │           │
     │                    ├──► [Consume] ───────┤
     │                    │                     │
     │                    │  [Assign Agent]     │
     │                    │  [Create Tracking]  │
```

### Message Formats

```json
{
  "event_type": "order.created",
  "event_id": "evt_123abc",
  "timestamp": "2026-05-21T10:30:00Z",
  "payload": {
    "order_id": "ord_456def",
    "user_id": "usr_789ghi",
    "total_amount": 45.99,
    "items": [...]
  }
}
```

---

## Authentication & Authorization

### JWT Flow

```
1. User Login
   └─► Auth Service validates credentials
       └─► Issues JWT (access + refresh tokens)

2. Protected Route Request
   └─► Client sends JWT in Authorization header
       └─► NGINX/Service validates token
           └─► Grants/Denies access based on role

3. Token Refresh
   └─► Client sends refresh token
       └─► Auth Service issues new access token
```

### Roles & Permissions

```
USER (Default)
├── View products
├── Add to cart
├── Place orders
├── View own orders
└── Track deliveries

ADMIN
├── All USER permissions
├── Manage products
├── Manage inventory
├── View all orders
├── Manage users
└── Generate reports

DELIVERY_AGENT
├── View assigned orders
├── Update delivery status
├── Report location
└── Mark delivery complete
```

---

## Database Schema Overview

### Users Table
```sql
- user_id (PK)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- phone
- role (ENUM: USER, ADMIN, DELIVERY_AGENT)
- created_at
- updated_at
```

### Products Table
```sql
- product_id (PK)
- category_id (FK)
- name
- description
- price
- quantity_available
- image_url
- created_at
- updated_at
```

### Orders Table
```sql
- order_id (PK)
- user_id (FK)
- total_amount
- status (ENUM: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- delivery_agent_id (FK, nullable)
- created_at
- updated_at
```

### Deliveries Table
```sql
- delivery_id (PK)
- order_id (FK)
- delivery_agent_id (FK)
- status (ENUM: PENDING, ASSIGNED, EN_ROUTE, ARRIVED, COMPLETED)
- pickup_time
- delivery_time
- created_at
- updated_at
```

---

## Caching Strategy

### Redis Usage

1. **Product Cache**
   ```
   Key: product:list:page:1
   TTL: 1 hour
   Invalidated on: product update/delete
   ```

2. **Category Cache**
   ```
   Key: category:all
   TTL: 2 hours
   Invalidated on: category update
   ```

3. **Cart Storage**
   ```
   Key: cart:user:123
   Data: serialized cart items
   TTL: 7 days
   ```

4. **Session Cache**
   ```
   Key: session:token:abc123
   TTL: 15 minutes (refresh window)
   ```

---

## Security Measures

1. **Authentication**
   - JWT with secure secret
   - Token expiration
   - Refresh token rotation

2. **Password Security**
   - Bcrypt hashing with salt
   - Minimum password requirements
   - Secure password reset flow

3. **Authorization**
   - Role-based access control
   - Guard decorators on routes
   - Fine-grained permissions

4. **Input Validation**
   - DTO validation (class-validator)
   - Sanitization
   - Type checking

5. **API Security**
   - CORS configuration
   - Rate limiting (optional)
   - Request validation

6. **Data Protection**
   - Environment variables for secrets
   - No sensitive data in logs
   - Encrypted connections

---

## Deployment Strategy

### Local Development
```bash
docker-compose up --build
```

### Services Communication
- **Synchronous:** REST APIs through NGINX
- **Asynchronous:** RabbitMQ message queue
- **Real-time:** Socket.IO connections

### Service Discovery
- DNS via Docker networks
- Service names as hostnames
- Example: `http://product-service:3002`

---

## Monitoring & Observability

### Logging
- Service logs to stdout
- Docker logs aggregation
- Optional: ELK stack integration

### Health Checks
- `/health` endpoint on each service
- Docker health checks
- Liveness probes

### Metrics (Future)
- Prometheus metrics
- Grafana dashboards

---

## Scalability Considerations

1. **Horizontal Scaling**
   - Multiple instances per service
   - NGINX load balancing
   - Database connection pooling

2. **Performance**
   - Redis caching layer
   - Database indexing
   - Pagination on list endpoints

3. **Resilience**
   - Retry mechanisms in RabbitMQ
   - Circuit breakers (optional)
   - Graceful shutdown

---

## Development Phases

### Phase 1: Infrastructure & Auth
- Docker setup
- PostgreSQL initialization
- Auth Service implementation
- Basic API structure

### Phase 2: Product Service
- Product CRUD
- Category management
- Image uploads to MinIO
- Redis caching

### Phase 3: Cart & Order Services
- Cart management
- Order placement
- Order history

### Phase 4: Event-Driven System
- RabbitMQ setup
- Notification Service
- Order event publishing

### Phase 5: Delivery Service & Real-time
- Delivery tracking
- Socket.IO integration
- Live updates

### Phase 6: Frontend
- React app setup
- Pages & components
- API integration
- State management

### Phase 7: Integration & Testing
- End-to-end flows
- Load testing
- Documentation

---

## Folder Structure
See `FOLDER_STRUCTURE.md` for complete directory layout.

---

## Next Steps
1. Create folder structure
2. Setup docker-compose.yml
3. Initialize all services
4. Implement Phase 1: Auth Service
