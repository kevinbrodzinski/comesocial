
# Co-Plan Polish V2 Changelog

## Overview
Enhanced the co-planning workflow with thumb-friendly design, reduced clutter, and improved polish to match the rest of the app's user experience.

## Changes Made

### A. Setup Co-Plan Modal Improvements
1. **Sticky CTA Footer**: Added fixed footer with "Create Co-Plan" button that's always visible at bottom
2. **Plan Type Grid**: Converted to compact 2×2 grid showing top 4 categories with "More..." pill for full list
3. **Responsive Design**: For screens <360px, switches to horizontal scroll chips instead of grid
4. **Description Input Polish**: 
   - Empty state: accent border (`border-primary/30`)
   - When typing: filled background (`bg-surface-2`) with no border
5. **Friend Chips Enhancement**: Added tiny ✕ button for deselection with live friend count updates

### B. Live Draft Workspace Improvements
6. **Header Subtitle**: Added inline editable subtitle when description exists, hidden when empty
7. **Empty State**: Centered dashed "Add Stop" ghost card with "Drag to reorder stops" tip that fades when ≥2 stops
8. **Swipe-to-Delete**: Implemented swipe left to delete with 4-second undo toast
9. **Disabled Lock Styling**: Styled as `opacity-40 bg-surface-2` with tooltip "Add a stop before locking"
10. **Typing Indicators**: Replaced pulse with static 2px colored outline + 16px avatar badge, fades after 5s idle
11. **Safe Area Support**: Added `pb-safe` class for iOS home indicator/keyboard compatibility

### C. Shared Motion & Polish
12. **Hide-on-Scroll**: All headers use smooth `transition-transform duration-200 ease-out`
13. **Notification Cleanup**: Removed all popup notifications related to draft creation and member editing
14. **Color Indicators**: Maintained presence color indicators without notifications

## New Components Created
- `components/coplan/SetupCoPlanModal.tsx` - Enhanced setup modal with sticky footer
- `components/coplan/PlanTypeCarousel.tsx` - Horizontal scrolling chips for small screens
- `components/coplan/FriendChip.tsx` - Friend chip with deselect functionality
- `components/coplan/live-draft/DraftEmptyHint.tsx` - Centered empty state hint
- `components/toast/UndoToast.tsx` - Generic undo toast functionality
- `utils/useHideOnScroll.ts` - Reusable hide-on-scroll behavior

## Updated Components
- `pages/CoPlanInviteSetupPage.tsx` - Integrated new setup modal
- `components/coplan/live-draft/PlanDraftHeader.tsx` - Added hide-on-scroll and inline subtitle
- `components/coplan/live-draft/DraftStopCard.tsx` - Added swipe-to-delete and improved typing indicators
- `components/coplan/live-draft/BottomActionBar.tsx` - Added safe area support and improved lock button styling
- `utils/featureFlags.ts` - Added `co_plan_polish_v2` feature flag

## Feature Flag
All improvements are controlled by the `co_plan_polish_v2` feature flag, allowing for easy rollback and A/B testing.

## User Experience Improvements
- Thumb-friendly interactions with larger touch targets
- Reduced visual clutter by removing unnecessary notifications
- Smooth animations and transitions throughout
- Better mobile responsiveness with safe area support
- Intuitive swipe gestures with undo functionality
- Always-visible CTAs for improved usability

## Technical Notes
- Maintains backward compatibility when feature flag is disabled
- Uses existing toast system for undo functionality
- Leverages existing design system components and styling
- Optimized for mobile-first experience
