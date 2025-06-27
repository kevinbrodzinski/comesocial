#!/bin/bash

# 🧹 Remove Unused Dependencies Script
# This script removes npm packages that are not used in the codebase

set -e  # Exit on any error

echo "🧹 Removing Unused Dependencies..."
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

# List of unused dependencies identified by unimported
UNUSED_DEPENDENCIES=(
    "@hookform/resolvers"
    "@radix-ui/react-aspect-ratio"
    "@radix-ui/react-context-menu"
    "@radix-ui/react-hover-card"
    "@radix-ui/react-menubar"
    "@radix-ui/react-navigation-menu"
    "@radix-ui/react-radio-group"
    "@radix-ui/react-toggle"
    "@radix-ui/react-toggle-group"
    "@types/google.maps"
    "cmdk"
    "embla-carousel-react"
    "input-otp"
    "jsdom"
    "react-day-picker"
    "react-hook-form"
    "react-resizable-panels"
    "recharts"
    "tailwindcss-animate"
    "vaul"
    "vitest"
    "zod"
)

print_status "Found ${#UNUSED_DEPENDENCIES[@]} unused dependencies"

# Check which packages are actually installed
INSTALLED_PACKAGES=()
for package in "${UNUSED_DEPENDENCIES[@]}"; do
    if npm list "$package" --depth=0 >/dev/null 2>&1; then
        INSTALLED_PACKAGES+=("$package")
    else
        print_warning "Package $package not found in node_modules"
    fi
done

if [ ${#INSTALLED_PACKAGES[@]} -eq 0 ]; then
    print_warning "No unused dependencies found to remove"
    exit 0
fi

print_status "Removing ${#INSTALLED_PACKAGES[@]} unused dependencies..."

# Remove packages in batches to avoid npm issues
BATCH_SIZE=5
for ((i=0; i<${#INSTALLED_PACKAGES[@]}; i+=BATCH_SIZE)); do
    batch=("${INSTALLED_PACKAGES[@]:i:BATCH_SIZE}")
    print_status "Removing batch $((i/BATCH_SIZE + 1)): ${batch[*]}"
    
    if npm uninstall "${batch[@]}"; then
        print_success "Successfully removed: ${batch[*]}"
    else
        print_error "Failed to remove: ${batch[*]}"
    fi
done

# Clean up
print_status "Cleaning up..."
npm cache clean --force

# Update lock file
print_status "Updating package-lock.json..."
npm install

print_success "Dependency cleanup completed!"
echo "=================================="
print_status "Removed ${#INSTALLED_PACKAGES[@]} unused dependencies"
print_status "Next steps:"
print_status "1. Test your application: npm run dev"
print_status "2. Run build: npm run build"
print_status "3. Verify all features still work"
print_status "4. Commit changes: git add . && git commit -m 'Remove unused dependencies'"

echo ""
print_status "Ready for next cleanup step! 🚀" 