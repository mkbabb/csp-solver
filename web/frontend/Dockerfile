###############################################################################
# Base
###############################################################################
FROM node:22-slim AS base
WORKDIR /app

###############################################################################
# Dependencies
###############################################################################
FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm ci

###############################################################################
# Development
###############################################################################
FROM dependencies AS development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

###############################################################################
# Builder
###############################################################################
FROM dependencies AS builder
COPY . .
ARG VITE_API_URL
ARG VITE_BASE_URL=/
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BASE_URL=${VITE_BASE_URL}
RUN npm run build

###############################################################################
# Production
###############################################################################
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
