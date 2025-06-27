
# Draft iOS Navigation Fix Changelog

## Overview
Fixed iOS Safari auto-zoom issue when focusing text fields in co-planning flows and corrected navigation after saving drafts or exiting to always return to Home › Planner tab instead of the first tab.

## Feature Flag
- **Flag**: `draft_ios_nav_fix_v1`
- **Location**: `src/utils/featureFlags.ts`
- **Default**: `true`

## Files Modified

### 1. iOS Font Size Fix
- **NEW**: `src/styles/_ios-font-fix.css`
  - Prevents Safari auto-zoom by ensuring text inputs are ≥16px font-size
  - Uses `@supports (-webkit-touch-callout: none)` to target iOS only
  - Applied to textarea, input[type="text"], and input[type="search"]

- **MODIFIED**: `src/App.tsx`
  - Conditionally imports iOS font fix CSS when feature flag enabled
  - Ensures global application of font size fixes

### 2. Responsive Font Classes
- **MODIFIED**: `src/components/coplan/SetupCoPlanModal.tsx`
  - Updated description textarea with `text-base md:text-sm` class
  - Maintains 16px on mobile (no zoom), smaller font on desktop

- **MODIFIED**: `src/components/coplan/live-draft/DraftStopCard.tsx`
  - Updated notes textarea with `text-base md:text-sm` class
  - Consistent responsive font sizing for iOS compatibility

- **MODIFIED**: `src/components/coplan/live-draft/PlanDraftHeader.tsx`
  - Updated title input with `text-base md:text-lg` class
  - Updated description input with `text-base md:text-sm` class
  - Prevents zoom on inline editing fields in draft header

- **MODIFIED**: `src/components/coplan/live-draft/PlanDescriptionCard.tsx`
  - Updated description textarea with `text-base md:text-sm` class
  - Ensures consistent no-zoom behavior across all description editing areas

### 3. Navigation Improvements
- **MODIFIED**: `src/services/draftActions.ts`
  - Added optional `onSaveSuccess` callback parameter to `saveDraft()`
  - Callback triggered on successful save when feature flag enabled
  - Enables custom navigation handling after draft saves

- **MODIFIED**: `src/components/coplan/live-draft/BackToPlannerButton.tsx`
  - Enhanced with `useNavigate` hook for programmatic navigation
  - Routes to Home › Planner › Active tab when feature flag enabled
  - Uses `replace: true` to prevent back navigation issues
  - Falls back to original `onBack` behavior when flag disabled

- **MODIFIED**: `src/components/PlannerView.tsx`
  - Added `useLocation` hook to read navigation state
  - Handles `plannerInitialTab` from location state on mount
  - Sets active tab based on navigation intent when feature flag enabled
  - Clears navigation state after processing to prevent re-triggering

## Behavior Changes

### Before (Feature Flag Disabled)
- Text inputs <16px triggered Safari auto-zoom on focus
- Save Draft and exit actions could land on wrong tab
- Navigation relied on previous tab state which could be inconsistent

### After (Feature Flag Enabled)
- All text inputs render at 16px on iOS (no auto-zoom)
- Desktop maintains smaller, visually appropriate font sizes
- Save Draft and Back actions always route to Home › Planner › Active tab
- Consistent navigation experience regardless of entry point

## Technical Implementation
- **iOS Detection**: Uses CSS `@supports (-webkit-touch-callout: none)` for iOS-specific rules
- **Responsive Design**: `text-base md:text-sm` maintains visual hierarchy on desktop
- **Navigation**: React Router state-based navigation with fallback behavior
- **Performance**: CSS only loads when feature flag enabled

## Testing Notes
- Test textarea focus on iOS Safari (should not auto-zoom)
- Verify Save Draft button routes to correct tab
- Confirm Back/Close button navigation behavior
- Check desktop font sizes remain visually appropriate
- Validate fallback behavior when feature flag disabled

## Backwards Compatibility
- Feature flag provides complete backwards compatibility
- When `draft_ios_nav_fix_v1` is `false`, original behavior preserved
- No breaking changes to existing navigation flows
- iOS font fix only applies when feature flag enabled
