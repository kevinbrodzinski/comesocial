
# Plan Edit Role Guard V1 Changelog

## Overview
Implemented role-based editing permissions to restrict plan modification access to hosts and co-planners only. Guests now see a read-only view with suggestion capabilities via chat, creating a cleaner permission model for collaborative planning.

## Feature Flag
- **Flag**: `plan_edit_role_guard_v1`
- **Location**: `src/utils/featureFlags.ts`
- **Default**: `true`

## Core Features

### 1. Role Detection System
- **New Utility**: `src/utils/getPlanRole.ts`
- **Role Types**: `'host' | 'co-planner' | 'guest'`
- **Permission Helper**: `canEditPlan(role)` function
- **Flexible Plan Data**: Handles multiple property name formats (`hostId`, `host_id`, `organizer`)

### 2. Component Permission Guards

#### BottomActionBar Updates
- **File**: `src/components/coplan/live-draft/BottomActionBar.tsx`
- **Guest Experience**: "Add Stop" becomes "Suggest Stop" (opens chat)
- **Hidden Features**: Nearby search hidden for guests
- **Lock Controls**: Tooltip explains permission requirements
- **Save Draft**: Disabled for guests (read-only access)

#### DraftStopCard Restrictions
- **File**: `src/components/coplan/live-draft/DraftStopCard.tsx`
- **Read-Only Inputs**: All form fields become `readOnly` for guests
- **Disabled Drag**: `isDragDisabled` prevents reordering
- **No Delete**: Swipe-to-delete hidden for guests
- **Visual Indicators**: Muted background for guest cards

### 3. Page Integration
- **File**: `src/pages/CoPlanDraftPage.tsx`
- **Role Detection**: Automatic role calculation on page load
- **Prop Passing**: `userRole` passed to all child components
- **Guest Suggestions**: "Suggest Stop" opens chat with pre-context

### 4. Backend Validation
- **Service**: `src/services/planEditValidation.ts`
- **Permission Checking**: Server-side role validation
- **403 Responses**: Clear error messages for unauthorized actions
- **Mock Implementation**: Ready for real backend integration

## Permission Matrix

| Action | Host | Co-planner | Guest |
|--------|------|------------|-------|
| Add Stop | ✅ | ✅ | ❌ (Suggest) |
| Edit Stop | ✅ | ✅ | ❌ (Read-only) |
| Delete Stop | ✅ | ✅ | ❌ (Hidden) |
| Reorder Stops | ✅ | ✅ | ❌ (No drag) |
| Lock Plan | ✅ | ✅ | ❌ (Tooltip) |
| Save Draft | ✅ | ✅ | ❌ (Hidden) |
| View/Chat | ✅ | ✅ | ✅ |
| Suggest via Chat | ✅ | ✅ | ✅ |

## User Experience Enhancements

### Guest-Friendly Workflow
- **Suggest Stop Button**: Replaces "Add Stop" for intuitive suggestion flow
- **Chat Integration**: Opens chat with context for plan suggestions
- **Clear Visual Feedback**: Muted styling indicates read-only state
- **Helpful Tooltips**: Explain permission requirements without frustration

### Permission Clarity
- **Role-Based Messaging**: Clear explanations for disabled features
- **Consistent UX**: All editing controls follow same permission logic
- **Graceful Degradation**: Features hide/disable rather than error

### Collaborative Features Maintained
- **Chat Always Available**: All users can participate in discussion
- **Suggestion Workflow**: Guests can contribute via chat suggestions
- **Real-time Updates**: Permission changes apply immediately

## Technical Implementation

### Role Detection Logic
```typescript
export const getPlanRole = (plan: PlanWithRoles, currentUserId: number): PlanRole => {
  // Handle multiple property formats
  const hostId = plan.hostId || plan.host_id;
  if (hostId === currentUserId) return 'host';
  
  // Check organizer string match
  if (plan.organizer === 'Current User') return 'host';
  
  // Check co-planner arrays
  const coPlanners = plan.coPlanners || plan.co_planners || [];
  if (coPlanners.includes(currentUserId)) return 'co-planner';
  
  return 'guest';
};
```

### Permission-Based Component Rendering
```typescript
const canEdit = canEditPlan(userRole);
const isEditingDisabled = isLocked || (isRoleGuardEnabled && !canEdit);

// Conditional rendering based on permissions
{isRoleGuardEnabled && isGuest ? (
  <SuggestStopButton />
) : (
  <AddStopButton disabled={isEditingDisabled} />
)}
```

### Backend Validation
```typescript
export const validatePlanEdit = async (request: PlanEditRequest): Promise<PlanEditResponse> => {
  const userRole = getPlanRole(plan, userId);
  const hasEditPermission = canEditPlan(userRole);
  
  if (!hasEditPermission) {
    return {
      success: false,
      message: 'Only hosts and co-planners can edit this plan.',
      statusCode: 403
    };
  }
  
  return { success: true, message: 'Action completed', statusCode: 200 };
};
```

## Backwards Compatibility
- **Feature Flag Protection**: All changes wrapped in `plan_edit_role_guard_v1`
- **Default Behavior**: When disabled, maintains original functionality
- **Graceful Fallback**: Role detection defaults to 'guest' for safety
- **No Breaking Changes**: Existing components work unchanged when flag disabled

## Testing Strategy

### Permission Scenarios
- Host can perform all editing actions
- Co-planners have same permissions as host
- Guests see read-only interface with suggestion options
- Invalid users default to guest permissions

### UI/UX Validation
- All editing controls properly disabled for guests
- Suggestion workflow opens chat with appropriate context
- Tooltips explain permission requirements clearly
- Visual indicators show read-only state

### Backend Security
- 403 responses for unauthorized edit attempts
- Role validation on all mutation endpoints
- Proper error messages for permission denials

## Future Enhancements
- **Dynamic Role Assignment**: Allow hosts to promote guests to co-planners
- **Suggestion Approval**: Workflow for hosts to approve guest suggestions
- **Audit Trail**: Track who made what changes and when
- **Fine-grained Permissions**: Different permission levels for different actions
- **Notification System**: Alert hosts when guests make suggestions

## Performance Considerations
- Role calculation cached per component render
- Minimal re-renders when permissions change
- Lightweight permission checks with early returns
- Efficient component prop passing to avoid prop drilling

This implementation provides a solid foundation for role-based collaborative planning while maintaining a positive user experience for all participants.
