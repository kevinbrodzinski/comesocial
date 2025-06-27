#!/bin/bash

# 🧹 Pre-Migration Cleanup Script
# This script removes unused components and files before Supabase migration

set -e  # Exit on any error

echo "🧹 Starting Pre-Migration Cleanup..."
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

# Create backup branch
print_status "Creating backup branch..."
git checkout -b pre-migration-cleanup-backup 2>/dev/null || print_warning "Backup branch already exists or git not initialized"

# 1. Remove debug components
print_status "Removing debug components..."
if [ -d "src/components/debug" ]; then
    rm -rf src/components/debug/
    print_success "Removed src/components/debug/"
else
    print_warning "src/components/debug/ not found"
fi

if [ -d "src/components/dev" ]; then
    rm -rf src/components/dev/
    print_success "Removed src/components/dev/"
else
    print_warning "src/components/dev/ not found"
fi

# 2. Remove unused demo components
print_status "Removing unused demo components..."

# PlanViewDemo
if [ -f "src/components/PlanViewDemo.tsx" ]; then
    rm src/components/PlanViewDemo.tsx
    print_success "Removed src/components/PlanViewDemo.tsx"
else
    print_warning "src/components/PlanViewDemo.tsx not found"
fi

# PlanSelectorModal
if [ -f "src/components/PlanSelectorModal.tsx" ]; then
    rm src/components/PlanSelectorModal.tsx
    print_success "Removed src/components/PlanSelectorModal.tsx"
else
    print_warning "src/components/PlanSelectorModal.tsx not found"
fi

# StatusSelectorModal
if [ -f "src/components/plan/StatusSelectorModal.tsx" ]; then
    rm src/components/plan/StatusSelectorModal.tsx
    print_success "Removed src/components/plan/StatusSelectorModal.tsx"
else
    print_warning "src/components/plan/StatusSelectorModal.tsx not found"
fi

# 3. Check for WatchlistView usage
print_status "Checking WatchlistView usage..."
WATCHLIST_USAGE=$(grep -r "WatchlistView" src/ --exclude-dir=node_modules 2>/dev/null | wc -l)

if [ "$WATCHLIST_USAGE" -le 2 ]; then
    print_warning "WatchlistView appears to be unused. Consider removing:"
    print_warning "  - src/pages/WatchlistView.tsx"
    print_warning "  - src/hooks/useWatchlistData.tsx"
    print_warning "  - Update src/components/index/ActiveViewRenderer.tsx"
else
    print_status "WatchlistView is used in $WATCHLIST_USAGE places - keeping for now"
fi

# 4. Check for UI component usage
print_status "Checking UI component usage..."

# Check Sidebar usage
SIDEBAR_USAGE=$(grep -r "Sidebar" src/ --exclude-dir=node_modules 2>/dev/null | wc -l)
if [ "$SIDEBAR_USAGE" -le 5 ]; then
    print_warning "Sidebar component may be unused (found in $SIDEBAR_USAGE places)"
else
    print_status "Sidebar component is used in $SIDEBAR_USAGE places"
fi

# Check Chart usage
CHART_USAGE=$(grep -r "Chart" src/ --exclude-dir=node_modules 2>/dev/null | wc -l)
if [ "$CHART_USAGE" -le 5 ]; then
    print_warning "Chart component may be unused (found in $CHART_USAGE places)"
else
    print_status "Chart component is used in $CHART_USAGE places"
fi

# Check Carousel usage
CAROUSEL_USAGE=$(grep -r "Carousel" src/ --exclude-dir=node_modules 2>/dev/null | wc -l)
if [ "$CAROUSEL_USAGE" -le 5 ]; then
    print_warning "Carousel component may be unused (found in $CAROUSEL_USAGE places)"
else
    print_status "Carousel component is used in $CAROUSEL_USAGE places"
fi

# 5. Manual steps reminder
echo ""
print_warning "MANUAL STEPS REQUIRED:"
echo "=========================="
print_warning "1. Update src/pages/CoPlanDraftPage.tsx:"
print_warning "   - Remove: import UserSwitcher from '@/components/debug/UserSwitcher';"
print_warning "   - Remove: <UserSwitcher /> from JSX"
echo ""
print_warning "2. Review and remove WatchlistView if not used:"
print_warning "   - src/pages/WatchlistView.tsx"
print_warning "   - src/hooks/useWatchlistData.tsx"
print_warning "   - Update src/components/index/ActiveViewRenderer.tsx"
echo ""

# 6. Verification steps
print_status "Running verification steps..."

# Check TypeScript
print_status "Running TypeScript check..."
if command -v npx &> /dev/null; then
    if npx tsc --noEmit 2>/dev/null; then
        print_success "TypeScript check passed"
    else
        print_error "TypeScript check failed - review errors above"
    fi
else
    print_warning "npx not available - skipping TypeScript check"
fi

# Check ESLint
print_status "Running ESLint..."
if command -v npx &> /dev/null; then
    if npx eslint src/ --ext .ts,.tsx 2>/dev/null; then
        print_success "ESLint check passed"
    else
        print_warning "ESLint found issues - review warnings above"
    fi
else
    print_warning "npx not available - skipping ESLint check"
fi

# Check for unused imports
print_status "Checking for unused imports..."
if command -v npx &> /dev/null; then
    if npx unimported 2>/dev/null; then
        print_success "Unimported check completed"
    else
        print_warning "Unimported check failed or found unused imports"
    fi
else
    print_warning "npx not available - skipping unimported check"
fi

# 7. Summary
echo ""
print_success "Cleanup completed!"
echo "======================"
print_status "Next steps:"
print_status "1. Complete manual steps above"
print_status "2. Test your application"
print_status "3. Run: npm run build"
print_status "4. Run: npm run dev"
print_status "5. Verify all features still work"
print_status "6. Commit changes: git add . && git commit -m 'Pre-migration cleanup'"
echo ""
print_status "Ready for Supabase migration! 🚀" 