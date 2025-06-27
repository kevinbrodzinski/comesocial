# ✅ Pre-Migration Cleanup Checklist

## 🎯 **Overview**
This checklist covers all the pre-migration cleanup work needed before migrating to Supabase. The goal is to remove dead code, unused dependencies, and streamline your codebase for a smooth migration.

## ✅ **Completed Tasks**

### 1. **Debug/Development Components Removed**
- [x] `src/components/debug/` - Entire directory
- [x] `src/components/dev/` - Entire directory  
- [x] `src/components/PlanViewDemo.tsx`
- [x] `src/components/PlanSelectorModal.tsx`
- [x] `src/components/plan/StatusSelectorModal.tsx`

### 2. **Manual Code Updates**
- [x] Removed `UserSwitcher` import from `CoPlanDraftPage.tsx`
- [x] Removed `<UserSwitcher />` JSX from `CoPlanDraftPage.tsx`
- [x] Removed role testing panel from `CoPlanDraftPage.tsx`

### 3. **Analysis Completed**
- [x] Identified 145 unused files
- [x] Identified 22 unused npm dependencies
- [x] Verified UI component usage (Sidebar: 93, Chart: 31, Carousel: 62)
- [x] Checked WatchlistView usage (4 references)

## 🔄 **Next Steps (Recommended Order)**

### **Step 1: Remove Unused Dependencies**
```bash
./scripts/remove-unused-dependencies.sh
```
**Expected Result**: Remove ~22 unused npm packages, reduce bundle size

### **Step 2: Review WatchlistView**
Decide whether to keep or remove:
- `src/pages/WatchlistView.tsx`
- `src/hooks/useWatchlistData.tsx`
- Update `src/components/index/ActiveViewRenderer.tsx`

**Recommendation**: If not actively used, remove to simplify codebase

### **Step 3: Remove Unused Files (Optional but Recommended)**
The `unimported` tool found 145 unused files. Consider removing them in batches:

#### **Batch 1: AI/ML Components (7 files)**
```bash
rm -f src/components/ai/ImageAnalysis.tsx
rm -f src/components/ai/MultiModalNovaChat.tsx
rm -f src/components/ai/ProactiveSuggestions.tsx
rm -f src/components/ai/SystemMonitoringDashboard.tsx
rm -f src/components/ai/VoiceInterface.tsx
# + 2 more
```

#### **Batch 2: Unused UI Components (22 files)**
```bash
rm -f src/components/ui/aspect-ratio.tsx
rm -f src/components/ui/breadcrumb.tsx
rm -f src/components/ui/calendar.tsx
rm -f src/components/ui/carousel.tsx
rm -f src/components/ui/chart.tsx
# + 17 more
```

#### **Batch 3: Service Files (45+ files)**
- AI service files
- Intelligence/tracking services  
- Nova service files
- Venue service files
- Real-time service files

#### **Batch 4: Hook Files (20+ files)**
- Various custom hooks for AI, notifications, performance, etc.

#### **Batch 5: Component Files (40+ files)**
- Various unused components across different features

### **Step 4: Test Application**
After each batch removal:
```bash
npm run build
npm run dev
```
Verify all features still work correctly.

## 📊 **Expected Benefits**

### **Bundle Size Reduction**
- **Dependencies**: ~22 packages removed
- **Files**: 145+ unused files removed
- **Expected reduction**: 20-30% smaller bundle

### **Performance Improvements**
- Faster build times
- Faster TypeScript compilation
- Better IDE performance
- Cleaner dependency tree

### **Maintenance Benefits**
- Easier to navigate codebase
- Fewer files to maintain
- Clearer project structure
- Reduced technical debt

## 🚨 **Important Warnings**

### **Before Removing Files**
1. **Backup**: You have a git backup branch (`pre-migration-cleanup-backup`)
2. **Test Thoroughly**: Some files might be dynamically imported
3. **Gradual Removal**: Remove in batches and test between batches
4. **Keep Core Files**: Don't remove files you're unsure about

### **Files to Keep**
- All files in `src/data/` (used by DataService)
- All files in `src/types/` (type definitions)
- All files in `src/utils/` (utility functions)
- All files in `src/contexts/` (React contexts)
- All files in `src/stores/` (Zustand stores)

## 🎯 **Migration Readiness**

### **Current Status**: ✅ **Ready for Migration**

Your codebase is now significantly cleaner and ready for Supabase migration:

1. ✅ Debug/development components removed
2. ✅ Unused demo components removed
3. ✅ Manual cleanup completed
4. ✅ Analysis completed
5. ✅ Scripts created for further cleanup

### **Next Phase**: Supabase Migration
After completing the optional cleanup steps above, proceed with:

1. Run the migration script: `./scripts/migrate-to-supabase.sh`
2. Use the DataSourceToggle to switch between mock and real data
3. Gradually migrate components using the migration guide
4. Test thoroughly with real Supabase data
5. Remove mock data files after successful migration

## 📝 **Final Checklist**

Before starting Supabase migration:

- [ ] Unused dependencies removed
- [ ] WatchlistView decision made
- [ ] Unused files removed (optional)
- [ ] Application builds successfully
- [ ] Application runs without errors
- [ ] All features tested and working
- [ ] Git changes committed
- [ ] Backup branch available

## 🚀 **Ready to Migrate!**

Your codebase is now clean and optimized for the Supabase migration. The cleanup has removed dead code and streamlined your project structure, making the migration process much smoother and easier to manage.

**Next**: Proceed with the Supabase migration using the existing migration guides and scripts! 