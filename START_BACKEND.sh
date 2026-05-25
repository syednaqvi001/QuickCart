#!/bin/bash

# QuickCart Backend Startup Script
# Usage: bash START_BACKEND.sh

echo "==================================================="
echo "QuickCart Backend Startup Script"
echo "==================================================="
echo ""

# Check if Docker is running
echo "Checking if Docker is running..."
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    echo ""
    echo "Start Docker Desktop manually:"
    echo "  1. Open Windows Start menu"
    echo "  2. Search for 'Docker Desktop'"
    echo "  3. Click to launch"
    echo "  4. Wait 2-3 minutes for it to start"
    echo "  5. Then run this script again"
    echo ""
    exit 1
else
    echo "✅ Docker is running"
fi

echo ""
echo "==================================================="
echo "Starting Backend Services with Docker Compose"
echo "==================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
fi

# Start services
echo "Starting all services..."
echo "This may take 5-10 minutes on first run..."
echo ""

docker-compose up --build

echo ""
echo "==================================================="
echo "Services Started Successfully!"
echo "==================================================="
echo ""
echo "Available Endpoints:"
echo "  📱 Frontend:        http://localhost:5173 (dev) or http://localhost:3000 (docker)"
echo "  🔌 API Gateway:     http://localhost"
echo "  🔐 Auth Service:    http://localhost:3001"
echo "  📦 Product Service: http://localhost:3002"
echo "  🛒 Cart Service:    http://localhost:3003"
echo "  📋 Order Service:   http://localhost:3004"
echo "  📢 Notification:    http://localhost:3005"
echo "  🚚 Delivery Service:http://localhost:3006"
echo "  💾 PostgreSQL:      localhost:5432"
echo "  ⚡ Redis:           localhost:6379"
echo "  🐰 RabbitMQ:        http://localhost:15672 (guest/guest)"
echo "  💾 MinIO:           http://localhost:9001 (minioadmin/minioadmin)"
echo ""

exit 0
