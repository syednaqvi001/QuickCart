-- ============================================
-- QuickCart Complete Database Setup
-- PostgreSQL Script
-- ============================================
-- Copy and paste this entire file into pgAdmin Query Tool
-- or run: psql -h localhost -U quickcart -d quickcart_db -f COMPLETE_SQL_SETUP.sql
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS TABLE (Auth Service)
-- ============================================

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

-- Index for email lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- REFRESH TOKENS TABLE (Auth Service)
-- ============================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================
-- CATEGORIES TABLE (Product Service)
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- ============================================
-- PRODUCTS TABLE (Product Service)
-- ============================================

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

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ============================================
-- INVENTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_available INTEGER DEFAULT 0 CHECK (quantity_available >= 0),
    quantity_reserved INTEGER DEFAULT 0 CHECK (quantity_reserved >= 0),
    last_restocked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_product_id ON inventory(product_id);

-- ============================================
-- ORDERS TABLE (Order Service)
-- ============================================

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

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_agent_id ON orders(delivery_agent_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- DELIVERIES TABLE (Delivery Service)
-- ============================================

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

CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_delivery_agent_id ON deliveries(delivery_agent_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- ============================================
-- DELIVERY AGENTS TABLE
-- ============================================

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

CREATE INDEX idx_delivery_agents_user_id ON delivery_agents(user_id);
CREATE INDEX idx_delivery_agents_is_available ON delivery_agents(is_available);

-- ============================================
-- DELIVERY TRACKING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_delivery_tracking_delivery_id ON delivery_tracking(delivery_id);
CREATE INDEX idx_delivery_tracking_created_at ON delivery_tracking(created_at);

-- ============================================
-- NOTIFICATIONS TABLE (Notification Service)
-- ============================================

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

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- CART TABLE (Cart Service)
-- ============================================

CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_items INTEGER DEFAULT 0,
    total_price DECIMAL(10, 2) DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- ============================================
-- CART ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- ============================================
-- TRIGGER: Update user updated_at timestamp
-- ============================================

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

-- ============================================
-- TRIGGER: Update products updated_at timestamp
-- ============================================

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

-- ============================================
-- TRIGGER: Update orders updated_at timestamp
-- ============================================

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

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert default categories
INSERT INTO categories (name, description, image_url, is_active) VALUES
    ('Fruits', 'Fresh and organic fruits', 'https://via.placeholder.com/300?text=Fruits', true),
    ('Vegetables', 'Fresh vegetables from local farms', 'https://via.placeholder.com/300?text=Vegetables', true),
    ('Dairy', 'Milk, yogurt, and other dairy products', 'https://via.placeholder.com/300?text=Dairy', true),
    ('Bakery', 'Fresh baked goods and bread', 'https://via.placeholder.com/300?text=Bakery', true),
    ('Grains', 'Rice, flour, and cereal products', 'https://via.placeholder.com/300?text=Grains', true),
    ('Oils', 'Cooking oils and condiments', 'https://via.placeholder.com/300?text=Oils', true),
    ('Nuts', 'Dry fruits and nuts', 'https://via.placeholder.com/300?text=Nuts', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
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

-- Insert test users
-- Password: Test@1234
-- Hashed with bcrypt (10 rounds)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active)
VALUES
    ('test@test.com', '$2b$10$5s8p8n3q9r2t5v7w1x3z5y7b9d1f3h5j7l9n1p3r5t7v9x1z3b5d7f', 'Test', 'User', '+91-9999999999', 'USER', true),
    ('admin@example.com', '$2b$10$5s8p8n3q9r2t5v7w1x3z5y7b9d1f3h5j7l9n1p3r5t7v9x1z3b5d7f', 'Admin', 'User', '+91-9999999998', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;

-- Grant permissions to quickcart user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO quickcart;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO quickcart;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO quickcart;

-- Log successful initialization
SELECT 'QuickCart database initialized successfully!' as status;
