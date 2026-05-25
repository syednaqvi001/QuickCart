#!/bin/bash

# Create frontend structure
mkdir -p frontend/src/{api,store,hooks,components,pages/{public,user,admin},router,types,utils,assets/icons}
mkdir -p frontend/public

# Create gateway-nginx
mkdir -p gateway-nginx/conf.d

# Create services
SERVICES=("auth-service" "product-service" "cart-service" "order-service" "notification-service" "delivery-service")

for service in "${SERVICES[@]}"; do
  mkdir -p "services/$service/src/{auth,user,product,category,inventory,storage,cache,database,delivery,delivery-agent,tracking,notification,cart,order,events,guards,common/{filters,interceptors,pipes,constants},config}"
  mkdir -p "services/$service/prisma"
done

# Create infrastructure
mkdir -p infra/{postgres,rabbitmq,redis,minio}/data

# Create docs
mkdir -p docs

# Create postman
mkdir -p postman

# Create scripts
mkdir -p scripts

echo "Folder structure created successfully!"
