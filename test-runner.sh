#!/bin/bash

# Contest Draw Platform Test Runner
# This script helps you run tests and verify the application

echo "🎲 Contest Draw Platform - Test Runner"
echo "======================================"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or use: brew install node (on macOS)"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    echo "Please install npm or use bun instead"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Function to run tests
run_tests() {
    echo ""
    echo "🧪 Running Tests..."
    echo "=================="
    
    # Run tests with coverage
    npm run test:coverage
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ All tests passed!"
        echo "📊 Coverage report generated in coverage/ directory"
    else
        echo ""
        echo "❌ Some tests failed"
        echo "Check the output above for details"
        return 1
    fi
}

# Function to start development server
start_dev() {
    echo ""
    echo "🚀 Starting Development Server..."
    echo "================================"
    echo "The application will be available at: http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    npm run dev
}

# Function to build for production
build_prod() {
    echo ""
    echo "🏗️  Building for Production..."
    echo "============================="
    
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Production build completed successfully"
        echo "📁 Build files are in the dist/ directory"
    else
        echo "❌ Build failed"
        return 1
    fi
}

# Function to run linting
run_lint() {
    echo ""
    echo "🔍 Running Linting..."
    echo "===================="
    
    npm run lint
    
    if [ $? -eq 0 ]; then
        echo "✅ No linting errors found"
    else
        echo "❌ Linting errors found"
        echo "Please fix the errors above"
        return 1
    fi
}

# Function to run Docker build
run_docker() {
    echo ""
    echo "🐳 Building Docker Image..."
    echo "=========================="
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed or not in PATH"
        echo "Please install Docker Desktop"
        return 1
    fi
    
    docker build -t contest-draw-winner .
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker image built successfully"
        echo "Run with: docker run -p 3000:80 contest-draw-winner"
    else
        echo "❌ Docker build failed"
        return 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Run tests with coverage"
    echo "2) Start development server"
    echo "3) Build for production"
    echo "4) Run linting"
    echo "5) Build Docker image"
    echo "6) Run all checks (lint + test + build)"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
}

# Main execution
main() {
    while true; do
        show_menu
        
        case $choice in
            1)
                run_tests
                ;;
            2)
                start_dev
                ;;
            3)
                build_prod
                ;;
            4)
                run_lint
                ;;
            5)
                run_docker
                ;;
            6)
                echo "🔄 Running all checks..."
                run_lint && run_tests && build_prod
                if [ $? -eq 0 ]; then
                    echo ""
                    echo "🎉 All checks passed! Your application is ready for deployment."
                else
                    echo ""
                    echo "❌ Some checks failed. Please fix the issues above."
                fi
                ;;
            7)
                echo "👋 Goodbye!"
                exit 0
                ;;
            *)
                echo "❌ Invalid choice. Please enter 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Check if script is being run directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main
fi
