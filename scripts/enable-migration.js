#!/usr/bin/env node

// Simple script to enable migration flags in localStorage
// Run this in your browser console or use it to set flags

const MIGRATION_FLAGS = {
  FRIENDS_VIEW_MIGRATED: 'friends-view-migrated',
  PLANS_VIEW_MIGRATED: 'plans-view-migrated',
  VENUES_VIEW_MIGRATED: 'venues-view-migrated',
  FEED_VIEW_MIGRATED: 'feed-view-migrated',
  USE_SUPABASE_DATA: 'use-supabase-data',
  ENABLE_REAL_TIME: 'enable-real-time',
  SHOW_MIGRATION_TOGGLE: 'show-migration-toggle',
};

function enableMigrationFlag(flagName, value = true) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`migration-flag-${flagName}`, value.toString());
    console.log(`✅ Enabled migration flag: ${flagName} = ${value}`);
  } else {
    console.log(`Migration flag would be set: ${flagName} = ${value}`);
  }
}

function disableMigrationFlag(flagName) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`migration-flag-${flagName}`, 'false');
    console.log(`❌ Disabled migration flag: ${flagName}`);
  } else {
    console.log(`Migration flag would be disabled: ${flagName}`);
  }
}

function showCurrentFlags() {
  if (typeof window !== 'undefined') {
    console.log('Current migration flags:');
    Object.values(MIGRATION_FLAGS).forEach(flag => {
      const value = localStorage.getItem(`migration-flag-${flag}`);
      console.log(`  ${flag}: ${value || 'default'}`);
    });
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.enableMigrationFlag = enableMigrationFlag;
  window.disableMigrationFlag = disableMigrationFlag;
  window.showCurrentFlags = showCurrentFlags;
  window.MIGRATION_FLAGS = MIGRATION_FLAGS;
  
  console.log('🚀 Migration helper functions loaded!');
  console.log('Available functions:');
  console.log('  enableMigrationFlag(flagName, value)');
  console.log('  disableMigrationFlag(flagName)');
  console.log('  showCurrentFlags()');
  console.log('');
  console.log('Available flags:');
  Object.values(MIGRATION_FLAGS).forEach(flag => {
    console.log(`  - ${flag}`);
  });
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    enableMigrationFlag,
    disableMigrationFlag,
    showCurrentFlags,
    MIGRATION_FLAGS
  };
} 