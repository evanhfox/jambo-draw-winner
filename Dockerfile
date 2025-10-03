# Multi-stage build for lightweight production image
FROM oven/bun:1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

# Build the application
RUN bun run build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Add labels for better maintainability
LABEL maintainer="Contest Draw Platform"
LABEL description="Lightweight contest draw platform with cryptographically secure randomization"
LABEL version="1.0.0"

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
