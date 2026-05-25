# QuickCart API Integration Guide

## 🎯 Overview

This guide explains how the frontend connects to backend services and how to use the API endpoints.

---

## 🔌 Connection Architecture

### Frontend → NGINX Gateway → Microservices

```
Frontend (React)
    ↓
NGINX Gateway (localhost)
    ├→ Auth Service (3001)
    ├→ Product Service (3002)
    ├→ Cart Service (3003)
    ├→ Order Service (3004)
    ├→ Notification Service (3005)
    └→ Delivery Service (3006)
    ↓
    ↓
PostgreSQL ← Services
Redis      ← Services
RabbitMQ   ← Services
MinIO      ← Services
```

---

## 📝 Current Frontend API Client

### File: `src/api/client.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost',  // NGINX Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔐 Authentication Endpoints

### Register User
```typescript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9999999999"
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2026-05-21T10:30:00Z"
  },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### Login User
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "Test@1234"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "test@test.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}

Error Response (401):
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### Verify Token
```typescript
GET /api/auth/verify
Authorization: Bearer {token}

Response (200):
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "test@test.com"
  }
}

Response (401):
{
  "valid": false,
  "message": "Invalid token"
}
```

### Refresh Token
```typescript
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response (200):
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

### Logout
```typescript
POST /api/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "Logged out successfully"
}
```

---

## 📦 Product Endpoints

### List All Products
```typescript
GET /api/products?page=1&limit=10&category=Fruits&search=apple

Query Parameters:
  - page (optional): Page number (default: 1)
  - limit (optional): Items per page (default: 10)
  - category (optional): Filter by category
  - search (optional): Search by name

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "Fresh Organic Apples",
      "description": "Crisp and juicy organic apples",
      "longDescription": "Hand-picked from premium orchards...",
      "price": 150.00,
      "quantity_available": 50,
      "rating": 4.8,
      "category": "Fruits",
      "imageUrl": "https://...",
      "isActive": true,
      "createdAt": "2026-05-21T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "pages": 1
  }
}
```

### Get Product Details
```typescript
GET /api/products/:id

Response (200):
{
  "id": "uuid",
  "name": "Fresh Organic Apples",
  "description": "Crisp and juicy organic apples",
  "longDescription": "Hand-picked from premium orchards...",
  "price": 150.00,
  "quantityAvailable": 50,
  "rating": 4.8,
  "category": "Fruits",
  "images": [
    {
      "id": "uuid",
      "url": "https://...",
      "alt_text": "Product image",
      "isPrimary": true
    }
  ],
  "isActive": true,
  "createdAt": "2026-05-21T10:30:00Z"
}

Error (404):
{
  "statusCode": 404,
  "message": "Product not found"
}
```

### Search Products
```typescript
GET /api/products/search?q=apple&category=Fruits

Query Parameters:
  - q: Search query
  - category: Filter category

Response (200):
{
  "data": [
    { ...product... }
  ],
  "count": 1
}
```

### Get Categories
```typescript
GET /api/categories

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "Fruits",
      "description": "Fresh and organic fruits",
      "imageUrl": "https://...",
      "productCount": 1,
      "isActive": true
    }
  ]
}
```

---

## 🛒 Cart Endpoints

### Get Cart
```typescript
GET /api/cart
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 150.00,
      "totalPrice": 300.00,
      "product": {
        "id": "uuid",
        "name": "Fresh Organic Apples",
        "price": 150.00,
        "imageUrl": "https://..."
      }
    }
  ],
  "totalItems": 2,
  "totalPrice": 300.00,
  "createdAt": "2026-05-21T10:30:00Z"
}
```

### Add to Cart
```typescript
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "uuid",
  "quantity": 2,
  "unitPrice": 150.00
}

Response (201):
{
  "id": "uuid",
  "cartId": "uuid",
  "productId": "uuid",
  "quantity": 2,
  "unitPrice": 150.00,
  "totalPrice": 300.00
}

Error (400):
{
  "statusCode": 400,
  "message": "Product out of stock"
}
```

### Update Cart Item
```typescript
PUT /api/cart/items/:itemId
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 5
}

Response (200):
{
  "id": "uuid",
  "quantity": 5,
  "totalPrice": 750.00
}

Error (404):
{
  "statusCode": 404,
  "message": "Cart item not found"
}
```

### Remove from Cart
```typescript
DELETE /api/cart/items/:itemId
Authorization: Bearer {token}

Response (200):
{
  "message": "Item removed from cart"
}

Response (204):
// No content
```

### Clear Cart
```typescript
DELETE /api/cart
Authorization: Bearer {token}

Response (200):
{
  "message": "Cart cleared"
}
```

---

## 📋 Order Endpoints

### Create Order
```typescript
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "deliveryAddress": "123 Main St, City, State 12345",
  "deliveryNotes": "Please ring the doorbell twice",
  "paymentMethod": "credit_card",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 150.00
    }
  ]
}

Response (201):
{
  "id": "uuid",
  "userId": "uuid",
  "totalAmount": 300.00,
  "status": "PENDING",
  "deliveryAddress": "123 Main St, City, State 12345",
  "deliveryNotes": "Please ring the doorbell twice",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 150.00,
      "totalPrice": 300.00
    }
  ],
  "createdAt": "2026-05-21T10:30:00Z"
}

Error (400):
{
  "statusCode": 400,
  "message": "Cart is empty"
}
```

### List User Orders
```typescript
GET /api/orders?page=1&status=PENDING
Authorization: Bearer {token}

Query Parameters:
  - page: Page number
  - status: Filter by status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "totalAmount": 300.00,
      "status": "PENDING",
      "createdAt": "2026-05-21T10:30:00Z",
      "itemCount": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

### Get Order Details
```typescript
GET /api/orders/:orderId
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "totalAmount": 300.00,
  "status": "PENDING",
  "deliveryAddress": "123 Main St, City, State 12345",
  "deliveryNotes": "Please ring the doorbell twice",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 150.00,
      "totalPrice": 300.00,
      "product": {
        "name": "Fresh Organic Apples",
        "imageUrl": "https://..."
      }
    }
  ],
  "delivery": {
    "id": "uuid",
    "status": "PENDING",
    "estimatedDeliveryTime": "2026-05-21T14:30:00Z",
    "deliveryAgent": {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+91-9999999999",
      "rating": 4.8
    }
  },
  "createdAt": "2026-05-21T10:30:00Z"
}

Error (404):
{
  "statusCode": 404,
  "message": "Order not found"
}
```

### Cancel Order
```typescript
PUT /api/orders/:orderId/cancel
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "status": "CANCELLED",
  "message": "Order cancelled successfully"
}

Error (400):
{
  "statusCode": 400,
  "message": "Order cannot be cancelled (already shipped)"
}
```

---

## 🚚 Delivery Endpoints

### Get Delivery Status
```typescript
GET /api/deliveries/:orderId
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "orderId": "uuid",
  "status": "EN_ROUTE",
  "deliveryAgent": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+91-9999999999",
    "rating": 4.8,
    "vehicle": {
      "type": "Bike",
      "number": "KA-01-AB-1234"
    },
    "currentLocation": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  },
  "estimatedDeliveryTime": "2026-05-21T14:30:00Z",
  "timeline": [
    {
      "status": "PENDING",
      "time": "2026-05-21T10:30:00Z",
      "message": "Order received"
    },
    {
      "status": "ASSIGNED",
      "time": "2026-05-21T11:00:00Z",
      "message": "Assigned to John Doe"
    },
    {
      "status": "EN_ROUTE",
      "time": "2026-05-21T13:00:00Z",
      "message": "Order is on the way"
    }
  ]
}
```

### Track Delivery Location
```typescript
GET /api/deliveries/:orderId/location
Authorization: Bearer {token}

Response (200):
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "accuracy": 10,
  "timestamp": "2026-05-21T13:30:00Z",
  "status": "EN_ROUTE"
}
```

---

## 👤 User Profile Endpoints

### Get User Profile
```typescript
GET /api/users/profile
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "email": "test@test.com",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+91-9999999999",
  "role": "USER",
  "isActive": true,
  "addresses": [
    {
      "id": "uuid",
      "label": "Home",
      "address": "123 Main St",
      "isPrimary": true
    }
  ],
  "createdAt": "2026-05-21T10:30:00Z"
}
```

### Update User Profile
```typescript
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9999999999"
}

Response (200):
{
  "id": "uuid",
  "email": "test@test.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9999999999"
}
```

### Change Password
```typescript
PUT /api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "Test@1234",
  "newPassword": "NewPassword@2026"
}

Response (200):
{
  "message": "Password changed successfully"
}

Error (401):
{
  "statusCode": 401,
  "message": "Current password is incorrect"
}
```

---

## 📢 Notification Endpoints

### Get Notifications
```typescript
GET /api/notifications?limit=10&unreadOnly=false
Authorization: Bearer {token}

Query Parameters:
  - limit: Number of notifications (default: 20)
  - unreadOnly: Only unread (default: false)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "type": "ORDER_CONFIRMED",
      "title": "Order Confirmed",
      "message": "Your order #12345 has been confirmed",
      "isRead": false,
      "createdAt": "2026-05-21T10:30:00Z"
    }
  ],
  "unreadCount": 3
}
```

### Mark as Read
```typescript
PUT /api/notifications/:notificationId/read
Authorization: Bearer {token}

Response (200):
{
  "isRead": true
}
```

### Mark All as Read
```typescript
PUT /api/notifications/read-all
Authorization: Bearer {token}

Response (200):
{
  "message": "All notifications marked as read"
}
```

---

## 🏥 Health Check Endpoints

### Check Backend Health
```typescript
GET /health

Response (200):
{
  "status": "healthy",
  "timestamp": "2026-05-21T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "rabbitmq": "connected"
  }
}
```

---

## 🔄 Error Handling

### Standard Error Response
```typescript
{
  "statusCode": 400 | 401 | 404 | 500,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## 💡 Usage Examples

### Login Flow
```typescript
import apiClient from './api/client';
import { useAuthStore } from './store/authStore';

// Login
const response = await apiClient.post('/api/auth/login', {
  email: 'test@test.com',
  password: 'Test@1234'
});

// Store tokens
useAuthStore.setState({
  user: response.data.user,
  accessToken: response.data.accessToken,
  refreshToken: response.data.refreshToken,
  isAuthenticated: true
});

// Subsequent requests automatically include token
const cart = await apiClient.get('/api/cart');
```

### Fetch Products
```typescript
const response = await apiClient.get('/api/products?category=Fruits');
const products = response.data.data;
```

### Place Order
```typescript
const response = await apiClient.post('/api/orders', {
  deliveryAddress: '123 Main St',
  deliveryNotes: 'Ring doorbell',
  paymentMethod: 'credit_card',
  items: [
    { productId: 'uuid', quantity: 2, unitPrice: 150 }
  ]
});
```

---

## 🚀 Important Notes

1. **Base URL:** All requests go to `http://localhost` (NGINX Gateway)
2. **Authentication:** JWT token in `Authorization: Bearer {token}` header
3. **Content-Type:** Use `application/json` for all requests
4. **Timeout:** 10 seconds per request
5. **Pagination:** Default limit is 10, max is 100
6. **Rate Limiting:** Will be enabled in production

---

## 📚 References

- [Auth Service Documentation](services/auth-service/README.md)
- [Product Service Documentation](services/product-service/README.md)
- [Order Service Documentation](services/order-service/README.md)
- [Backend Connection Guide](BACKEND_CONNECTION_GUIDE.md)

---

**Happy coding!** 🚀
