@echo off
REM Start Docker Desktop and then start QuickCart backend services

echo ===================================================
echo QuickCart Backend Startup Script
echo ===================================================
echo.

REM Check if Docker is running
echo Checking if Docker Desktop is running...
docker ps > nul 2>&1

if %errorlevel% neq 0 (
    echo Docker Desktop is not running. Starting it now...
    REM Try to start Docker Desktop
    cd %PROGRAMFILES%\Docker\Docker
    start Docker Desktop.lnk
    echo Waiting 30 seconds for Docker Desktop to start...
    timeout /t 30 /nobreak
) else (
    echo Docker is already running!
)

echo.
echo ===================================================
echo Starting Backend Services with Docker Compose
echo ===================================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo .env file created successfully!
)

REM Start services
echo Starting services...
docker-compose up --build

echo.
echo Services startup complete!
echo.
echo Available Services:
echo   - Frontend: http://localhost:3000 (if enabled in docker-compose)
echo   - API Gateway: http://localhost
echo   - Auth Service: http://localhost:3001
echo   - Product Service: http://localhost:3002
echo   - Cart Service: http://localhost:3003
echo   - Order Service: http://localhost:3004
echo   - Notification Service: http://localhost:3005
echo   - Delivery Service: http://localhost:3006
echo   - PostgreSQL: localhost:5432
echo   - Redis: localhost:6379
echo   - RabbitMQ Admin: http://localhost:15672 (guest/guest)
echo   - MinIO: http://localhost:9001 (minioadmin/minioadmin)
echo.
pause
