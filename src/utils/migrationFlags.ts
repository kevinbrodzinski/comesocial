// Migration feature flags for gradual rollout
export const MIGRATION_FLAGS = {
  // Component-specific flags
  FRIENDS_VIEW_MIGRATED: 'friends-view-migrated',
  PLANS_VIEW_MIGRATED: 'plans-view-migrated',
  VENUES_VIEW_MIGRATED: 'venues-view-migrated',
  FEED_VIEW_MIGRATED: 'feed-view-migrated',
  
  // Feature flags
  USE_SUPABASE_DATA: 'use-supabase-data',
  ENABLE_REAL_TIME: 'enable-real-time',
  SHOW_MIGRATION_TOGGLE: 'show-migration-toggle',
} as const;

export type MigrationFlag = typeof MIGRATION_FLAGS[keyof typeof MIGRATION_FLAGS];

// Get migration flag value
export const getMigrationFlag = (flag: MigrationFlag): boolean => {
  // Check environment variables first
  const envFlags: Record<MigrationFlag, string> = {
    [MIGRATION_FLAGS.FRIENDS_VIEW_MIGRATED]: 'VITE_FRIENDS_VIEW_MIGRATED',
    [MIGRATION_FLAGS.PLANS_VIEW_MIGRATED]: 'VITE_PLANS_VIEW_MIGRATED',
    [MIGRATION_FLAGS.VENUES_VIEW_MIGRATED]: 'VITE_VENUES_VIEW_MIGRATED',
    [MIGRATION_FLAGS.FEED_VIEW_MIGRATED]: 'VITE_FEED_VIEW_MIGRATED',
    [MIGRATION_FLAGS.USE_SUPABASE_DATA]: 'VITE_USE_SUPABASE_DATA',
    [MIGRATION_FLAGS.ENABLE_REAL_TIME]: 'VITE_ENABLE_REAL_TIME',
    [MIGRATION_FLAGS.SHOW_MIGRATION_TOGGLE]: 'VITE_SHOW_MIGRATION_TOGGLE',
  };

  const envVar = envFlags[flag];
  if (envVar && import.meta.env[envVar]) {
    return import.meta.env[envVar] === 'true';
  }

  // Check localStorage for development overrides
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`migration-flag-${flag}`);
    if (stored !== null) {
      return stored === 'true';
    }
  }

  // Default values
  const defaults: Record<MigrationFlag, boolean> = {
    [MIGRATION_FLAGS.FRIENDS_VIEW_MIGRATED]: false,
    [MIGRATION_FLAGS.PLANS_VIEW_MIGRATED]: false,
    [MIGRATION_FLAGS.VENUES_VIEW_MIGRATED]: false,
    [MIGRATION_FLAGS.FEED_VIEW_MIGRATED]: false,
    [MIGRATION_FLAGS.USE_SUPABASE_DATA]: false,
    [MIGRATION_FLAGS.ENABLE_REAL_TIME]: false,
    [MIGRATION_FLAGS.SHOW_MIGRATION_TOGGLE]: process.env.NODE_ENV === 'development',
  };

  return defaults[flag];
};

// Set migration flag (for development/testing)
export const setMigrationFlag = (flag: MigrationFlag, value: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`migration-flag-${flag}`, value.toString());
    // Trigger a reload to apply changes
    window.location.reload();
  }
};

// Check if component should use migrated version
export const shouldUseMigratedComponent = (componentFlag: MigrationFlag): boolean => {
  return getMigrationFlag(componentFlag);
}; 