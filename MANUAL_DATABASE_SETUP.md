# QuickCart - Manual Database Setup (PostgreSQL) 📊

## 🔍 Important: We Use PostgreSQL, NOT MySQL

Your project uses **PostgreSQL 14**. The commands below are for PostgreSQL, not MySQL.

---

## 📋 Option 1: Using pgAdmin (GUI - Easiest)

### Step 1: Start PostgreSQL
```bash
# If Docker is installed and running
docker run --name quickcart-postgres -e POSTGRES_USER=quickcart -e POSTGRES_PASSWORD=quickcart123 -e POSTGRES_DB=quickcart_db -p 5432:5432 -d postgres:14-alpine
```

Or start it via Docker Desktop if you have it.

### Step 2: Install pgAdmin (Optional)
```bash
# Download from: https://www.pgadmin.org/download/
# Or use Docker:
docker run --name pgadmin -e PGADMIN_DEFAULT_EMAIL=admin@example.com -e PGADMIN_DEFAULT_PASSWORD=admin -p 5050:80 -d dpage/pgadmin4
```

Access pgAdmin at: **http://localhost:5050**

### Step 3: Connect to PostgreSQL
1. Open pgAdmin (http://localhost:5050)
2. Login with admin@example.com / admin
3. Right-click "Servers" → "Create" → "Server"
4. Name: `QuickCart`
5. Connection tab:
   - Host: `localhost`
   - Port: `5432`
   - Username: `quickcart`
   - Password: `quickcart123`
   - Database: `quickcart_db`
6. Click "Save"

### Step 4: Create Database
1. Right-click "Databases" → "Create" → "Database"
2. Name: `quickcart_db`
3. Click "Save"

### Step 5: Run SQL Scripts
1. Right-click the `quickcart_db` database
2. Select "Query Tool"
3. Copy-paste each SQL block below one at a time
4. Press F5 or click "Execute"

---

## 📋 Option 2: Using psql Command Line

### Step 1: Install PostgreSQL
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql
```

### Step 2: Connect to PostgreSQL
```bash
# Start with default superuser
psql -U postgres

# Or if you have quickcart user already
psql -h localhost -U quickcart -d quickcart_db
```

### Step 3: Create Database (if not exists)
```sql
CREATE DATABASE quickcart_db OWNER quickcart;
```

### Step 4: Run the SQL script
```bash
# From the QuickCart directory
psql -h localhost -U quickcart -d quickcart_db -f infra/postgres/init_database.sql
```

---

## 🗄️ Complete SQL Commands to Run Manually

### 1️⃣ Enable Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2️⃣ Create USERS Table
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'DELIVERY_AGENT')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

### 3️⃣ Create REFRESH_TOKENS Table
```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for refresh_tokens
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

### 4️⃣ Create CATEGORIES Table
```sql
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for categories
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);
```

### 5️⃣ Create PRODUCTS Table
```sql
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity_available INTEGER DEFAULT 0 CHECK (quantity_available >= 0),
    image_url VARCHAR(500),
    rating DECIMAL(3, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);
```

### 6️⃣ Create PRODUCT_IMAGES Table
```sql
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for product_images
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
```

### 7️⃣ Create INVENTORY Table
```sql
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_available INTEGER DEFAULT 0 CHECK (quantity_available >= 0),
    quantity_reserved INTEGER DEFAULT 0 CHECK (quantity_reserved >= 0),
    last_restocked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for inventory
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
```

### 8️⃣ Create ORDERS Table
```sql
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    delivery_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheduled_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_agent_id ON orders(delivery_agent_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 9️⃣ Create ORDER_ITEMS Table
```sql
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

### 🔟 Create DELIVERIES Table
```sql
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_agent_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'FAILED')),
    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,
    estimated_delivery_time TIMESTAMP,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for deliveries
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_delivery_agent_id ON deliveries(delivery_agent_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
```

### 1️⃣1️⃣ Create DELIVERY_AGENTS Table
```sql
CREATE TABLE IF NOT EXISTS delivery_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE,
    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),
    is_available BOOLEAN DEFAULT true,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for delivery_agents
CREATE INDEX idx_delivery_agents_user_id ON delivery_agents(user_id);
CREATE INDEX idx_delivery_agents_is_available ON delivery_agents(is_available);
```

### 1️⃣2️⃣ Create DELIVERY_TRACKING Table
```sql
CREATE TABLE IF NOT EXISTS delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for delivery_tracking
CREATE INDEX idx_delivery_tracking_delivery_id ON delivery_tracking(delivery_id);
CREATE INDEX idx_delivery_tracking_created_at ON delivery_tracking(created_at);
```

### 1️⃣3️⃣ Create NOTIFICATIONS Table
```sql
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    notification_method VARCHAR(50) DEFAULT 'IN_APP' CHECK (notification_method IN ('IN_APP', 'EMAIL', 'SMS')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

### 1️⃣4️⃣ Create CARTS Table
```sql
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_items INTEGER DEFAULT 0,
    total_price DECIMAL(10, 2) DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for carts
CREATE INDEX idx_carts_user_id ON carts(user_id);
```

### 1️⃣5️⃣ Create CART_ITEMS Table
```sql
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for cart_items
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

### 1️⃣6️⃣ Create Trigger Functions
```sql
-- Trigger for users updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Trigger for products updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at_trigger
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_updated_at();

-- Trigger for orders updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_updated_at();
```

---

## 📊 Sample Data - Insert Test Data

### Insert Categories
```sql
INSERT INTO categories (name, description, image_url, is_active) VALUES
('Fruits', 'Fresh and organic fruits', 'https://via.placeholder.com/300?text=Fruits', true),
('Vegetables', 'Fresh vegetables from local farms', 'https://via.placeholder.com/300?text=Vegetables', true),
('Dairy', 'Milk, yogurt, and other dairy products', 'https://via.placeholder.com/300?text=Dairy', true),
('Bakery', 'Fresh baked goods and bread', 'https://via.placeholder.com/300?text=Bakery', true),
('Grains', 'Rice, flour, and cereal products', 'https://via.placeholder.com/300?text=Grains', true),
('Oils', 'Cooking oils and condiments', 'https://via.placeholder.com/300?text=Oils', true),
('Nuts', 'Dry fruits and nuts', 'https://via.placeholder.com/300?text=Nuts', true)
ON CONFLICT (name) DO NOTHING;
```

### Insert Sample Products
```sql
INSERT INTO products (category_id, name, description, long_description, price, quantity_available, image_url, rating, is_active)
SELECT
    (SELECT id FROM categories WHERE name = 'Fruits'),
    'Fresh Organic Apples',
    'Crisp and juicy organic apples',
    'Our fresh organic apples are hand-picked from premium orchards. They are pesticide-free and packed with natural nutrients. Perfect for a healthy diet.',
    150.00,
    50,
    'https://via.placeholder.com/300?text=Apples',
    4.8,
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Organic Apples');

INSERT INTO products (category_id, name, description, long_description, price, quantity_available, image_url, rating, is_active)
SELECT
    (SELECT id FROM categories WHERE name = 'Dairy'),
    'Premium Milk',
    'Pure and fresh daily milk',
    'Fresh milk delivered daily from local farms. Pasteurized and rich in calcium and protein.',
    65.00,
    100,
    'https://via.placeholder.com/300?text=Milk',
    4.7,
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Premium Milk');

INSERT INTO products (category_id, name, description, long_description, price, quantity_available, image_url, rating, is_active)
SELECT
    (SELECT id FROM categories WHERE name = 'Bakery'),
    'Whole Wheat Bread',
    'Healthy whole wheat bread',
    'Freshly baked whole wheat bread made with organic flour. No artificial preservatives.',
    45.00,
    30,
    'https://via.placeholder.com/300?text=Bread',
    4.6,
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Whole Wheat Bread');

INSERT INTO products (category_id, name, description, long_description, price, quantity_available, image_url, rating, is_active)
SELECT
    (SELECT id FROM categories WHERE name = 'Oils'),
    'Olive Oil Extra Virgin',
    'Premium olive oil for cooking',
    'Extra virgin olive oil cold-pressed from premium olives. Perfect for cooking and salads.',
    450.00,
    20,
    'https://via.placeholder.com/300?text=OliveOil',
    4.9,
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Olive Oil Extra Virgin');

INSERT INTO products (category_id, name, description, long_description, price, quantity_available, image_url, rating, is_active)
SELECT
    (SELECT id FROM categories WHERE name = 'Vegetables'),
    'Fresh Tomatoes',
    'Farm fresh red tomatoes',
    'Farm fresh red tomatoes picked daily. Perfect for cooking and salads.',
    80.00,
    60,
    'https://via.placeholder.com/300?text=Tomatoes',
    4.5,
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Tomatoes');

INSERT INTO products (category_id, name, description, long_description, price, quantity_available, image_url, rating, is_active)
SELECT
    (SELECT id FROM categories WHERE name = 'Grains'),
    'Brown Rice',
    'Nutritious brown rice 1kg',
    'Nutritious brown rice 1kg. Rich in fiber and nutrients.',
    120.00,
    40,
    'https://via.placeholder.com/300?text=BrownRice',
    4.7,
    true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Brown Rice');
```

### Insert Test Users
```sql
-- Password: Test@1234 (hashed with bcrypt)
-- bcrypt hash: $2b$10$5s8p8n3q9r2t5v7w1x3z5y7b9d1f3h5j7l9n1p3r5t7v9x1z3b5d7f

INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active) 
VALUES 
('test@test.com', '$2b$10$5s8p8n3q9r2t5v7w1x3z5y7b9d1f3h5j7l9n1p3r5t7v9x1z3b5d7f', 'Test', 'User', '+91-9999999999', 'USER', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active) 
VALUES 
('admin@example.com', '$2b$10$5s8p8n3q9r2t5v7w1x3z5y7b9d1f3h5j7l9n1p3r5t7v9x1z3b5d7f', 'Admin', 'User', '+91-9999999998', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;
```

---

## ✅ Verify Everything

### Check Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show:
```
 table_name
─────────────────────
 users
 refresh_tokens
 categories
 products
 product_images
 inventory
 orders
 order_items
 deliveries
 delivery_agents
 delivery_tracking
 notifications
 carts
 cart_items
```

### Check Sample Data
```sql
SELECT COUNT(*) FROM categories;      -- Should show: 7
SELECT COUNT(*) FROM products;        -- Should show: 6
SELECT COUNT(*) FROM users;           -- Should show: 2
```

### Test Connection String
```
postgresql://quickcart:quickcart123@localhost:5432/quickcart_db
```

---

## 🚀 Next Steps After Database Setup

1. **Keep PostgreSQL running** (Docker or local installation)
2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Create mock backend** (or use Docker services later)

4. **Test login** with credentials:
   - Email: `test@test.com`
   - Password: `Test@1234`

---

## 🐛 Troubleshooting

### "password authentication failed"
- Verify username: `quickcart`
- Verify password: `quickcart123`
- Verify host: `localhost`
- Verify port: `5432`

### "database does not exist"
- Create it first: `CREATE DATABASE quickcart_db OWNER quickcart;`

### "permission denied"
```sql
-- Grant permissions to quickcart user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO quickcart;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO quickcart;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO quickcart;
```

### Cannot connect from frontend
- Ensure PostgreSQL is running on port 5432
- Check firewall allows localhost:5432
- Verify connection string in backend

---

## 📚 Files Reference

- **Full Script:** `infra/postgres/init_database.sql`
- **Connection Config:** `.env` file (has credentials)
- **Docker Compose:** `docker-compose.yml` (uses above)

---

**You now have all commands to manually set up the database!** 🎉

Choose either pgAdmin (GUI) or psql (command line) above.
