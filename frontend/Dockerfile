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
ARG VITE_BASE_URL=/
ENV VITE_BASE_URL=${VITE_BASE_URL}
# Copy built files under the base URL path so asset references resolve.
COPY --from=builder /app/dist /usr/share/nginx/html${VITE_BASE_URL}
# Generate nginx config with the correct base path for SPA fallback.
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location %s {\n\
        try_files $uri $uri/ %sindex.html;\n\
    }\n\
\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' "${VITE_BASE_URL}" "${VITE_BASE_URL}" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
