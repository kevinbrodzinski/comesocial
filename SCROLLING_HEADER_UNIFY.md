
# Scrolling Header Unification Changelog

## Overview
Unified scrolling header behavior across Home, Feed, and Friends pages to match the Planner page's natural scroll pattern. Headers now scroll away with content instead of remaining fixed, creating a more immersive and mobile-friendly experience.

## Feature Flag
- **Flag**: `scrolling_header_unify_v1`
- **Location**: `src/utils/featureFlags.ts`
- **Default**: `true`

## Files Modified

### 1. Layout Components
- **NEW**: `src/components/layout/PageWithScrollingHeader.tsx`
  - Simple wrapper component that creates a single scroll container
  - Places header inside the scrollable area instead of fixed positioning
  - Conditionally applies based on feature flag

### 2. Feature Configuration
- **MODIFIED**: `src/utils/featureFlags.ts`
  - Added `scrolling_header_unify_v1` feature flag

### 3. Header Components
- **MODIFIED**: `src/components/chat/ChatHeader.tsx`
  - Removed fixed positioning when feature flag enabled
  - Cleaned up z-index and positioning utilities

- **MODIFIED**: `src/components/feed/FeedHeader.tsx`  
  - Removed sticky positioning when feature flag enabled
  - Header now scrolls naturally with content

- **MODIFIED**: `src/components/FriendsViewHeader.tsx`
  - Removed fixed positioning when feature flag enabled
  - Cleaned up absolute positioning utilities

### 4. Main Page Components  
- **MODIFIED**: `src/components/NovaChat.tsx`
  - Integrated PageWithScrollingHeader wrapper
  - Dual layout support: unified scrolling vs traditional fixed header
  - Preserved ChatInput fixed positioning

- **MODIFIED**: `src/components/FeedView.tsx`
  - Integrated PageWithScrollingHeader wrapper
  - Ensured FeedTabBar remains sticky (`sticky top-0 z-10`) when header scrolls away
  - Maintained TrendingCarousel positioning

- **MODIFIED**: `src/components/FriendsView.tsx`
  - Integrated PageWithScrollingHeader wrapper
  - Removed padding compensation (`pt-56`) when using unified scrolling
  - Preserved all modal and action functionality

## Behavior Changes

### Before (Feature Flag Disabled)
- Headers remained fixed at top of viewport
- Content scrolled underneath headers
- Required padding/margin compensation for content
- Multiple scroll containers per page

### After (Feature Flag Enabled)  
- Headers scroll naturally with content (like Instagram/Twitter)
- Single scroll container per page
- Sub-ribbons (tab bars, filter chips) remain sticky when header scrolls away
- No padding compensation needed
- More screen real estate for content

## Sticky Sub-Elements
The following elements remain sticky (`sticky top-0 z-10`) to dock at the top when main headers scroll away:
- **Feed**: FeedTabBar component
- **Friends**: FriendsTabBar within header
- **All pages**: Any filter ribbons or navigation pills

## Backwards Compatibility
- Feature flag provides complete backwards compatibility
- When `scrolling_header_unify_v1` is `false`, pages use original fixed header layout
- No functionality changes, only scroll behavior modification
- All modals, actions, and interactions preserved

## Technical Implementation
- **Pattern**: Wrapper-based approach for clean separation of concerns
- **Scroll**: Single `overflow-y-auto` container per page
- **Performance**: No additional scroll listeners or performance overhead
- **Accessibility**: Maintains focus management and screen reader compatibility

## Testing Notes
- Test scrolling behavior on all three main tabs (Home, Feed, Friends)
- Verify sub-ribbons stick to top when headers scroll away
- Confirm modals and interactions still work correctly
- Check bottom navigation and FABs remain unaffected
- Validate feature flag toggle works properly
