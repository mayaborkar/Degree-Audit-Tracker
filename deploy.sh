#!/bin/bash

# Degree Tracker - Deployment Script for Vercel
# Run this script to prepare and deploy your application

echo "🎓 Degree Tracker - Vercel Deployment Script"
echo "=============================================="

# Check if we're in the correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Project directory confirmed"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing globally..."
    npm install -g vercel
    if [ $? -eq 0 ]; then
        echo "✅ Vercel CLI installed successfully"
    else
        echo "❌ Failed to install Vercel CLI"
        exit 1
    fi
else
    echo "✅ Vercel CLI found: $(vercel --version)"
fi

# Test the application locally (optional)
echo ""
read -p "🧪 Would you like to test the application locally first? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting local server on http://localhost:3000"
    echo "   Press Ctrl+C to stop and continue with deployment"
    npm run dev &
    SERVER_PID=$!
    
    # Wait for user to press Ctrl+C
    trap "kill $SERVER_PID 2>/dev/null" EXIT
    read -p "Press Enter when you're done testing..."
    kill $SERVER_PID 2>/dev/null
    echo "🛑 Local server stopped"
fi

# Deploy to Vercel
echo ""
read -p "🚀 Ready to deploy? Choose deployment type (p=production, d=preview, s=skip): " -n 1 -r
echo

case $REPLY in
    [Pp]* )
        echo "🌟 Deploying to production..."
        vercel --prod
        ;;
    [Dd]* )
        echo "🔍 Deploying to preview..."
        vercel
        ;;
    [Ss]* )
        echo "⏸️  Deployment skipped"
        ;;
    * )
        echo "🔍 Deploying to preview (default)..."
        vercel
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "   ✅ Check the deployed URL works correctly"
    echo "   ✅ Test all features (course adding, AI assistant, etc.)"
    echo "   ✅ Verify responsive design on mobile"
    echo "   ✅ Test theme switching (light/dark mode)"
    echo "   ✅ Ensure GPA calculations are accurate"
    echo ""
    echo "🔗 Manage your deployment:"
    echo "   • Vercel Dashboard: https://vercel.com/dashboard"
    echo "   • Project Settings: Configure domain, environment variables"
    echo "   • Analytics: Monitor usage and performance"
    echo ""
    echo "📈 Performance tips:"
    echo "   • Run Lighthouse audit on your deployed URL"
    echo "   • Monitor Core Web Vitals in Vercel Analytics"
    echo "   • Consider adding a custom domain for better branding"
else
    echo "❌ Deployment failed. Please check the errors above and try again."
    echo ""
    echo "🔧 Common solutions:"
    echo "   • Run 'vercel login' if authentication failed"
    echo "   • Check your internet connection"
    echo "   • Verify all files are committed to git (if using GitHub integration)"
    echo "   • Try 'vercel --debug' for detailed error information"
    exit 1
fi

echo ""
echo "🎓 Happy degree tracking!"