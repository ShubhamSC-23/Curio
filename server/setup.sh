#!/bin/bash

echo "========================================="
echo "Article Publishing Platform - Backend Setup"
echo "========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ NPM version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📦 Installing additional packages..."
npm install dotenv express-validator helmet express-rate-limit morgan cookie-parser slugify uuid nodemailer compression

echo ""
echo "📦 Installing development dependencies..."
npm install --save-dev nodemon

echo ""
echo "✓ All packages installed successfully!"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created. Please update it with your configuration!"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "========================================="
echo "✅ Backend setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Make sure MySQL is running and database is created"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "For more information, see README.md"
echo ""
