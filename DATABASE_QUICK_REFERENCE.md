# PostgreSQL Database - Quick Reference 🚀

## 🎯 TL;DR - Get Database Running in 3 Steps

### Step 1: Start PostgreSQL
```bash
# Option A: Using Docker (Easiest)
docker run --name quickcart-postgres -e POSTGRES_USER=quickcart -e POSTGRES_PASSWORD=quickcart123 -e POSTGRES_DB=quickcart_db -p 5432:5432 -d postgres:14-alpine

# Option B: Double-click in Windows Explorer
START_POSTGRES_DOCKER.bat
```

### Step 2: Start pgAdmin GUI (Optional but Helpful)
```bash
# Option A: Using Docker
docker run --name pgadmin -e PGADMIN_DEFAULT_EMAIL=admin@example.com -e PGADMIN_DEFAULT_PASSWORD=admin -p 5050:80 -d dpage/pgadmin4

# Option B: Double-click in Windows Explorer
START_PGADMIN.bat
```

### Step 3: Run SQL Commands
- **Copy-paste SQL from:** [MANUAL_DATABASE_SETUP.md](MANUAL_DATABASE_SETUP.md)
- **Using pgAdmin:** http://localhost:5050
- **Or using psql:** See "Command Line Access" below

---

## 🔗 Connection Details

```
Database:  quickcart_db
Host:      localhost
Port:      5432
Username:  quickcart
Password:  quickcart123

Full Connection String:
postgresql://quickcart:quickcart123@localhost:5432/quickcart_db
```

---

## 🌐 Access Methods

### Method 1: pgAdmin GUI (Easiest)
```
1. Start PostgreSQL (Step 1 above)
2. Start pgAdmin (Step 2 above)
3. Open: http://localhost:5050
4. Login: admin@example.com / admin
5. Create server with details above
6. Right-click database → Query Tool
7. Paste SQL commands and execute
```

### Method 2: psql Command Line
```bash
# Connect to database
psql -h localhost -U quickcart -d quickcart_db

# Enter password: quickcart123

# Then paste SQL commands and press Enter
```

### Method 3: DBeaver (Desktop App)
```
1. Download from: https://dbeaver.io/download/
2. Create new PostgreSQL connection
3. Host: localhost
4. Port: 5432
5. Database: quickcart_db
6. Username: quickcart
7. Password: quickcart123
8. Right-click → SQL Editor → New Script
9. Paste SQL and execute
```

### Method 4: VS Code PostgreSQL Extension
```
1. Install "PostgreSQL" extension by Chris Kolkman
2. Right-click connection → New Query
3. Host: localhost
4. User: quickcart
5. Password: quickcart123
6. Database: quickcart_db
7. Paste SQL and execute
```

---

## 📊 Tables Overview

| Table | Purpose | Rows |
|-------|---------|------|
| **users** | User accounts | 2 (test + admin) |
| **refresh_tokens** | JWT tokens | 0 |
| **categories** | Product categories | 7 |
| **products** | Product listings | 6 |
| **product_images** | Product images | 0 |
| **inventory** | Stock tracking | 0 |
| **orders** | Customer orders | 0 |
| **order_items** | Items in orders | 0 |
| **deliveries** | Delivery tracking | 0 |
| **delivery_agents** | Delivery personnel | 0 |
| **delivery_tracking** | Tracking history | 0 |
| **notifications** | User notifications | 0 |
| **carts** | Shopping carts | 0 |
| **cart_items** | Items in carts | 0 |

---

## 🔍 Verify Database Setup

### Check Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Check Sample Data
```sql
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_users FROM users;
```

### Check User Accounts
```sql
SELECT id, email, first_name, last_name, role FROM users;
```

### Check Products
```sql
SELECT p.name, p.price, c.name as category, p.rating
FROM products p
JOIN categories c ON p.category_id = c.id;
```

---

## 🔑 Test User Credentials

After inserting sample data:

**Regular User:**
- Email: `test@test.com`
- Password: `Test@1234`
- Role: `USER`

**Admin User:**
- Email: `admin@example.com`
- Password: `Test@1234`
- Role: `ADMIN`

---

## 🛠️ Common SQL Commands

### View All Tables
```sql
\dt  -- (psql command)

-- Or query:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### View Table Structure
```sql
\d+ table_name  -- (psql command)

-- Or query:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### Clear a Table
```sql
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM orders;
```

### Reset Sequences (for auto-increment)
```sql
SELECT setval('table_id_seq', (SELECT MAX(id) FROM table_name));
```

### Drop All Tables (Clean Start)
```sql
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS delivery_tracking CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS delivery_agents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

---

## 🚀 Docker Commands

### Start PostgreSQL
```bash
docker run --name quickcart-postgres \
  -e POSTGRES_USER=quickcart \
  -e POSTGRES_PASSWORD=quickcart123 \
  -e POSTGRES_DB=quickcart_db \
  -p 5432:5432 \
  -d postgres:14-alpine
```

### Start pgAdmin
```bash
docker run --name pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 5050:80 \
  -d dpage/pgadmin4
```

### Check if Running
```bash
docker ps --filter "name=quickcart"
```

### View Logs
```bash
docker logs quickcart-postgres
docker logs pgadmin
```

### Stop Services
```bash
docker stop quickcart-postgres
docker stop pgadmin
```

### Remove Containers
```bash
docker rm quickcart-postgres
docker rm pgadmin
```

### Remove Volumes (Delete Data)
```bash
docker volume rm postgres_data
```

---

## 📱 Frontend Connection

Once database is setup and running:

```typescript
// Frontend makes requests to: http://localhost/api/...
// Backend connects to: postgresql://quickcart:quickcart123@localhost:5432/quickcart_db

// Example flow:
1. User opens http://localhost:5173
2. Clicks "Try Demo Mode"
3. Frontend loads products from database
4. User adds to cart (stored locally in browser)
5. Clicks checkout
6. Sends order to backend API
7. Backend saves to PostgreSQL
8. User can view order history
```

---

## ✅ Checklist

- [ ] PostgreSQL running (verify with `docker ps`)
- [ ] Database `quickcart_db` created
- [ ] All 14 tables created
- [ ] 7 categories inserted
- [ ] 6 products inserted
- [ ] 2 users created (test + admin)
- [ ] Connection string works
- [ ] Can connect from pgAdmin/psql
- [ ] Frontend can load products
- [ ] Login works with test credentials

---

## 🆘 Troubleshooting

### "Connection refused"
```bash
# PostgreSQL not running
docker ps  # Check if quickcart-postgres is listed

# Start it:
docker run --name quickcart-postgres ... (see above)
```

### "FATAL: authentication failed"
```bash
# Wrong credentials in connection string
# Verify: quickcart / quickcart123

# Or reset password:
docker exec quickcart-postgres psql -U postgres -c "ALTER USER quickcart WITH PASSWORD 'quickcart123';"
```

### "database quickcart_db does not exist"
```sql
-- Connect as postgres user:
psql -h localhost -U postgres

-- Create database:
CREATE DATABASE quickcart_db OWNER quickcart;
```

### "permission denied"
```sql
-- Grant permissions:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO quickcart;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO quickcart;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO quickcart;
```

---

## 📚 All SQL Files

- **Complete Setup:** `infra/postgres/init_database.sql`
- **Quick Commands:** See [MANUAL_DATABASE_SETUP.md](MANUAL_DATABASE_SETUP.md)
- **Schema Diagram:** See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🎉 You're All Set!

Everything you need is here. Pick a method above and get your database running!

**Easiest way:** Double-click `START_POSTGRES_DOCKER.bat` then `START_PGADMIN.bat` 👆

Then run the SQL from [MANUAL_DATABASE_SETUP.md](MANUAL_DATABASE_SETUP.md) 🚀
