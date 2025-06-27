
# Draft Save Button Feature

## Overview
Added Save Draft functionality to the Live Draft workspace, allowing users to persist their current draft state and return to the Planner screen with visual feedback.

## Feature Flag
- `draft_save_button_v1` - Controls the visibility of the Save Draft button

## Files Changed

### New Files
- `src/services/draftActions.ts` - Service for handling draft save operations with debouncing

### Modified Files
- `src/utils/featureFlags.ts` - Added `draft_save_button_v1` feature flag
- `src/components/coplan/live-draft/BottomActionBar.tsx` - Added Save Draft button above Lock row
- `src/pages/CoPlanDraftPage.tsx` - Integrated save functionality with navigation and undo toast
- `src/components/plan/DraftPlanCard.tsx` - Added timestamp display and highlight animation
- `src/components/plan/PlannerActiveTab.tsx` - Added highlight state management

## Features Implemented

### 1. Save Button Placement
- Added Save Draft button in `BottomActionBar.tsx` above the Lock Plan row
- Button styled consistently with other action buttons (Add Stop, Nearby, Chat)
- Shows "Saving..." state during network operations
- Visible to all collaborators without role gating

### 2. Save Handler
- Created `DraftActionsService` with debouncing (1 second delay between saves)
- Persists current draft state including title, description, and stops
- Updates `updated_at` timestamp in draft record

### 3. Navigation & UX
- After successful save, navigates to `/planner?initialTab=drafts` with highlight state
- Shows "Draft saved" toast with Undo option (4 second duration)
- Undo simply navigates back to draft page (simple implementation)

### 4. Draft Card Enhancements
- Added "Edited n min ago" timestamp display on DraftCard
- Highlight animation (3 seconds) when returning from save operation
- Improved visual feedback with background color transitions

### 5. Error Handling
- Shows error toast if save operation fails
- Debounces rapid save button clicks
- Handles loading states appropriately

## Technical Implementation

### Service Layer
- `DraftActionsService` singleton pattern for consistent state management
- Debouncing prevents rapid-fire save requests
- Integrates with existing `CoPlanService` for data persistence

### User Experience
- Non-blocking save operation with visual feedback
- Consistent button styling and placement
- Toast notifications for success/error states
- Simple undo mechanism via navigation
- Highlight animation on returned DraftCard

### Timestamp Display
- Smart relative time formatting (just now, Xm ago, Xh ago, Xd ago)
- Uses `updated_at` field from draft record
- Consistent with platform conventions

## Future Enhancements
- Auto-save functionality during draft editing
- More sophisticated undo functionality with state restoration
- Batch save operations for collaborative editing

## Database Requirements
- Ensure `updated_at` timestamp column exists in `planner_drafts` table
- Column should auto-update on save operations
