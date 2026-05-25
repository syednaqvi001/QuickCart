# PostgreSQL Database Setup - Complete Guide 📊

## 🎯 Choose Your Path

### ⚡ I have 5 minutes
→ Read: **[SETUP_IN_5_MINUTES.md](SETUP_IN_5_MINUTES.md)**

### ⏱️ I have 15 minutes
→ Read: **[DATABASE_SETUP_SUMMARY.md](DATABASE_SETUP_SUMMARY.md)**

### 📖 I want detailed instructions
→ Read: **[MANUAL_DATABASE_SETUP.md](MANUAL_DATABASE_SETUP.md)**

### 🔍 I need to look something up
→ Read: **[DATABASE_QUICK_REFERENCE.md](DATABASE_QUICK_REFERENCE.md)**

### 💻 I want to understand the API
→ Read: **[API_INTEGRATION.md](API_INTEGRATION.md)**

---

## 📋 What You Have

### Ready-to-Use Files

| File | Purpose |
|------|---------|
| `COMPLETE_SQL_SETUP.sql` | Copy-paste this into pgAdmin (all SQL in one file) |
| `START_POSTGRES_DOCKER.bat` | Click to start PostgreSQL |
| `START_PGADMIN.bat` | Click to start pgAdmin GUI |
| `SETUP_IN_5_MINUTES.md` | Fastest way to get running |
| `DATABASE_SETUP_SUMMARY.md` | Quick overview with all options |
| `MANUAL_DATABASE_SETUP.md` | Step-by-step detailed guide |
| `DATABASE_QUICK_REFERENCE.md` | Command lookup reference |
| `API_INTEGRATION.md` | All API endpoints documented |

---

## 🚀 The Simplest Way

1. **Double-click:** `START_POSTGRES_DOCKER.bat`
2. **Double-click:** `START_PGADMIN.bat`
3. **Open:** http://localhost:5050
4. **Create connection** with credentials below
5. **Copy-paste** `COMPLETE_SQL_SETUP.sql` into Query Tool
6. **Press F5** to execute
7. **Done!** ✅

---

## 🔐 Connection Details

```
Database:  quickcart_db
Host:      localhost
Port:      5432
Username:  quickcart
Password:  quickcart123
```

---

## 📊 Database Includes

- **14 tables** with proper relationships
- **7 product categories** (Fruits, Vegetables, Dairy, etc.)
- **6 sample products** with prices & ratings
- **2 test users** for login testing
- **Automatic timestamps** on all tables
- **Indexes** for query performance
- **Foreign keys** for data integrity
- **Check constraints** for data validation
- **Triggers** for automatic updates

---

## 🔑 Test Credentials

```
Regular User:
  Email: test@test.com
  Password: Test@1234

Admin User:
  Email: admin@example.com
  Password: Test@1234
```

---

## ✅ Verification

After setup, run in pgAdmin:
```sql
SELECT COUNT(*) FROM categories;  -- Should be 7
SELECT COUNT(*) FROM products;    -- Should be 6
SELECT COUNT(*) FROM users;       -- Should be 2
```

---

## 🎓 Available Guides

| Document | Best For |
|----------|----------|
| SETUP_IN_5_MINUTES.md | Quick setup without details |
| DATABASE_SETUP_SUMMARY.md | Understanding all options |
| MANUAL_DATABASE_SETUP.md | Complete step-by-step guide |
| DATABASE_QUICK_REFERENCE.md | Looking up commands |
| API_INTEGRATION.md | Understanding API structure |
| BACKEND_CONNECTION_GUIDE.md | Full Docker setup |

---

## 🛠️ Choose Your Tool

### pgAdmin (Recommended for Beginners)
- GUI interface
- Visual database explorer
- Query tool included
- No command line needed

See: **SETUP_IN_5_MINUTES.md**

### psql (Command Line)
- Fast
- Powerful
- For developers

See: **DATABASE_QUICK_REFERENCE.md** → "Command Line Access"

### DBeaver (Desktop App)
- Professional tool
- Visual AND SQL support
- Download from dbeaver.io

See: **DATABASE_QUICK_REFERENCE.md** → "Method 3"

---

## 🚀 Quick Steps Summary

```
1. Start PostgreSQL → START_POSTGRES_DOCKER.bat
2. Start pgAdmin   → START_PGADMIN.bat
3. Create server   → http://localhost:5050
4. Run SQL         → Paste COMPLETE_SQL_SETUP.sql
5. Done!           → Database ready to use
```

---

## 📞 Support

**Can't find something?**
- Check: [DATABASE_QUICK_REFERENCE.md](DATABASE_QUICK_REFERENCE.md)

**Need detailed steps?**
- Check: [MANUAL_DATABASE_SETUP.md](MANUAL_DATABASE_SETUP.md)

**Want the 5-minute version?**
- Check: [SETUP_IN_5_MINUTES.md](SETUP_IN_5_MINUTES.md)

**Understanding PostgreSQL?**
- Visit: https://www.postgresql.org/docs/

---

## 🎉 Ready?

Pick a guide above and get started!

Everything you need is here. 🚀
