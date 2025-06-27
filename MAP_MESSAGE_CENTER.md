
# Map Message Center Implementation

## Overview
Implemented a lightweight message center for the map screen that handles ping/chat actions originating from map pins and venue interactions.

## Feature Flag
- `map_message_center_v1`: Controls the availability of the map message center feature

## Files Modified/Created

### Database Changes
- **Migration**: Added `context` column to `message_threads` table
  - Values: `'direct'`, `'plan'`, `'map'`
  - Added database index for performance
  - Updated existing threads with appropriate context

### Type Definitions
- **src/types/messaging.ts**: Extended `MessageThread` interface
  - Added `context` field
  - Added `meta` field for map-specific metadata (pinId, coordinates)

### New Components
- **src/components/map/messages/MessageCenterModal.tsx**
  - Main modal container for map messages
  - Responsive: Dialog on desktop, Sheet on mobile
  - Shows unread badge and thread list
  - Includes "Jump to full Messages" functionality

- **src/components/map/messages/MapThreadCard.tsx**
  - Compact thread display cards
  - Shows last message preview (max 2 lines)
  - Displays venue information and participant avatars
  - Includes external link to full Messages page

### New Services
- **src/services/chat/sendMapMessage.ts**
  - Handles map-specific message creation
  - Creates threads with `context: "map"`
  - Supports both individual and group messaging
  - Integrates with existing message store

### Modified Components
- **src/components/map/MapHeader.tsx**
  - Updated MessageCircle button to open modal instead of navigating
  - Added unread badge for map-specific threads
  - Feature-flagged behavior

- **src/components/map/FriendTooltip.tsx**
  - Updated ping functionality to use `sendMapMessage`
  - Feature-flagged implementation

- **src/components/map/CheckInActivityModal.tsx**
  - Updated message sending to use `sendMapMessage`
  - Includes venue context and pin ID

### State Management
- **src/messages/useMessagesStore.ts**
  - Added `context` field to MessageThread interface
  - Updated upsertThread to handle context properly

- **src/utils/featureFlags.ts**
  - Added `map_message_center_v1` feature flag

## Key Features Implemented
✅ Lightweight 380px modal on desktop, full-width on mobile  
✅ Threads persist in database with `context: "map"`  
✅ Cross-visibility with main Messages page  
✅ Real-time message updates via existing store  
✅ Unread badge on map chat icon  
✅ "Jump to full Messages" functionality  
✅ Feature flag protection  
✅ Group messaging support for multiple recipients  
✅ Venue and coordinate context preservation  

## Usage
1. Click the 💬 icon in the map header to open the Message Center
2. Send pings/chats from map pins - they'll appear in the modal
3. Threads are accessible in both the modal and main Messages page
4. Feature can be disabled via the `map_message_center_v1` flag

## Technical Notes
- Messages are stored with `context: "map"` for filtering
- Pin ID and coordinates are preserved in thread metadata
- Existing message infrastructure is reused for persistence and real-time updates
- Responsive design adapts to desktop/mobile contexts
