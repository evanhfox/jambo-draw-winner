# Contest Draw Platform 🎲

A secure, auditable, and truly random contest draw platform built with React, TypeScript, and cryptographically secure randomization.

## 🔒 Security Features

- **Cryptographically Secure**: Uses `crypto.getRandomValues()` for true randomness
- **Fisher-Yates Shuffle**: Mathematically proven unbiased selection algorithm
- **Audit Trail**: Complete documentation with timestamps and unique draw IDs
- **Transparent Process**: Detailed explanations and visual demonstrations
- **Downloadable Reports**: TXT and JSON audit reports for verification

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Production deployment
npm run docker:prod

# Development with hot reload
npm run docker:dev
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🐳 Docker Deployment

This project includes a lightweight Docker setup optimized for production:

- **Multi-stage build** for minimal image size (~50-80MB)
- **nginx:alpine** base for security and performance
- **Health checks** and monitoring
- **Gzip compression** and caching
- **Security headers** included

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Randomization**: Web Crypto API + Fisher-Yates shuffle
- **Deployment**: Docker + nginx (production)

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerized deployment)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/evanhfox/jambo-draw-winner.git
cd jambo-draw-winner

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage |
| `npm run docker:prod` | Run production Docker container |
| `npm run docker:dev` | Run development Docker container |
| `npm run docker:clean` | Clean Docker system |

## 🧪 Testing

This project includes comprehensive testing:

- **Unit Tests**: Core logic and utilities
- **Component Tests**: React component behavior
- **Integration Tests**: End-to-end user workflows
- **Coverage Reports**: Detailed test coverage analysis

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run production container
npm run docker:prod

# Access at http://localhost:3000
```

### Manual Deployment

```bash
# Build the application
npm run build

# Serve the dist folder with any static server
# Example with serve:
npx serve dist
```

## 📚 Documentation

- [Docker Setup](./DOCKER.md) - Detailed Docker configuration
- [Testing Guide](./TESTING.md) - Comprehensive testing documentation
- [Manual Testing](./MANUAL_TESTING.md) - Manual testing procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
