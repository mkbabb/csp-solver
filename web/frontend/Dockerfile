###############################################################################
# Base
###############################################################################
FROM node:22-slim AS base
WORKDIR /app

###############################################################################
# Dependencies
###############################################################################
FROM base AS dependencies
# node:22-slim bundles npm 10.x, which resolves this lockfile differently than
# the npm >=11 that generated it (EUSAGE: missing peers). Pin the client major.
RUN npm install -g npm@^11
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
    # M5b security headers — mirrors web/nginx/sudoku.conf + public/_headers;
    # keep the three in lockstep.
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://avatars.githubusercontent.com; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    location / { try_files $uri $uri/ /index.html; }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
