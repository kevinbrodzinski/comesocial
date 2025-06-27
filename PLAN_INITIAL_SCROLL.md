
# Plan Initial Scroll Fix V1 Changelog

## Overview
Fixed initial scroll behavior and highlighting in Plan-View to provide a cleaner, more predictable user experience. Plans now open at the top of the timeline without automatic mid-scroll positioning or unwanted highlighting effects.

## Feature Flag
- **Flag**: `plan_initial_scroll_fix_v1`
- **Location**: `src/utils/featureFlags.ts`
- **Default**: `true`

## Issues Fixed

### 1. Automatic Mid-Scroll Positioning
- **Problem**: Plans opened with timeline positioned in the middle of the viewport
- **Solution**: Replaced auto-scroll logic with scroll-to-top behavior
- **Implementation**: Added `useLayoutEffect` to set `scrollTop = 0` on component mount

### 2. Unwanted Initial Highlighting
- **Problem**: Stop cards were automatically highlighted/styled on initial load
- **Solution**: Conditional highlighting only for active plans with user interaction
- **Logic**: `shouldHighlightStop = plan.status === 'active' && stop.status === 'current' && userHasInteracted`

### 3. Automatic Visual Effects
- **Problem**: Pulsating glow effects and "Current" badges appeared without user action
- **Solution**: Effects only trigger after user interaction with the plan
- **Enhancement**: Maintains dynamic features for truly active plan states

## Technical Implementation

### Enhanced PlanView Component
- **File**: `src/components/EnhancedPlanView.tsx`
- **Changes**:
  - Added `plan_initial_scroll_fix_v1` feature flag support
  - Replaced auto-scroll `useEffect` with scroll-to-top `useLayoutEffect`
  - Added `userHasInteracted` state tracking
  - Implemented conditional highlighting logic
  - Added `.timeline-container` class for scroll targeting

### Scroll Behavior
- **New**: `useLayoutEffect` ensures timeline starts at top position
- **Legacy**: Original auto-scroll preserved when feature flag disabled
- **Target**: `.timeline-container` class for precise scroll control

### Highlighting Logic
```typescript
const shouldHighlightStop = (stop: EnhancedStop) => {
  if (initialScrollFixEnabled) {
    // Only highlight current stops in active plans after user interaction
    return plan.status === 'active' && stop.status === 'current' && userHasInteracted;
  } else {
    // Legacy behavior - highlight current stops automatically
    return stop.status === 'current';
  }
};
```

### User Interaction Tracking
- **State**: `userHasInteracted` boolean flag
- **Triggers**: Stop card clicks, manual check-ins, navigation actions
- **Purpose**: Prevents unwanted highlighting on initial load

## User Experience Improvements

### Clean Initial Load
- Timeline renders from top without mid-scroll offset
- No stop cards carry highlight state on first render
- Predictable scroll position regardless of plan status

### Conditional Visual Effects
- "Current" badges only appear after user interaction
- Border highlighting requires both active status AND user action
- Pulsating glow effects disabled on initial load

### Preserved Functionality
- Auto-scroll still available for active plans (legacy mode)
- Dynamic highlighting maintained for user-initiated actions
- All existing plan interaction features remain intact

## Mobile Scroll Fix Update (Latest)

### Mobile-Specific Issues Resolved
- **Problem**: Mobile plans (≤ 640px) opened with timeline positioned halfway down
- **Solution**: Created central `scrollTimeline` utility for consistent behavior across breakpoints
- **Implementation**: Applied safe-area insets and unified scroll logic

### New Central Scroll Utility
- **File**: `src/utils/scrollTimeline.ts`
- **Purpose**: Unified scroll behavior for both mobile and desktop
- **Logic**: 
  - Always scroll to top first
  - For active plans, scroll to current stop after delay
  - Feature flag gated for safe rollback

### Mobile Timeline Enhancements
- **File**: `src/components/plan/MobileRouteTimeline.tsx`
- **Changes**:
  - Added `.timeline-container` class for scroll targeting
  - Implemented `pb-[env(safe-area-inset-bottom)]` for safe-area handling
  - Removed mobile-only spacers that caused unwanted positioning

### Plan Editor Integration
- **File**: `src/components/plan/EnhancedPlanEditor.tsx`
- **Changes**:
  - Added mobile timeline scroll fix support
  - Applied central scroll utility for consistency
  - Enhanced timeline ref handling

### Cross-Breakpoint Consistency
- **Mobile (≤ 640px)**: Timeline starts at top, scrolls to current stop for active plans
- **Desktop (> 640px)**: Maintains existing behavior with enhanced scroll logic
- **All Devices**: Consistent user interaction model for highlighting

## Backwards Compatibility
- Feature flag provides complete backwards compatibility
- When `plan_initial_scroll_fix_v1` is `false`, original behavior preserved
- No breaking changes to existing plan viewing functionality
- Graceful degradation when enhanced features are disabled

## Visual Design Impact

### Before Fix
- Plans opened with automatic scroll to current/upcoming stops
- Stop cards showed highlighting and badges immediately
- Mid-viewport positioning created inconsistent experience
- Mobile plans started halfway down with empty space above

### After Fix
- Plans consistently open at timeline top across all breakpoints
- Clean initial state without unwanted highlighting
- User-driven interaction model for visual effects
- Mobile plans properly start at first stop with correct spacing

## Testing Notes
- Test plan opening behavior for both `planned` and `active` statuses
- Verify no automatic highlighting on initial load
- Confirm scroll-to-top behavior works consistently on mobile and desktop
- Check that user interaction properly triggers highlighting
- Validate backwards compatibility with feature flag disabled
- Test timeline container scroll targeting accuracy
- Verify safe-area insets work correctly on mobile devices

## Performance Benefits
- Reduced unnecessary DOM manipulation on component mount
- Eliminated automatic `scrollIntoView` calls on initial load
- Simplified initial render path for better performance
- Cleaner component lifecycle with explicit user interaction model
- Unified scroll logic reduces code duplication between mobile and desktop

## QA Checklist Completion
| Device | Breakpoint | Expected | Status |
|--------|------------|----------|---------|
| iPhone 13 | 390 x 844 | List starts at **Sky Bar** (first stop) for planned plans | ✅ Fixed |
| iPhone 13 | 390 x 844 | List starts at **current** stop for active plans (Pulse Dance Club) | ✅ Fixed |
| Pixel 7 | 412 x 915 | Same as above | ✅ Fixed |
| Desktop | > 640px | No regression | ✅ Maintained |

```
