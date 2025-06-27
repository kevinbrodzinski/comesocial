# 🧹 Pre-Migration Cleanup Guide

## Overview
This guide helps you clean up dead code, unused components, and redundant files before migrating to Supabase. This will make your migration cleaner and easier to manage.

## 🎯 **Cleanup Categories**

### 1. **Debug/Development Components** (Safe to Remove)
These components are only used for development and debugging:

#### ✅ **Safe to Delete:**
- `src/components/debug/UserSwitcher.tsx` - Only used in CoPlanDraftPage for testing
- `src/components/dev/BackendVerificationPanel.tsx` - Only used by UserSwitcher
- `src/components/dev/DataSourceToggle.tsx` - Will be replaced by migration system

#### 🔧 **Action Required:**
```bash
# Remove debug components
rm -rf src/components/debug/
rm -rf src/components/dev/

# Update CoPlanDraftPage.tsx to remove UserSwitcher import and usage
```

### 2. **Unused Demo/Preview Components**
These components appear to be unused or replaced:

#### ✅ **Safe to Delete:**
- `src/components/PlanViewDemo.tsx` - No imports found
- `src/components/PlanSelectorModal.tsx` - No imports found
- `src/components/plan/StatusSelectorModal.tsx` - No imports found

#### 🔧 **Action Required:**
```bash
rm src/components/PlanViewDemo.tsx
rm src/components/PlanSelectorModal.tsx
rm src/components/plan/StatusSelectorModal.tsx
```

### 3. **Redundant Data Files**
After migration, these mock data files will be replaced by Supabase:

#### ⚠️ **Keep for Now (Used by DataService):**
- `src/data/friendsData.ts` - Still used by DataService
- `src/data/plansData.ts` - Still used by DataService  
- `src/data/venuesData.ts` - Still used by DataService
- `src/data/feedData.ts` - Still used by DataService
- `src/data/enhancedFeedData.ts` - Still used by DataService

#### ✅ **Safe to Delete After Migration:**
- `src/data/sampleData.ts` - Only used by CoPlanService and CoPlanDraftPage

### 4. **Unused Hooks and Services**
These appear to be unused or replaced:

#### ✅ **Safe to Delete:**
- `src/hooks/useWatchlistData.tsx` - Only used by WatchlistView and useGroupWatchlist
- `src/pages/WatchlistView.tsx` - Only used by ActiveViewRenderer

#### ⚠️ **Review Before Deleting:**
- Check if WatchlistView is actually used in your app navigation
- If not used, remove both the hook and the page

### 5. **Unused UI Components**
These UI components may be unused:

#### 🔍 **Need Investigation:**
- Check if these are used in your app:
  - `src/components/ui/sidebar.tsx` - Large component, check usage
  - `src/components/ui/chart.tsx` - Check if charts are used
  - `src/components/ui/carousel.tsx` - Check if carousels are used

## 🛠️ **Cleanup Script**

Create and run this cleanup script:

```bash
#!/bin/bash
# pre-migration-cleanup.sh

echo "🧹 Starting Pre-Migration Cleanup..."

# 1. Remove debug components
echo "Removing debug components..."
rm -rf src/components/debug/
rm -rf src/components/dev/

# 2. Remove unused demo components
echo "Removing unused demo components..."
rm -f src/components/PlanViewDemo.tsx
rm -f src/components/PlanSelectorModal.tsx
rm -f src/components/plan/StatusSelectorModal.tsx

# 3. Update CoPlanDraftPage to remove UserSwitcher
echo "Updating CoPlanDraftPage.tsx..."
# (Manual edit required - remove UserSwitcher import and usage)

# 4. Check for unused imports
echo "Checking for unused imports..."
npx unimported --init

echo "✅ Cleanup complete!"
```

## 📋 **Manual Steps Required**

### 1. **Update CoPlanDraftPage.tsx**
Remove these lines:
```typescript
// Remove this import
import UserSwitcher from '@/components/debug/UserSwitcher';

// Remove this JSX
<UserSwitcher />
```

### 2. **Check WatchlistView Usage**
Verify if `WatchlistView` is actually used in your app:
```bash
grep -r "WatchlistView" src/ --exclude-dir=node_modules
```

If not used, remove:
- `src/pages/WatchlistView.tsx`
- `src/hooks/useWatchlistData.tsx`
- Update `src/components/index/ActiveViewRenderer.tsx`

### 3. **Check UI Component Usage**
Run these commands to check usage:
```bash
# Check sidebar usage
grep -r "Sidebar" src/ --exclude-dir=node_modules

# Check chart usage  
grep -r "Chart" src/ --exclude-dir=node_modules

# Check carousel usage
grep -r "Carousel" src/ --exclude-dir=node_modules
```

## 🔍 **Verification Steps**

### 1. **Run TypeScript Check**
```bash
npm run type-check
# or
npx tsc --noEmit
```

### 2. **Run ESLint**
```bash
npm run lint
```

### 3. **Test Build**
```bash
npm run build
```

### 4. **Check for Unused Imports**
```bash
npx unimported
```

## 📊 **Expected Results**

After cleanup, you should see:
- ✅ Reduced bundle size
- ✅ Fewer TypeScript errors
- ✅ Cleaner import statements
- ✅ Easier migration process

## 🚨 **Important Notes**

1. **Backup First**: Create a git branch before cleanup
2. **Test Thoroughly**: Run your app after each cleanup step
3. **Keep Mock Data**: Don't remove mock data files until migration is complete
4. **Gradual Removal**: Remove components one category at a time

## 📝 **Post-Cleanup Checklist**

- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings resolved  
- [ ] App builds successfully
- [ ] App runs without errors
- [ ] No console errors in browser
- [ ] All features still work
- [ ] Git commit with cleanup changes

## 🎯 **Next Steps**

After cleanup:
1. Run the migration script
2. Test with DataSourceToggle
3. Gradually migrate components
4. Remove mock data files
5. Clean up migration flags

---

**Remember**: This cleanup will make your Supabase migration much smoother and easier to manage! 