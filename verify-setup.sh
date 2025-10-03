#!/bin/bash

# Contest Draw Platform - Setup Verification Script
# This script checks if everything is properly configured

echo "🔍 Contest Draw Platform - Setup Verification"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 is installed${NC} ($($1 --version 2>/dev/null | head -n1))"
        return 0
    else
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    fi
}

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is missing${NC}"
        return 1
    fi
}

# Function to check if directory exists
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1 directory exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 directory is missing${NC}"
        return 1
    fi
}

echo ""
echo -e "${BLUE}📋 Checking Required Tools${NC}"
echo "=========================="

# Check Node.js
node_ok=false
if check_command "node"; then
    node_ok=true
fi

# Check npm
npm_ok=false
if check_command "npm"; then
    npm_ok=true
fi

# Check bun (alternative)
bun_ok=false
if check_command "bun"; then
    bun_ok=true
fi

# Check Docker
docker_ok=false
if check_command "docker"; then
    docker_ok=true
fi

echo ""
echo -e "${BLUE}📁 Checking Project Files${NC}"
echo "=========================="

# Check essential files
files_ok=true
check_file "package.json" || files_ok=false
check_file "vite.config.ts" || files_ok=false
check_file "vitest.config.ts" || files_ok=false
check_file "Dockerfile" || files_ok=false
check_file "docker-compose.yml" || files_ok=false
check_file "nginx.conf" || files_ok=false

echo ""
echo -e "${BLUE}📂 Checking Source Structure${NC}"
echo "============================="

# Check source directories
src_ok=true
check_directory "src" || src_ok=false
check_directory "src/components" || src_ok=false
check_directory "src/pages" || src_ok=false
check_directory "src/test" || src_ok=false
check_directory "src/test/components" || src_ok=false
check_directory "src/test/utils" || src_ok=false

echo ""
echo -e "${BLUE}🧪 Checking Test Files${NC}"
echo "======================="

# Check test files
tests_ok=true
check_file "src/test/setup.ts" || tests_ok=false
check_file "src/test/utils/drawLogic.test.ts" || tests_ok=false
check_file "src/test/components/FileUpload.test.tsx" || tests_ok=false
check_file "src/test/components/ParticipantsList.test.tsx" || tests_ok=false
check_file "src/test/components/WinnersDisplay.test.tsx" || tests_ok=false
check_file "src/test/components/RandomnessVisualization.test.tsx" || tests_ok=false
check_file "src/test/pages/Index.test.tsx" || tests_ok=false

echo ""
echo -e "${BLUE}📚 Checking Documentation${NC}"
echo "=========================="

# Check documentation files
docs_ok=true
check_file "README.md" || docs_ok=false
check_file "DOCKER.md" || docs_ok=false
check_file "TESTING.md" || docs_ok=false
check_file "MANUAL_TESTING.md" || docs_ok=false

echo ""
echo -e "${BLUE}📊 Summary${NC}"
echo "========"

# Overall status
overall_ok=true

if [ "$node_ok" = false ] && [ "$bun_ok" = false ]; then
    echo -e "${RED}❌ No JavaScript runtime found (Node.js or Bun)${NC}"
    overall_ok=false
fi

if [ "$npm_ok" = false ] && [ "$bun_ok" = false ]; then
    echo -e "${RED}❌ No package manager found (npm or Bun)${NC}"
    overall_ok=false
fi

if [ "$files_ok" = false ]; then
    echo -e "${RED}❌ Some essential files are missing${NC}"
    overall_ok=false
fi

if [ "$src_ok" = false ]; then
    echo -e "${RED}❌ Source directory structure is incomplete${NC}"
    overall_ok=false
fi

if [ "$tests_ok" = false ]; then
    echo -e "${RED}❌ Test files are missing${NC}"
    overall_ok=false
fi

if [ "$docs_ok" = false ]; then
    echo -e "${YELLOW}⚠️  Some documentation files are missing${NC}"
fi

echo ""
if [ "$overall_ok" = true ]; then
    echo -e "${GREEN}🎉 Setup verification PASSED!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Run: ./test-runner.sh"
    echo "2. Or manually: npm install && npm run dev"
    echo "3. Open browser to: http://localhost:8080"
    echo ""
    echo -e "${BLUE}For Docker:${NC}"
    echo "1. Start Docker Desktop"
    echo "2. Run: docker build -t contest-draw-winner ."
    echo "3. Run: docker run -p 3000:80 contest-draw-winner"
    echo "4. Open browser to: http://localhost:3000"
else
    echo -e "${RED}❌ Setup verification FAILED!${NC}"
    echo ""
    echo -e "${BLUE}Please fix the issues above before proceeding.${NC}"
    echo ""
    echo -e "${BLUE}Common solutions:${NC}"
    echo "• Install Node.js: https://nodejs.org/"
    echo "• Install Docker: https://www.docker.com/products/docker-desktop"
    echo "• Run: git clone <repository-url> to get all files"
fi

echo ""
echo -e "${BLUE}📖 For detailed instructions, see:${NC}"
echo "• README.md - General information"
echo "• MANUAL_TESTING.md - Testing guide"
echo "• TESTING.md - Automated testing"
echo "• DOCKER.md - Docker deployment"
