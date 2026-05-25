# Database Setup - 5 Minute Version ⚡

## 🎯 Fastest Way to Get Database Running

This is the absolute simplest method. Just 3 steps, 5 minutes max.

---

## 🚀 Step 1: Start PostgreSQL (1 minute)

**Windows - Double-click this file:**
```
START_POSTGRES_DOCKER.bat
```

Or in terminal:
```bash
docker run --name quickcart-postgres -e POSTGRES_USER=quickcart -e POSTGRES_PASSWORD=quickcart123 -e POSTGRES_DB=quickcart_db -p 5432:5432 -d postgres:14-alpine
```

**Wait 10 seconds for it to start.**

---

## 🎨 Step 2: Open pgAdmin GUI (2 minutes)

**Windows - Double-click this file:**
```
START_PGADMIN.bat
```

Or in terminal:
```bash
docker run --name pgadmin -e PGADMIN_DEFAULT_EMAIL=admin@example.com -e PGADMIN_DEFAULT_PASSWORD=admin -p 5050:80 -d dpage/pgadmin4
```

**Browser opens automatically to:**
```
http://localhost:5050
```

**Login:**
- Email: `admin@example.com`
- Password: `admin`

---

## 🗄️ Step 3: Create Database & Tables (2 minutes)

### In pgAdmin:
1. Right-click "Servers" → "Create" → "Server"
2. Name it: `QuickCart`
3. Go to "Connection" tab
4. Fill in:
   ```
   Host:     localhost
   Port:     5432
   Username: quickcart
   Password: quickcart123
   Database: quickcart_db
   ```
5. Click "Save"

### Create Tables:
1. Right-click `quickcart_db` → "Query Tool"
2. Open file: `COMPLETE_SQL_SETUP.sql`
3. Copy-paste entire content
4. Press **F5** to execute
5. Wait 10 seconds
6. Done! ✅

---

## ✅ Verification (30 seconds)

In pgAdmin Query Tool, run:
```sql
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

You should see:
```
count
───────
7      (categories)
6      (products)
2      (users)
```

---

## 🔑 Test Credentials

```
Email:    test@test.com
Password: Test@1234
Role:     USER
```

Or admin:
```
Email:    admin@example.com
Password: Test@1234
Role:     ADMIN
```

---

## 🎮 Test in Frontend

1. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open: `http://localhost:5173`

3. Click "Try Demo Mode"

4. You should see 6 products from database ✅

---

## 🔍 That's All!

Your database is now set up with:
- ✅ 14 tables
- ✅ 7 categories
- ✅ 6 products
- ✅ 2 test users
- ✅ All relationships & indexes

---

## 📞 If Something Goes Wrong

### PostgreSQL won't start
```bash
docker ps  # Check if running
docker logs quickcart-postgres  # See error
docker restart quickcart-postgres  # Restart
```

### pgAdmin won't connect
- Wait 10 more seconds
- Refresh browser: F5
- Check credentials match above

### Can't find COMPLETE_SQL_SETUP.sql
- It's in the QuickCart root folder
- Open file browser: `c:\Users\syed.s.naqvi\Desktop\AI\QuickCart`

### Connection refused when running frontend
- That's normal! Backend isn't running yet
- Frontend can work in demo mode without backend
- When you connect backend later, API will work

---

## 🎉 You're Done!

Database is running. Frontend can access sample data. Ready to build! 🚀

---

## 📚 Next Steps (Optional)

Want to understand more? See:
- [DATABASE_QUICK_REFERENCE.md](DATABASE_QUICK_REFERENCE.md) - Commands reference
- [MANUAL_DATABASE_SETUP.md](MANUAL_DATABASE_SETUP.md) - Detailed guide
- [API_INTEGRATION.md](API_INTEGRATION.md) - How API connects to DB

---

**That's it. Seriously. You're done.** ✨

3 steps, 5 minutes. Database ready.
