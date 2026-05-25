@echo off
REM Start pgAdmin (PostgreSQL GUI tool) in Docker

echo ===================================================
echo Starting pgAdmin for Database Management
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

echo Starting pgAdmin container...
docker run --name pgadmin ^
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com ^
  -e PGADMIN_DEFAULT_PASSWORD=admin ^
  -p 5050:80 ^
  -d dpage/pgadmin4

echo.
echo ===================================================
echo pgAdmin Started Successfully!
echo ===================================================
echo.
echo Access pgAdmin at: http://localhost:5050
echo.
echo Login credentials:
echo   Email:    admin@example.com
echo   Password: admin
echo.
echo Setup instructions:
echo   1. Open http://localhost:5050 in browser
echo   2. Login with credentials above
echo   3. Right-click "Servers" -> "Create" -> "Server"
echo   4. Server name: "QuickCart"
echo   5. In "Connection" tab, enter:
echo      - Host: localhost
echo      - Port: 5432
echo      - Username: quickcart
echo      - Password: quickcart123
echo      - Database: quickcart_db
echo   6. Click "Save"
echo.
echo Waiting for pgAdmin to start...
timeout /t 5 /nobreak
echo.

REM Open browser automatically (Windows)
echo Opening http://localhost:5050 in browser...
start http://localhost:5050

echo.
echo pgAdmin should open in your browser
echo If it doesn't, manually visit: http://localhost:5050
echo.
echo To stop pgAdmin later:
echo   docker stop pgadmin
echo   docker rm pgadmin
echo.
pause
