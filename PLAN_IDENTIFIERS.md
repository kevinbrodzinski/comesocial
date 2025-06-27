
# Plan Identifiers V1 Changelog

## Overview
Added plan ownership badges, enhanced RSVP management, and plan overview functionality to improve user experience in the Planner. Users can now easily identify their relationship to each plan and manage RSVPs with instant persistence.

## Feature Flag
- **Flag**: `plan_identifiers_v1`
- **Location**: `src/utils/featureFlags.ts`
- **Default**: `true`

## New Components

### 1. RSVPSwitch Component
- **File**: `src/components/plan/RSVPSwitch.tsx`
- **Purpose**: Reusable RSVP component with three states (Going/Maybe/Can't Go)
- **Features**:
  - Optimistic updates with loading states
  - Configurable layout (inline/stack) and sizes
  - Integration with persistence service
  - Toast notifications for status updates

### 2. RSVPModal Component
- **File**: `src/components/plan/RSVPModal.tsx`
- **Purpose**: Modal for invited users to RSVP before viewing plan details
- **Features**:
  - Plan preview with organizer information
  - Inline RSVP functionality
  - "View Plan" button for navigation after RSVP

### 3. PlanOverview Component
- **File**: `src/components/plan/PlanOverview.tsx`
- **Purpose**: Sticky overview section in plan view with attendee info and host messaging
- **Features**:
  - Attendee avatars with RSVP status color rings
  - Host message display in styled bubble
  - Collapsible night-wide tasks accordion
  - Inline RSVP for unresponded invited users
  - Hide/show on scroll behavior

## Enhanced Components

### 1. PlanCardPreview Component
- **Modified**: `src/components/plan/PlanCardPreview.tsx`
- **New Features**:
  - **Ownership badges** in top-right corner (20px from top)
    - Purple outline `#7B5BFF` → "Created by you"
    - Blue outline `#4A8CFF` → "Co-planning"  
    - Green outline `#22C55E` → "Invited"
  - **Dynamic action buttons** based on ownership:
    - Owner: Edit + Share + Delete
    - Co-planner: "Open Draft" + Share
    - Invited (no RSVP): Inline RSVP buttons
    - Invited (with RSVP): "View Plan" button
  - **Smart click behavior**: RSVP modal for unresponded invitations

### 2. EnhancedPlanView Component
- **Modified**: `src/components/EnhancedPlanView.tsx`
- **New Features**:
  - Integrated `PlanOverview` component below header
  - **Auto-scroll on mount**:
    - `planned` status → scroll to first upcoming stop
    - `active` status → scroll to current stop with pulsating glow effect
  - Enhanced timeline with stop identification for scrolling

## Services & Utilities

### 1. Plan Service
- **New File**: `src/services/plan.ts`
- **Purpose**: RSVP persistence layer with mock backend integration
- **Functions**:
  - `saveRsvp(planId, status)` - Persist RSVP with simulated API call
  - Mock delay and response handling for realistic UX

### 2. User Utilities
- **New File**: `src/utils/userUtils.ts`
- **Purpose**: Mock current user management system
- **Functions**:
  - `getCurrentUser()` - Returns mock current user object
  - `getCurrentUserId()` - Returns current user ID for ownership detection

## Data Structure Updates

### 1. Plan Interface Extensions
- **Modified**: `src/data/plansData.ts`
- **New Fields**:
  - `hostId?: number` - Plan creator identification
  - `coPlanners?: number[]` - Array of co-planning user IDs
  - `overviewMessage?: string` - Host's pinned message for overview

### 2. Mock Data Enhancements
- Added `hostId` and `overviewMessage` to existing plans
- Enhanced plan organizer information for ownership detection
- Updated friend plans to show invited status properly

## Technical Implementation

### Auto-scroll Timeline
- **Location**: `EnhancedPlanView.tsx`
- **Behavior**:
  - Waits 500ms after mount for smooth UX
  - Scrolls to relevant stop based on plan status
  - Adds pulsating glow effect for current stops (2 second duration)
  - Uses `scrollIntoView` with smooth behavior and center block positioning

### RSVP Persistence Flow
1. User clicks RSVP button → Optimistic UI update
2. Call `saveRsvp()` service with 500ms simulated delay
3. Show loading state on buttons during save
4. Display success toast on completion
5. Handle errors with rollback and error toast

### Ownership Detection Logic
- Compare `plan.organizer` with current user name
- Check `plan.hostId` against current user ID
- Determine invited status from plan status and organizer
- Fall back to co-planning for collaborative plans

## Visual Design

### Ownership Badges
- **Position**: Top-right corner, 20px below card top edge
- **Style**: `text-[10px] font-medium uppercase px-2 py-1 rounded-full`
- **Colors**: Outlined badges with brand colors for clear identification

### RSVP Status Colors
- **Going**: Green ring `ring-green-500`
- **Maybe**: Yellow ring `ring-yellow-500`  
- **Can't Go**: Gray ring `ring-gray-400`

### Plan Overview Styling
- **Sticky positioning** below plan header
- **Host message bubble**: Light gray background `#F4F4F6`
- **Accordion integration**: Uses existing shadcn/ui Accordion component
- **Responsive behavior**: Hides on scroll, reappears on pull-down

## User Experience Improvements

### Smart Navigation
- Invited users see RSVP modal before plan details
- Clear ownership identification reduces confusion
- Contextual action buttons based on user relationship to plan

### Instant Feedback
- Optimistic updates for immediate responsiveness
- Loading states during network operations
- Toast notifications for all state changes

### Enhanced Plan View
- Automatic scrolling to relevant timeline sections
- Visual indicators for current stops
- Comprehensive attendee overview with status visualization

## Backwards Compatibility
- Feature flag provides complete backwards compatibility
- When `plan_identifiers_v1` is `false`, original behavior preserved
- No breaking changes to existing plan data structure
- Graceful degradation when enhanced features are disabled

## Testing Notes
- Test all three ownership badge types in plan lists
- Verify RSVP modal flow for invited users without responses
- Check auto-scroll behavior for different plan statuses
- Validate RSVP persistence with network simulation
- Confirm overview section visibility and accordion functionality
- Test backwards compatibility with feature flag disabled
