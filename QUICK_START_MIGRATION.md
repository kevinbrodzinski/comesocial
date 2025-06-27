# 🚀 **Quick Start Migration Guide**

## 🎯 **You're Ready to Start!**

Your Supabase migration is set up and ready to go. Here's how to start right now:

## ✅ **Step 1: Check Your App**

1. **Open your browser** and go to `http://localhost:8080/`
2. **Look for the DataSourceToggle** - You should see a small panel in the bottom-right corner
3. **If you don't see it**, check the browser console (F12) for any errors

## 🎯 **Step 2: Test the DataSourceToggle**

1. **Click the DataSourceToggle** in the bottom-right corner
2. **Click "Switch to Supabase"** - The app should reload
3. **Check the status** - It should show "Connected" if working

## 🚀 **Step 3: Enable Your First Migration**

### **Option A: Using Browser Console (Easiest)**

1. **Open browser console** (F12 → Console tab)
2. **Copy and paste this code**:

```javascript
// Enable FriendsView migration
localStorage.setItem('migration-flag-friends-view-migrated', 'true');

// Enable Supabase data
localStorage.setItem('migration-flag-use-supabase-data', 'true');

// Reload the page
window.location.reload();
```

### **Option B: Manual Steps**

1. **Open browser console** (F12)
2. **Run these commands one by one**:

```javascript
// Check current flags
localStorage.getItem('migration-flag-friends-view-migrated')

// Enable FriendsView migration
localStorage.setItem('migration-flag-friends-view-migrated', 'true')

// Enable Supabase data
localStorage.setItem('migration-flag-use-supabase-data', 'true')

// Reload to apply changes
window.location.reload()
```

## 🎯 **Step 4: Test the Migration**

1. **Navigate to the Friends section** in your app
2. **Check if data loads** - You should see your Supabase data
3. **Switch back to Mock Data** using the DataSourceToggle
4. **Verify both work** - Mock data and Supabase data should both load

## 🔧 **Step 5: Troubleshooting**

### **If DataSourceToggle isn't visible:**
```javascript
// Force show the toggle
localStorage.setItem('migration-flag-show-migration-toggle', 'true');
window.location.reload();
```

### **If you get errors:**
1. **Check browser console** for error messages
2. **Verify Supabase connection** - Check if your project is active
3. **Test with mock data first** - Make sure the app works normally

### **If data doesn't load:**
```javascript
// Check what data source is being used
console.log('Data source:', localStorage.getItem('migration-flag-use-supabase-data'));

// Check if FriendsView migration is enabled
console.log('FriendsView migrated:', localStorage.getItem('migration-flag-friends-view-migrated'));
```

## 🎯 **Step 6: Continue Migration**

Once FriendsView is working:

1. **Enable PlansView migration**:
```javascript
localStorage.setItem('migration-flag-plans-view-migrated', 'true');
window.location.reload();
```

2. **Enable VenuesView migration**:
```javascript
localStorage.setItem('migration-flag-venues-view-migrated', 'true');
window.location.reload();
```

3. **Enable FeedView migration**:
```javascript
localStorage.setItem('migration-flag-feed-view-migrated', 'true');
window.location.reload();
```

## 📊 **Monitor Your Migration**

### **Check Migration Status:**
```javascript
// Show all current flags
Object.keys(localStorage)
  .filter(key => key.startsWith('migration-flag-'))
  .forEach(key => console.log(key, ':', localStorage.getItem(key)));
```

### **Reset All Flags:**
```javascript
// Reset to default (mock data)
Object.keys(localStorage)
  .filter(key => key.startsWith('migration-flag-'))
  .forEach(key => localStorage.removeItem(key));
window.location.reload();
```

## 🎉 **You're Migrating!**

Congratulations! You've started your Supabase migration. The process is:

- ✅ **Safe** - You can switch back to mock data anytime
- ✅ **Gradual** - Migrate one component at a time
- ✅ **Testable** - Test both data sources easily
- ✅ **Reversible** - Disable flags to rollback

## 🚀 **Next Steps**

1. **Test thoroughly** with both data sources
2. **Migrate remaining components** one by one
3. **Add real-time features** when ready
4. **Remove mock data** after successful migration
5. **Deploy to production** with Supabase data

---

**Ready to start?** Open your browser console and run the migration commands above! 🚀 