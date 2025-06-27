# 🔄 Component Migration Guide - From Mock to Supabase

This guide explains the proper migration practices and requirements for successfully moving components from mock data to Supabase while maintaining your UX/UI.

## 📋 **Migration Requirements**

### **1. Data Layer Requirements**
- ✅ **DataService** - Configurable service for switching between mock and real data
- ✅ **React Query Hooks** - For data fetching, caching, and real-time updates
- ✅ **Error Handling** - Graceful fallbacks and user-friendly error states
- ✅ **Loading States** - Skeleton components that match your UI

### **2. Component Requirements**
- ✅ **Feature Flags** - For gradual rollout and easy rollback
- ✅ **Type Safety** - Maintain existing TypeScript interfaces
- ✅ **Performance** - Optimistic updates and proper caching
- ✅ **Testing** - Easy switching between data sources

## 🎯 **Migration Process: Step-by-Step**

### **Step 1: Analyze Current Component**

**Before Migration:**
```typescript
// Current: Direct mock data import
import { friendsData } from '@/data/friendsData';

const MyComponent = () => {
  const friends = friendsData; // Direct mock data
  return <div>{/* render friends */}</div>;
};
```

**Identify:**
- Data dependencies (what mock data is used)
- Component structure (how data flows through)
- User interactions (what actions modify data)
- Loading patterns (when data is accessed)

### **Step 2: Create Migrated Hook**

**Create a new hook that uses React Query:**
```typescript
// src/hooks/useMyDataMigrated.tsx
import { useQuery } from '@tanstack/react-query';
import { useMyData } from '@/hooks/useDataService';

export const useMyDataMigrated = () => {
  const { data, isLoading, error, refetch } = useMyData();
  
  return {
    data,
    isLoading,
    error,
    refetch,
    // Add any additional logic here
  };
};
```

**Key Requirements:**
- ✅ **Loading State** - `isLoading` boolean
- ✅ **Error State** - `error` object with retry capability
- ✅ **Data Fallback** - Default empty array/object
- ✅ **Refetch Function** - For manual retries

### **Step 3: Create Loading Component**

**Create a skeleton that matches your UI:**
```typescript
// src/components/MyComponentLoadingSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

const MyComponentLoadingSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
};
```

**Requirements:**
- ✅ **Same Layout** - Match the actual component structure
- ✅ **Realistic Placeholders** - Use appropriate skeleton sizes
- ✅ **Smooth Transitions** - Animate loading states
- ✅ **Accessibility** - Screen reader friendly

### **Step 4: Create Error Component**

**Create user-friendly error handling:**
```typescript
// src/components/MyComponentErrorState.tsx
import { Button } from '@/components/ui/button';

const MyComponentErrorState = ({ error, onRetry }) => {
  return (
    <div className="text-center p-4">
      <p>Unable to load data</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
};
```

**Requirements:**
- ✅ **Clear Message** - Explain what went wrong
- ✅ **Retry Action** - Allow users to try again
- ✅ **Fallback Options** - Alternative actions
- ✅ **Error Details** - For debugging (in development)

### **Step 5: Create Migrated Component**

**Create the migrated version with proper state handling:**
```typescript
// src/components/MyComponentMigrated.tsx
import { useMyDataMigrated } from '@/hooks/useMyDataMigrated';
import MyComponentLoadingSkeleton from './MyComponentLoadingSkeleton';
import MyComponentErrorState from './MyComponentErrorState';

const MyComponentMigrated = () => {
  const { data, isLoading, error, refetch } = useMyDataMigrated();

  // Handle loading state
  if (isLoading) {
    return <MyComponentLoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return <MyComponentErrorState error={error} onRetry={refetch} />;
  }

  // Render normal component
  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{/* render item */}</div>
      ))}
    </div>
  );
};
```

### **Step 6: Add Feature Flag**

**Create a feature flag for gradual rollout:**
```typescript
// src/utils/migrationFlags.ts
export const MIGRATION_FLAGS = {
  MY_COMPONENT_MIGRATED: 'my-component-migrated',
} as const;

export const shouldUseMigratedComponent = (flag: string): boolean => {
  // Check environment variable
  if (import.meta.env[`VITE_${flag.toUpperCase()}`]) {
    return import.meta.env[`VITE_${flag.toUpperCase()}`] === 'true';
  }
  
  // Check localStorage for development
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`migration-flag-${flag}`);
    if (stored !== null) {
      return stored === 'true';
    }
  }
  
  return false; // Default to old version
};
```

### **Step 7: Create Container with Feature Flag**

**Create a container that switches between versions:**
```typescript
// src/components/MyComponentContainer.tsx
import { shouldUseMigratedComponent, MIGRATION_FLAGS } from '@/utils/migrationFlags';
import MyComponent from './MyComponent'; // Original
import MyComponentMigrated from './MyComponentMigrated'; // New

const MyComponentContainer = () => {
  const useMigrated = shouldUseMigratedComponent(MIGRATION_FLAGS.MY_COMPONENT_MIGRATED);
  
  return useMigrated ? <MyComponentMigrated /> : <MyComponent />;
};
```

## 🔧 **Testing Your Migration**

### **Development Testing**
```bash
# Enable migrated version
localStorage.setItem('migration-flag-my-component-migrated', 'true');
window.location.reload();

# Disable migrated version
localStorage.setItem('migration-flag-my-component-migrated', 'false');
window.location.reload();
```

### **Environment Variables**
```bash
# .env.local
VITE_MY_COMPONENT_MIGRATED=true
VITE_USE_SUPABASE_DATA=true
VITE_ENABLE_REAL_TIME=true
```

## 📊 **Migration Checklist**

### **Before Migration**
- [ ] **Analyze component** - Understand data dependencies
- [ ] **Identify edge cases** - Empty states, errors, loading
- [ ] **Plan UI states** - Loading, error, success, empty
- [ ] **Test current behavior** - Document expected functionality

### **During Migration**
- [ ] **Create migrated hook** - Use React Query
- [ ] **Add loading skeleton** - Match existing UI
- [ ] **Add error handling** - User-friendly messages
- [ ] **Implement feature flag** - For gradual rollout
- [ ] **Test both versions** - Old and new should work

### **After Migration**
- [ ] **Test all scenarios** - Loading, error, success, empty
- [ ] **Verify performance** - No regression in speed
- [ ] **Check accessibility** - Screen readers, keyboard nav
- [ ] **Test real-time** - If applicable
- [ ] **Monitor errors** - Track any issues

## 🚨 **Common Migration Issues**

### **1. Data Structure Mismatch**
**Problem:** Supabase data doesn't match mock data structure
```typescript
// Solution: Transform data in the hook
const { data: rawData } = useQuery({...});
const transformedData = useMemo(() => 
  rawData?.map(item => ({
    id: item.id,
    name: item.full_name, // Transform field names
    // ... other transformations
  })), [rawData]
);
```

### **2. Loading State Flicker**
**Problem:** Component shows loading briefly even with cached data
```typescript
// Solution: Use proper stale time
const { data, isLoading } = useQuery({
  queryKey: ['my-data'],
  queryFn: fetchMyData,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
});
```

### **3. Error State Not Showing**
**Problem:** Errors are swallowed or not handled properly
```typescript
// Solution: Explicit error handling
const { data, error, isError } = useQuery({...});

if (isError) {
  return <ErrorComponent error={error} onRetry={refetch} />;
}
```

### **4. Real-time Not Working**
**Problem:** Subscriptions not updating UI
```typescript
// Solution: Use React Query's real-time features
const { data } = useQuery({
  queryKey: ['my-data'],
  queryFn: fetchMyData,
});

// Set up subscription
useEffect(() => {
  const subscription = supabase
    .channel('my-data')
    .on('postgres_changes', {...}, () => {
      queryClient.invalidateQueries(['my-data']);
    })
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

## 🎯 **Best Practices**

### **1. Gradual Rollout**
- Start with 10% of users
- Monitor error rates and performance
- Gradually increase to 100%
- Keep rollback plan ready

### **2. Error Handling**
- Always provide retry functionality
- Show user-friendly error messages
- Log errors for debugging
- Have fallback data when possible

### **3. Performance**
- Use proper caching strategies
- Implement optimistic updates
- Avoid unnecessary re-renders
- Monitor bundle size impact

### **4. Testing**
- Test both old and new versions
- Test all data states (loading, error, empty, success)
- Test real-time updates
- Test error scenarios

### **5. Monitoring**
- Track error rates
- Monitor performance metrics
- Watch user engagement
- Alert on critical issues

## 🔄 **Rollback Strategy**

### **Quick Rollback**
```bash
# Disable migrated component
localStorage.setItem('migration-flag-my-component-migrated', 'false');
window.location.reload();
```

### **Production Rollback**
```bash
# Set environment variable
VITE_MY_COMPONENT_MIGRATED=false
```

### **Database Rollback**
```bash
# If needed, revert database changes
supabase db reset
```

## 📈 **Success Metrics**

### **Technical Metrics**
- **Error Rate**: < 1% for migrated components
- **Loading Time**: < 200ms for cached data
- **Real-time Latency**: < 500ms for updates
- **Bundle Size**: No significant increase

### **User Experience Metrics**
- **Page Load Time**: Maintain or improve
- **User Engagement**: No decrease in usage
- **Error Reports**: Fewer user-reported issues
- **Feature Adoption**: Track usage of new features

---

## 🎉 **Next Steps**

1. **Choose a component** to migrate first (recommend: FriendsView)
2. **Follow the step-by-step process** outlined above
3. **Test thoroughly** with the feature flag system
4. **Monitor performance** and error rates
5. **Gradually roll out** to more users
6. **Repeat** for other components

This migration approach ensures you maintain your excellent UX/UI while gaining the benefits of real database functionality and real-time features. 