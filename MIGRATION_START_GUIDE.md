# 🚀 **Starting Your Supabase Migration**

## 🎯 **Overview**
This guide will walk you through starting the migration from mock data to Supabase. We'll do this step-by-step to ensure everything works correctly.

## ✅ **Prerequisites Check**

Before starting, make sure you have:

- [x] ✅ Supabase project set up
- [x] ✅ Database schema migrated (from `supabase/migrations/`)
- [x] ✅ Environment variables configured
- [x] ✅ Supabase client configured (`src/integrations/supabase/client.ts`)
- [x] ✅ DataService created (`src/services/data/DataService.ts`)
- [x] ✅ React Query hooks created (`src/hooks/useDataService.ts`)
- [x] ✅ DataSourceToggle component ready
- [x] ✅ Pre-migration cleanup completed

## 🚀 **Step 1: Test Your Current Setup**

### **1.1 Start the Development Server**
```bash
npm run dev
```

### **1.2 Verify DataSourceToggle is Visible**
You should see a small toggle in the bottom-right corner of your app that shows:
- Current data source (Mock Data or Supabase)
- Connection status
- Toggle button to switch between sources

### **1.3 Test Mock Data Mode**
- Make sure your app works with mock data
- Navigate through different features
- Verify all components load correctly

## 🚀 **Step 2: Configure Supabase Connection**

### **2.1 Check Environment Variables**
Make sure your `.env.local` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **2.2 Verify Supabase Client**
Check that `src/integrations/supabase/client.ts` is properly configured:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🚀 **Step 3: Test Supabase Connection**

### **3.1 Switch to Supabase Mode**
1. Click the DataSourceToggle in the bottom-right corner
2. Click "Switch to Supabase"
3. The app should reload and show "Connected" status

### **3.2 Check for Errors**
- Open browser console (F12)
- Look for any connection errors
- Verify data is loading from Supabase

### **3.3 Test Basic Data Loading**
- Check if friends data loads
- Check if plans data loads
- Check if venues data loads

## 🚀 **Step 4: Start Component Migration**

### **4.1 Choose Your First Component**
Start with a simple component that's easy to test. Recommended order:

1. **FriendsView** (already has migration files)
2. **PlansView** 
3. **VenuesView**
4. **FeedView**

### **4.2 Example: Migrate FriendsView**

#### **Step 4.2.1: Enable Migration Flag**
```typescript
// In src/utils/migrationFlags.ts
export const MIGRATION_FLAGS = {
  friends_view_migrated: true, // Enable this
  plans_view_migrated: false,
  venues_view_migrated: false,
  feed_view_migrated: false,
} as const;
```

#### **Step 4.2.2: Use Migrated Component**
The FriendsView should automatically use the migrated version when the flag is enabled.

#### **Step 4.2.3: Test Both Data Sources**
1. Switch to Mock Data - verify it works
2. Switch to Supabase - verify it works
3. Check for any differences in behavior

## 🚀 **Step 5: Monitor and Debug**

### **5.1 Check React Query DevTools**
If you have React Query DevTools installed, you can see:
- Query states
- Cache data
- Loading states
- Error states

### **5.2 Monitor Network Requests**
- Open browser DevTools → Network tab
- Switch between data sources
- Verify Supabase requests are being made

### **5.3 Check Console Logs**
The DataService should log which data source it's using:
```
[DataService] Using mock data
[DataService] Using Supabase data
```

## 🚀 **Step 6: Gradual Rollout**

### **6.1 Enable One Component at a Time**
```typescript
// Enable flags one by one
export const MIGRATION_FLAGS = {
  friends_view_migrated: true,    // ✅ Done
  plans_view_migrated: true,      // ✅ Next
  venues_view_migrated: false,    // ⏳ Later
  feed_view_migrated: false,      // ⏳ Later
} as const;
```

### **6.2 Test Each Component**
For each component you migrate:
1. Enable the migration flag
2. Test with mock data
3. Test with Supabase data
4. Fix any issues
5. Move to next component

## 🚀 **Step 7: Common Issues and Solutions**

### **7.1 Supabase Connection Issues**
```bash
# Check if Supabase is running
npx supabase status

# Restart Supabase if needed
npx supabase stop
npx supabase start
```

### **7.2 Environment Variable Issues**
```bash
# Check if env vars are loaded
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### **7.3 Data Loading Issues**
- Check Supabase dashboard for data
- Verify table permissions
- Check RLS (Row Level Security) policies

### **7.4 TypeScript Errors**
```bash
# Check for TypeScript errors
npx tsc --noEmit
```

## 🚀 **Step 8: Production Considerations**

### **8.1 Remove DataSourceToggle**
Before deploying to production:
```typescript
// In App.tsx, remove or conditionally show DataSourceToggle
{process.env.NODE_ENV === 'development' && <DataSourceToggle />}
```

### **8.2 Set Production Data Source**
```typescript
// In DataService, default to Supabase in production
const defaultConfig = {
  useMockData: process.env.NODE_ENV === 'development',
  enableRealTime: true,
};
```

### **8.3 Environment Variables**
Make sure production environment has:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🎯 **Next Steps**

Once you've successfully started the migration:

1. **Continue Component Migration**: Migrate remaining components
2. **Add Real-time Features**: Enable Supabase real-time subscriptions
3. **Optimize Performance**: Add caching and optimization
4. **Remove Mock Data**: Clean up mock data files
5. **Add Error Handling**: Improve error states and fallbacks

## 📞 **Need Help?**

If you encounter issues:

1. **Check the console** for error messages
2. **Verify Supabase connection** in the dashboard
3. **Test with mock data** to isolate issues
4. **Check the migration guides** for specific component instructions

---

**Ready to start?** Run `npm run dev` and click the DataSourceToggle to begin your migration! 🚀 