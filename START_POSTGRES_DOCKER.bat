@echo off
REM Start PostgreSQL in Docker for manual database setup

echo ===================================================
echo Starting PostgreSQL Database (Docker)
echo ===================================================
echo.

REM Check if Docker is running
docker ps > nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running
    echo Please start Docker Desktop first
    pause
    exit /b 1
)

echo Starting PostgreSQL container...
docker run --name quickcart-postgres ^
  -e POSTGRES_USER=quickcart ^
  -e POSTGRES_PASSWORD=quickcart123 ^
  -e POSTGRES_DB=quickcart_db ^
  -p 5432:5432 ^
  -v postgres_data:/var/lib/postgresql/data ^
  -d postgres:14-alpine

echo.
echo ===================================================
echo PostgreSQL Started Successfully!
echo ===================================================
echo.
echo Database Connection Details:
echo   Host:     localhost
echo   Port:     5432
echo   Username: quickcart
echo   Password: quickcart123
echo   Database: quickcart_db
echo.
echo Connection String:
echo   postgresql://quickcart:quickcart123@localhost:5432/quickcart_db
echo.
echo Waiting for database to be ready...
timeout /t 5 /nobreak
echo.

echo Testing connection...
docker exec quickcart-postgres pg_isready -U quickcart > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL is ready!
) else (
    echo [!] PostgreSQL is starting, please wait...
    timeout /t 10 /nobreak
)

echo.
echo Next steps:
echo   1. Open pgAdmin (or use psql)
echo   2. Connect with details above
echo   3. Run SQL commands from MANUAL_DATABASE_SETUP.md
echo   4. Test with: psql -h localhost -U quickcart -d quickcart_db
echo.
echo To stop PostgreSQL later:
echo   docker stop quickcart-postgres
echo   docker rm quickcart-postgres
echo.
pause
