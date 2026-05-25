FROM nginx:alpine

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Create health check endpoint
RUN echo "server { listen 80; location /health { access_log off; return 200 'ok'; } }" > /etc/nginx/conf.d/health.conf

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
