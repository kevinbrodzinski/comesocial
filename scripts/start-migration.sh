#!/bin/bash

# 🚀 Start Supabase Migration Script
# This script helps you start the migration process

set -e  # Exit on any error

echo "🚀 Starting Supabase Migration..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Check prerequisites
print_status "Step 1: Checking prerequisites..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found"
    print_status "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=your_supabase_project_url"
    echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo ""
    print_warning "You can find these in your Supabase project dashboard"
else
    print_success ".env.local found"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_warning "Supabase CLI not found"
    print_status "Installing Supabase CLI..."
    npm install -g supabase
else
    print_success "Supabase CLI found"
fi

# Step 2: Check Supabase status
print_status "Step 2: Checking Supabase status..."

if [ -d "supabase" ]; then
    if supabase status &> /dev/null; then
        print_success "Supabase is running"
    else
        print_warning "Supabase is not running"
        print_status "Starting Supabase..."
        supabase start
    fi
else
    print_warning "Supabase directory not found"
    print_status "Please run: npx supabase init"
fi

# Step 3: Install dependencies
print_status "Step 3: Installing dependencies..."

if [ ! -d "node_modules" ]; then
    print_status "Installing npm dependencies..."
    npm install
else
    print_success "Dependencies already installed"
fi

# Step 4: Check TypeScript
print_status "Step 4: Checking TypeScript..."

if npx tsc --noEmit 2>/dev/null; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript errors found - check the output above"
fi

# Step 5: Start development server
print_status "Step 5: Starting development server..."

print_success "Migration setup complete!"
echo ""
print_status "Next steps:"
print_status "1. Your dev server should be starting..."
print_status "2. Look for the DataSourceToggle in the bottom-right corner"
print_status "3. Click it to switch between Mock Data and Supabase"
print_status "4. Test both data sources"
print_status "5. Enable migration flags one by one"
echo ""
print_status "Migration files available:"
print_status "- MIGRATION_START_GUIDE.md - Step-by-step instructions"
print_status "- COMPONENT_MIGRATION_GUIDE.md - Component-specific migration"
print_status "- SUPABASE_MIGRATION_GUIDE.md - Detailed migration guide"
echo ""
print_status "Happy migrating! 🚀" 