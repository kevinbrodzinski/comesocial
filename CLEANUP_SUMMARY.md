# 🧹 Pre-Migration Cleanup Summary

## ✅ **Successfully Removed**

### Debug/Development Components
- `src/components/debug/` - Entire directory removed
- `src/components/dev/` - Entire directory removed
- `src/components/PlanViewDemo.tsx` - Unused demo component
- `src/components/PlanSelectorModal.tsx` - Unused modal
- `src/components/plan/StatusSelectorModal.tsx` - Unused modal

### Manual Updates Completed
- ✅ Removed `UserSwitcher` import from `CoPlanDraftPage.tsx`
- ✅ Removed `<UserSwitcher />` JSX from `CoPlanDraftPage.tsx`
- ✅ Removed role testing panel from `CoPlanDraftPage.tsx`

## 📊 **Analysis Results**

### UI Components Usage
- **Sidebar**: Used in 93 places - ✅ Keep
- **Chart**: Used in 31 places - ✅ Keep  
- **Carousel**: Used in 62 places - ✅ Keep

### WatchlistView Status
- **WatchlistView**: Used in 4 places - ⚠️ Review needed
  - `src/pages/WatchlistView.tsx`
  - `src/hooks/useWatchlistData.tsx`
  - `src/components/index/ActiveViewRenderer.tsx`
  - One other reference

## 🚨 **Major Findings: 145 Unused Files**

The `unimported` tool found **145 unused files** in your codebase! This is a significant amount of dead code.

### Categories of Unused Files:

#### 1. **AI/ML Components** (7 files)
- `src/components/ai/ImageAnalysis.tsx`
- `src/components/ai/MultiModalNovaChat.tsx`
- `src/components/ai/ProactiveSuggestions.tsx`
- `src/components/ai/SystemMonitoringDashboard.tsx`
- `src/components/ai/VoiceInterface.tsx`
- Plus 2 more...

#### 2. **UI Components** (22 files)
- `src/components/ui/aspect-ratio.tsx`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/carousel.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/hover-card.tsx`
- `src/components/ui/input-otp.tsx`
- `src/components/ui/menubar.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/pagination.tsx`
- `src/components/ui/radio-group.tsx`
- `src/components/ui/resizable.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/components/ui/toggle.tsx`
- `src/components/ui/use-toast.ts`
- Plus 2 more...

#### 3. **Service Files** (45+ files)
- Multiple AI service files
- Intelligence/tracking services
- Nova service files
- Venue service files
- Real-time service files

#### 4. **Hook Files** (20+ files)
- Various custom hooks for AI, notifications, performance, etc.

#### 5. **Component Files** (40+ files)
- Various unused components across different features

## 📦 **Unused Dependencies** (22 packages)

These npm packages are installed but not used:
- `@hookform/resolvers`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-toggle`
- `@radix-ui/react-toggle-group`
- `@types/google.maps`
- `cmdk`
- `embla-carousel-react`
- `input-otp`
- `jsdom`
- `react-day-picker`
- `react-hook-form`
- `react-resizable-panels`
- `recharts`
- `tailwindcss-animate`
- `vaul`
- `vitest`
- `zod`

## 🎯 **Recommended Next Steps**

### 1. **Immediate Actions**
```bash
# Remove unused dependencies
npm uninstall @hookform/resolvers @radix-ui/react-aspect-ratio @radix-ui/react-context-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-radio-group @radix-ui/react-toggle @radix-ui/react-toggle-group @types/google.maps cmdk embla-carousel-react input-otp jsdom react-day-picker react-hook-form react-resizable-panels recharts tailwindcss-animate vaul vitest zod
```

### 2. **Review WatchlistView**
Decide if you want to keep or remove:
- `src/pages/WatchlistView.tsx`
- `src/hooks/useWatchlistData.tsx`
- Update `src/components/index/ActiveViewRenderer.tsx`

### 3. **Bulk Remove Unused Files**
Create a script to remove the 145 unused files:

```bash
# Create a script to remove unused files
cat > scripts/remove-unused-files.sh << 'EOF'
#!/bin/bash
# Remove unused files identified by unimported

# AI Components
rm -f src/components/ai/ImageAnalysis.tsx
rm -f src/components/ai/MultiModalNovaChat.tsx
rm -f src/components/ai/ProactiveSuggestions.tsx
rm -f src/components/ai/SystemMonitoringDashboard.tsx
rm -f src/components/ai/VoiceInterface.tsx

# UI Components (if you're sure they're unused)
rm -f src/components/ui/aspect-ratio.tsx
rm -f src/components/ui/breadcrumb.tsx
rm -f src/components/ui/calendar.tsx
rm -f src/components/ui/carousel.tsx
rm -f src/components/ui/chart.tsx
rm -f src/components/ui/command.tsx
rm -f src/components/ui/context-menu.tsx
rm -f src/components/ui/drawer.tsx
rm -f src/components/ui/form.tsx
rm -f src/components/ui/hover-card.tsx
rm -f src/components/ui/input-otp.tsx
rm -f src/components/ui/menubar.tsx
rm -f src/components/ui/navigation-menu.tsx
rm -f src/components/ui/pagination.tsx
rm -f src/components/ui/radio-group.tsx
rm -f src/components/ui/resizable.tsx
rm -f src/components/ui/sidebar.tsx
rm -f src/components/ui/table.tsx
rm -f src/components/ui/toggle-group.tsx
rm -f src/components/ui/toggle.tsx
rm -f src/components/ui/use-toast.ts

# Add more files as needed...
EOF

chmod +x scripts/remove-unused-files.sh
```

### 4. **Test Your Application**
```bash
npm run build
npm run dev
```

## 🚨 **Important Warnings**

1. **Be Cautious**: Some files might be dynamically imported or used in ways the tool can't detect
2. **Test Thoroughly**: After removing files, test all features
3. **Keep Backups**: You have a git backup branch
4. **Gradual Removal**: Remove files in batches and test between batches

## 📈 **Expected Benefits**

After removing unused files and dependencies:
- **Smaller bundle size** (potentially 20-30% reduction)
- **Faster build times**
- **Cleaner codebase**
- **Easier maintenance**
- **Better TypeScript performance**

## 🎯 **Migration Readiness**

Your codebase is now much cleaner and ready for Supabase migration! The cleanup removed:
- ✅ Debug/development components
- ✅ Unused demo components  
- ✅ Manual cleanup completed

**Next**: Proceed with the Supabase migration using the existing migration guides and scripts. 