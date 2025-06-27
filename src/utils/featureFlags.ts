export const FEATURE_FLAGS = {
  auth_magic_link: true,
  planner_invite_only: false,
  show_invite_friends: true,
  show_planner_settings: true,
  show_planner_share: true,
  show_planner_add_to_calendar: true,
  map_message_center_v1: true, // Enable map message center
  
  // Navigation and iOS fixes
  draft_ios_nav_fix_v1: true,
  
  // Plan features
  plan_identifiers_v1: true,
  plan_initial_scroll_fix_v1: true,
  plan_edit_role_guard_v1: true,
  plan_weekday_badge_v1: true, // New weekday badge feature
  
  // Unified scrolling and layout - consolidated approach
  scrolling_header_unify_v1: true,
  
  // Chat header sticky behavior
  chat_header_sticky_on_load_v1: true,
  
  // Co-planning features
  co_plan_live_draft: true,
  co_plan_polish_v2: true,
  co_plan_pass_01: true,
  draft_save_button_v1: true,
  
  // FAB and styling
  'fab-plan-pass-01': true,
  'contrast-pass-01': true,
  
  // Map fixes
  map_loader_fix_v1: true, // Enhanced map loading with diagnostics and error handling
  
  // Responsive map layout
  responsive_map_v2: true, // Dynamic map height with safe-area support
  
  // Stop sheet visual improvements
  stop_sheet_visual_v1: true, // Enhanced visual separation in edit stop details modal
  
  // Other features referenced in the codebase
  live_draft_polish_v1: true,
  overflow_menu_v1: true,
  'overflow-menu-pass-01': true,
} as const;

export const isFeatureEnabled = (flag: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[flag] === true;
};

// Add the missing exports that other files are looking for
export const getFeatureFlag = (flag: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[flag] === true;
};

export const withFeatureFlag = (flag: keyof typeof FEATURE_FLAGS, value: string): string => {
  return FEATURE_FLAGS[flag] === true ? value : '';
};
