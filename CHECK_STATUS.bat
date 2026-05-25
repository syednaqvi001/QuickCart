@echo off
REM Check status of QuickCart services

echo ===================================================
echo QuickCart Services Status Check
echo ===================================================
echo.

REM Check Docker
echo Checking Docker status...
docker ps > nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Docker is NOT running
    echo Start Docker Desktop manually
    goto :end
) else (
    echo [OK] Docker is running
)

echo.
echo Checking Running Containers...
echo.
docker ps --filter "name=quickcart" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ===================================================
echo Service Endpoints
echo ===================================================
echo.

REM Check each service
setlocal enabledelayedexpansion

set "services[0]=http://localhost/health"
set "services[1]=http://localhost:3001/health"
set "services[2]=http://localhost:3002/health"
set "services[3]=http://localhost:3003/health"
set "services[4]=http://localhost:3004/health"
set "services[5]=http://localhost:3005/health"
set "services[6]=http://localhost:3006/health"
set "services[7]=http://localhost:5432"

set "names[0]=API Gateway (NGINX)"
set "names[1]=Auth Service"
set "names[2]=Product Service"
set "names[3]=Cart Service"
set "names[4]=Order Service"
set "names[5]=Notification Service"
set "names[6]=Delivery Service"
set "names[7]=PostgreSQL (Database)"

for /l %%i in (0,1,7) do (
    echo Testing !names[%%i]!...
    curl -s !services[%%i]! > nul 2>&1
    if !errorlevel! equ 0 (
        echo   [OK] !services[%%i]!
    ) else (
        echo   [X] !services[%%i]! - Not responding
    )
)

echo.
echo ===================================================
echo Database Info
echo ===================================================
echo.
echo PostgreSQL Connection String:
echo   postgresql://quickcart:quickcart123@localhost:5432/quickcart_db
echo.
echo To connect with psql:
echo   psql -h localhost -U quickcart -d quickcart_db
echo.

:end
echo.
echo Done! Press any key to exit...
pause > nul
