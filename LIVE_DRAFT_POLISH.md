
# Live Draft v2 Polish - Changelog

## Files Modified/Created

### New Components
- `src/components/coplan/live-draft/InfoBanner.tsx` - Dismissible banner for intro messages
- `src/services/ChatService.ts` - Service for handling system messages and intro state

### Updated Components
- `src/components/coplan/FriendPickerSheet.tsx` - Made friends list fully scrollable with ScrollArea
- `src/components/coplan/live-draft/DraftStopCard.tsx` - Added mobile polish, swipe-to-delete, improved typography
- `src/components/coplan/live-draft/PresenceStrip.tsx` - Added typing pulse animation under editing users
- `src/components/coplan/live-draft/PlanDraftHeader.tsx` - Added lock button disable state with tooltip
- `src/components/PlannerView.tsx` - Updated badge hiding logic for tabs with 0 count
- `src/pages/CoPlanDraftPage.tsx` - Integrated all v2 features with proper navigation

### Updated Hooks
- `src/hooks/useLiveDraftState.tsx` - Modified to start with blank canvas, added delete functionality

### Updated Utils
- `src/utils/featureFlags.ts` - Added `co_plan_live_draft` feature flag

## Key Features Implemented

### 1. Friend Picker Improvements ✅
- Wrapped friends list in ScrollArea with max-h-[50vh]
- Search bar and selected count stay sticky at top
- Improved scrolling behavior and layout

### 2. Intro Concept System ✅
- System message creation after friend selection
- InfoBanner component with dismissible functionality
- Unread intro tracking with ChatService
- Grey bubble styling for system messages

### 3. Blank Canvas Start ✅
- Modified useLiveDraftState to start with empty stops array
- Shows only ghost "Add Stop" card when no stops exist
- Toast notification for "Suggest Nearby" pre-fills

### 4. Stop Card Mobile Polish ✅
- Updated padding to 12px L/R
- Drag handle hit area: 32px (visual 16px)
- Field headings: text-base, values: text-sm
- Safe area handling for keyboard
- Swipe-to-delete for filled cards only

### 5. Lock Button Behavior ✅
- Disabled when stops.length === 0
- Tooltip: "Add a stop before locking"
- Greyed style with opacity-40 cursor-not-allowed

### 6. Presence Strip Polish ✅
- 3-dot typing pulse animation under editing user avatars
- Enhanced visual feedback for real-time editing

### 7. Navigation Improvements ✅
- Replaced navigate(-1) with tab-aware navigation
- Stores previousTab in location.state
- Returns to correct planner tab on back navigation

### 8. Badge Hiding Logic ✅
- Hides badges when count === 0
- Applied to Active, Invitations, and Past tabs
- Maintains existing badge styling when count > 0

### 9. Feature Flag Protection ✅
- All new functionality wrapped under `co_plan_live_draft` flag
- Graceful fallback when flag disabled

## Technical Notes

- All components maintain existing design system
- Real-time functionality preserved and enhanced
- Mobile-first responsive design maintained
- TypeScript types properly extended
- No breaking changes to existing API

## Testing Checklist

- [ ] Scrollable friend picker with sticky elements
- [ ] Blank draft shows only ghost card
- [ ] Info banner displays and dismisses correctly
- [ ] Stop card swipe-delete works for filled cards
- [ ] Lock button disabled until stops added
- [ ] Typing pulse shows under editing users
- [ ] Back navigation returns to correct tab
- [ ] Badges hidden when count is 0
- [ ] Feature flag properly gates all functionality
