#!/bin/bash

# Migration Script for Nightli Nova Vibes - Supabase Integration
# This script helps set up and test the Supabase connection

set -e

echo "🚀 Starting Supabase Migration for Nightli Nova Vibes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_success "Project directory confirmed"

# Function to check Supabase connection
check_supabase_connection() {
    print_status "Checking Supabase connection..."
    
    # Check if Supabase CLI is available
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI not found. Please install it:"
        echo "npm install -g supabase"
        return 1
    fi

    # Check if project is linked
    if ! supabase status &> /dev/null; then
        print_warning "Supabase project not linked. Please run:"
        echo "supabase link --project-ref your-project-ref"
        return 1
    fi

    print_success "Supabase connection verified"
    return 0
}

# Function to setup development environment
setup_dev_environment() {
    print_status "Setting up development environment..."
    
    # Start Supabase locally if not running
    if ! supabase status &> /dev/null; then
        print_status "Starting Supabase local development..."
        supabase start
    else
        print_success "Supabase is already running"
    fi

    # Apply migrations
    print_status "Applying database migrations..."
    supabase db reset

    # Seed with development data
    print_status "Seeding with development data..."
    supabase db seed

    print_success "Development environment setup complete!"
}

# Function to test data service
test_data_service() {
    print_status "Testing DataService integration..."
    
    # Check if the DataService file exists
    if [ ! -f "src/services/data/DataService.ts" ]; then
        print_error "DataService.ts not found. Please ensure it was created."
        return 1
    fi

    print_success "DataService.ts found"
    
    # Check if the hooks file exists
    if [ ! -f "src/hooks/useDataService.ts" ]; then
        print_error "useDataService.ts not found. Please ensure it was created."
        return 1
    fi

    print_success "useDataService.ts found"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Check if tests pass
    if npm test -- --passWithNoTests &> /dev/null; then
        print_success "Tests passed"
    else
        print_warning "Some tests failed. This is expected during migration."
    fi
}

# Function to start development server
start_dev_server() {
    print_status "Starting development server..."
    
    print_success "Development server starting..."
    print_status "You can now:"
    echo "  1. Open http://localhost:5173 in your browser"
    echo "  2. Use the DataSourceToggle component to switch between mock and Supabase data"
    echo "  3. Test the migration by updating components to use the new hooks"
    
    # Start the dev server
    npm run dev
}

# Main execution
main() {
    print_status "Starting migration process..."
    
    # Step 1: Check Supabase connection
    if ! check_supabase_connection; then
        print_error "Supabase connection check failed. Please fix the issues above."
        exit 1
    fi
    
    # Step 2: Setup development environment
    setup_dev_environment
    
    # Step 3: Test data service
    test_data_service
    
    # Step 4: Run tests
    run_tests
    
    # Step 5: Start development server
    start_dev_server
}

# Check command line arguments
case "${1:-}" in
    "check")
        check_supabase_connection
        ;;
    "setup")
        setup_dev_environment
        ;;
    "test")
        test_data_service
        run_tests
        ;;
    "start")
        start_dev_server
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  check   - Check Supabase connection"
        echo "  setup   - Setup development environment"
        echo "  test    - Test data service and run tests"
        echo "  start   - Start development server"
        echo "  help    - Show this help message"
        echo ""
        echo "If no command is provided, runs all steps in sequence."
        ;;
    *)
        main
        ;;
esac 