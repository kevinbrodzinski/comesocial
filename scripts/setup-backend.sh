#!/bin/bash

# Backend Setup Script for Nightli Nova Vibes
# This script sets up the Supabase backend with migrations and seed data

set -e  # Exit on any error

echo "🚀 Setting up Nightli Nova Vibes Backend..."

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

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    echo "or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

print_success "Supabase CLI found"

# Check if we're in the project directory
if [ ! -f "supabase/config.toml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_success "Project directory confirmed"

# Function to setup development environment
setup_dev() {
    print_status "Setting up development environment..."
    
    # Start Supabase locally
    print_status "Starting Supabase local development..."
    supabase start
    
    # Apply migrations
    print_status "Applying database migrations..."
    supabase db reset
    
    # Seed with development data
    print_status "Seeding with development data..."
    supabase db seed
    
    print_success "Development environment setup complete!"
    print_status "Local Supabase is running at:"
    echo "  Dashboard: http://localhost:54323"
    echo "  API: http://localhost:54321"
    echo "  Database: postgresql://postgres:postgres@localhost:54322/postgres"
}

# Function to setup production environment
setup_production() {
    print_status "Setting up production environment..."
    
    # Check if production URL is provided
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
        print_error "Production environment variables not set."
        echo "Please set:"
        echo "  SUPABASE_URL=your_supabase_project_url"
        echo "  SUPABASE_ANON_KEY=your_supabase_anon_key"
        exit 1
    fi
    
    # Apply migrations to production
    print_status "Applying migrations to production..."
    supabase db push
    
    # Seed with production data
    print_status "Seeding with production data..."
    supabase db seed --file supabase/seed-production.sql
    
    print_success "Production environment setup complete!"
}

# Function to reset development environment
reset_dev() {
    print_warning "This will reset your local development database. All data will be lost!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting development environment..."
        supabase db reset
        print_success "Development environment reset complete!"
    else
        print_status "Reset cancelled"
    fi
}

# Function to show status
show_status() {
    print_status "Checking Supabase status..."
    supabase status
}

# Function to show help
show_help() {
    echo "Nightli Nova Vibes Backend Setup Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Setup development environment (default)"
    echo "  prod        Setup production environment"
    echo "  reset       Reset development environment"
    echo "  status      Show Supabase status"
    echo "  help        Show this help message"
    echo ""
    echo "Environment Variables for Production:"
    echo "  SUPABASE_URL       Your Supabase project URL"
    echo "  SUPABASE_ANON_KEY  Your Supabase anonymous key"
    echo ""
    echo "Examples:"
    echo "  $0 dev                    # Setup development"
    echo "  $0 prod                   # Setup production"
    echo "  SUPABASE_URL=... $0 prod  # Setup production with env vars"
}

# Main script logic
case "${1:-dev}" in
    "dev")
        setup_dev
        ;;
    "prod")
        setup_production
        ;;
    "reset")
        reset_dev
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

print_success "Backend setup script completed successfully! 🎉" 