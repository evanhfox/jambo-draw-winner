# Contest Draw Platform 🎲

A secure, auditable, and truly random contest draw platform built with React, TypeScript, and cryptographically secure randomization. Perfect for selecting winners from participant lists, including Google Forms exports.

## ✨ Key Features

- **📊 Multiple CSV Formats**: Supports both simple CSV (`name,email`) and Google Forms exports
- **🔒 Cryptographically Secure**: Uses `crypto.getRandomValues()` for true randomness
- **🎯 Fisher-Yates Shuffle**: Mathematically proven unbiased selection algorithm
- **📋 Audit Trail**: Complete documentation with timestamps and unique draw IDs
- **👁️ Transparent Process**: Detailed explanations and visual demonstrations
- **📄 Downloadable Reports**: TXT and JSON audit reports for verification
- **🎨 Modern UI**: Beautiful, responsive interface built with shadcn/ui and Tailwind CSS

## 📊 Supported CSV Formats

### Simple CSV Format
```csv
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com
Bob Wilson,bob.wilson@example.com
```

### Google Forms Export
The platform automatically detects and parses Google Forms CSV exports, extracting participant information from the email addresses. Perfect for:
- Event registrations
- Contest entries
- Survey responses
- Interest forms

**Example Google Forms CSV:**
```csv
Timestamp,Email Address,Response
2025-09-24 14:35:05,john.doe@example.com,"I understand and agree to the requirements."
2025-09-24 14:36:44,jane.smith@example.com,"I confirm I am interested."
```

## 🚀 Quick Start

### Using Pre-built Container (Recommended)

```bash
# Pull and run the latest container
docker run -d -p 3000:80 ghcr.io/evanhfox/contest-draw:latest

# Access at http://localhost:3000
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/evanhfox/contest-draw.git
cd contest-draw

# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Access at http://localhost:8080
```

### Using Docker (Local Build)

```bash
# Production deployment
npm run docker:prod

# Development with hot reload
npm run docker:dev
```

## 🐳 Docker Deployment

This project includes a lightweight Docker setup optimized for production:

- **Multi-stage build** for minimal image size (~50-80MB)
- **nginx:alpine** base for security and performance
- **Health checks** and monitoring
- **Gzip compression** and caching
- **Security headers** included

### Container Registry

Pre-built containers are automatically published to GitHub Container Registry:

- **Latest**: `ghcr.io/evanhfox/contest-draw:latest`
- **Tagged releases**: `ghcr.io/evanhfox/contest-draw:v1.0.0`
- **Branch builds**: `ghcr.io/evanhfox/contest-draw:main-abc1234`

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
git clone https://github.com/evanhfox/contest-draw.git
cd contest-draw

# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Access at http://localhost:8080
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

## 🧪 Testing & Verification

This project includes comprehensive testing and helpful verification scripts:

### Automated Testing
- **Unit Tests**: Core logic and utilities
- **Component Tests**: React component behavior
- **Integration Tests**: End-to-end user workflows
- **Coverage Reports**: Detailed test coverage analysis

### Helper Scripts

**Quick Setup Verification:**
```bash
# Verify your setup is complete
./verify-setup.sh
```

**Interactive Test Runner:**
```bash
# Run the interactive test runner
./test-runner.sh
```

**Manual Testing:**
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🔒 Security & CI/CD

### Automated Security Scanning

- **Trivy Vulnerability Scanner**: Container and filesystem scanning
- **Dependabot Alerts**: Automated dependency vulnerability checks (requires enabling in repo settings)
- **Weekly Security Scans**: Scheduled security assessments
- **SARIF Reports**: Results uploaded to GitHub Security tab

**Note**: For enhanced security features like dependency review, enable GitHub Advanced Security in repository settings.

### Enabling Security Features

To get the most out of the security scanning:

1. **Enable Dependabot Alerts**:
   - Go to repository Settings → Security & analysis
   - Enable "Dependabot alerts" and "Dependabot security updates"

2. **Enable Dependency Graph**:
   - Enable "Dependency graph" in the same settings page

3. **GitHub Advanced Security** (for private repos):
   - Enables dependency review and code scanning
   - Available for organizations with GitHub Advanced Security

### Continuous Integration

- **Automated Testing**: Full test suite on every push/PR
- **Multi-platform Builds**: AMD64 and ARM64 container support
- **Container Publishing**: Automatic builds to GitHub Container Registry
- **Security Scanning**: Trivy scans on every build
- **Coverage Reports**: Code coverage tracking with Codecov

### Workflow Status

[![CI/CD Pipeline](https://github.com/evanhfox/contest-draw/actions/workflows/ci.yml/badge.svg)](https://github.com/evanhfox/contest-draw/actions/workflows/ci.yml)
[![Container Build](https://github.com/evanhfox/contest-draw/actions/workflows/container.yml/badge.svg)](https://github.com/evanhfox/contest-draw/actions/workflows/container.yml)
[![Security Scan](https://github.com/evanhfox/contest-draw/actions/workflows/security.yml/badge.svg)](https://github.com/evanhfox/contest-draw/actions/workflows/security.yml)

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
- [Container Setup](./CONTAINER_SETUP.md) - Container deployment guide
- [CI/CD Pipeline](./docs/CI_CD_PIPELINE.md) - Complete CI/CD workflow documentation
- [CI/CD Quick Reference](./docs/CI_CD_QUICK_REFERENCE.md) - Quick reference for developers

### Key Features Documentation

- **CSV Support**: Automatically detects and parses both simple CSV and Google Forms exports
- **Security**: Cryptographically secure randomization using Web Crypto API
- **Audit Trail**: Complete documentation of every draw with unique IDs and timestamps
- **Modern UI**: Responsive design with drag-and-drop file upload and real-time feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
