# Docker Setup for Contest Draw Platform

This document provides instructions for running the Contest Draw Platform using Docker in both development and production environments.

## 🐳 Quick Start

### Production (Recommended)

```bash
# Build and run the production container
npm run docker:prod

# Or manually:
docker-compose up contest-draw
```

The application will be available at `http://localhost:3000`

### Development with Hot Reload

```bash
# Run development container with hot reload
npm run docker:dev

# Or manually:
docker-compose --profile dev up contest-draw-dev
```

The development server will be available at `http://localhost:8080`

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build the production Docker image |
| `npm run docker:run` | Run the production container on port 3000 |
| `npm run docker:dev` | Start development container with hot reload |
| `npm run docker:prod` | Start production container |
| `npm run docker:down` | Stop all containers |
| `npm run docker:clean` | Clean up Docker system and volumes |

## 🏗️ Architecture

### Multi-Stage Build

The production Dockerfile uses a multi-stage build process:

1. **Dependencies Stage**: Install production dependencies
2. **Builder Stage**: Build the React application
3. **Runner Stage**: Serve with lightweight nginx:alpine

### Image Size Optimization

- **Base Image**: `nginx:alpine` (~23MB)
- **Final Image**: ~50-80MB (depending on build artifacts)
- **Gzip Compression**: Enabled for static assets
- **Layer Caching**: Optimized for faster rebuilds

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `80` | Container port (nginx) |

### Ports

- **Production**: `3000:80` (host:container)
- **Development**: `8080:8080` (host:container)

### Volumes

Development mode mounts the source code for hot reloading:
- Source code: `.:/app`
- Node modules: `/app/node_modules` (anonymous volume)

## 🚀 Deployment

### Docker Hub

```bash
# Build and tag for Docker Hub
docker build -t yourusername/contest-draw-winner:latest .

# Push to Docker Hub
docker push yourusername/contest-draw-winner:latest
```

### Docker Compose Production

```bash
# Production deployment
docker-compose up -d contest-draw

# With custom port
docker-compose up -d -p 8080:80 contest-draw
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: contest-draw-winner
spec:
  replicas: 3
  selector:
    matchLabels:
      app: contest-draw-winner
  template:
    metadata:
      labels:
        app: contest-draw-winner
    spec:
      containers:
      - name: contest-draw-winner
        image: yourusername/contest-draw-winner:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

## 🔍 Health Checks

The container includes built-in health checks:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost:3000/health
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Use different port
   docker run -p 3001:80 contest-draw-winner
   ```

2. **Build Failures**
   ```bash
   # Clean Docker cache
   npm run docker:clean
   
   # Rebuild without cache
   docker build --no-cache -t contest-draw-winner .
   ```

3. **Permission Issues**
   ```bash   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Logs

```bash
# View container logs
docker-compose logs contest-draw

# Follow logs in real-time
docker-compose logs -f contest-draw
```

## 📊 Performance

### Resource Usage

- **Memory**: ~50-80MB (production)
- **CPU**: Minimal (static file serving)
- **Disk**: ~100MB (image size)

### Optimization Features

- ✅ Multi-stage build
- ✅ Alpine Linux base
- ✅ Nginx with gzip compression
- ✅ Static asset caching
- ✅ Security headers
- ✅ Health checks

## 🔒 Security

The Docker setup includes several security features:

- **Non-root user**: nginx runs as non-root
- **Security headers**: XSS protection, content type options
- **Minimal attack surface**: Alpine Linux base
- **No unnecessary packages**: Only required dependencies

## 📝 Development Workflow

1. **Make changes** to source code
2. **Hot reload** automatically updates the development container
3. **Test** changes in browser
4. **Build production** image when ready
5. **Deploy** to production environment

## 🤝 Contributing

When contributing to the Docker setup:

1. Test both development and production builds
2. Ensure images remain lightweight
3. Update documentation for any changes
4. Test on different platforms (Linux, macOS, Windows)

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/dockerfile_best-practices/#use-multi-stage-builds)
