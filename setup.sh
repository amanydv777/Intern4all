#!/bin/bash

# Intern4All - Automated Setup Script
# This script automates the installation and setup process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "Intern4All - Automated Setup"
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js v14 or higher."
        echo "Download from: https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js $(node --version) found"
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_success "npm $(npm --version) found"
    
    if ! command_exists mongod && ! command_exists mongo; then
        print_warning "MongoDB not found locally. You can use MongoDB Atlas instead."
        echo "Download MongoDB: https://www.mongodb.com/try/download/community"
        echo "Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
    else
        print_success "MongoDB found"
    fi
    
    # Frontend setup
    print_header "Setting up Frontend"
    
    print_info "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_info "Creating frontend .env file..."
        cat > .env << EOF
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEMINI_API_KEY=AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80
EOF
        print_success "Frontend .env file created"
    else
        print_success "Frontend .env file already exists"
    fi
    
    # Backend setup
    print_header "Setting up Backend"
    
    cd backend
    
    print_info "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_info "Creating backend .env file from template..."
        
        # Generate a random JWT secret
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        
        cat > .env << EOF
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/intern4all
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/intern4all

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Google OAuth (Optional - Update with your credentials)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional - for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# AI Configuration
GEMINI_API_KEY=AIzaSyBe5lGUCkiDO7cBphomKyUeU-9dYevXQ80
EOF
        print_success "Backend .env file created with auto-generated JWT secret"
    else
        print_success "Backend .env file already exists"
    fi
    
    # Ask about database seeding
    print_header "Database Setup"
    
    echo -e "${YELLOW}Do you want to seed the database with sample data?${NC}"
    echo "This will create sample users, internships, and applications for testing."
    echo -e "${YELLOW}(y/n):${NC} "
    read -r seed_choice
    
    if [[ "$seed_choice" =~ ^[Yy]$ ]]; then
        print_info "Seeding database..."
        
        # Check if MongoDB is running
        if command_exists mongod; then
            # Try to connect to MongoDB
            if nc -z localhost 27017 2>/dev/null; then
                node seeder.js -i
                print_success "Database seeded successfully"
            else
                print_warning "MongoDB is not running. Please start MongoDB first:"
                echo "  Run: mongod"
                echo "  Then run: node seeder.js -i"
            fi
        else
            print_warning "Please ensure MongoDB is running, then run:"
            echo "  cd backend && node seeder.js -i"
        fi
    else
        print_info "Skipping database seeding"
    fi
    
    cd ..
    
    # Final instructions
    print_header "Setup Complete!"
    
    print_success "Installation completed successfully!"
    echo ""
    print_info "Next steps:"
    echo ""
    echo "1. Start MongoDB (if using local MongoDB):"
    echo "   ${GREEN}mongod${NC}"
    echo ""
    echo "2. Start the backend server (in a new terminal):"
    echo "   ${GREEN}cd backend${NC}"
    echo "   ${GREEN}npm run dev${NC}"
    echo ""
    echo "3. Start the frontend server (in another terminal):"
    echo "   ${GREEN}npm start${NC}"
    echo ""
    echo "4. Open your browser and navigate to:"
    echo "   ${GREEN}http://localhost:3000${NC}"
    echo ""
    print_info "Test Credentials:"
    echo "   Email: ${GREEN}aman@example.com${NC}"
    echo "   Password: ${GREEN}password${NC}"
    echo ""
    print_warning "Important Notes:"
    echo "   - Update backend/.env with your MongoDB URI if using Atlas"
    echo "   - Update Google OAuth credentials if you want to use Google login"
    echo "   - The Gemini API key is already configured for AI features"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main
