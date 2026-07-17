# Simple static file server - no build step needed
FROM nginx:alpine

# Copy all site files directly
COPY . /usr/share/nginx/html/

# Remove unnecessary files from the image
RUN rm -rf /usr/share/nginx/html/node_modules \
    /usr/share/nginx/html/package*.json \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/.git \
    /usr/share/nginx/html/.gitignore \
    /usr/share/nginx/html/.env* \
    /usr/share/nginx/html/.claude

# Custom nginx config
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
