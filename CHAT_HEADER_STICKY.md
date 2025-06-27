
# Chat Header Sticky On Load Changelog

## Overview
Fixed chat header from immediately hiding when the page mounts by implementing smart scroll detection that distinguishes between programmatic scrolls (during initial render) and user-initiated scrolls.

## Feature Flag
- **Flag**: `chat_header_sticky_on_load_v1`
- **Location**: `src/utils/featureFlags.ts`
- **Default**: `true`

## Files Modified

### 1. Enhanced Scroll Hook
- **MODIFIED**: `src/utils/useHideOnScroll.ts`
  - Added `ignoreProgrammaticMs` parameter (default 0)
  - Tracks mount time with `useRef` to identify programmatic scrolls
  - Ignores scroll events within the specified timeframe after mount
  - Only responds to scroll events after grace period expires

### 2. Chat Header Updates
- **MODIFIED**: `src/components/chat/ChatHeader.tsx`
  - Integrated `useHideOnScroll` hook with 300ms programmatic scroll protection
  - Added conditional transform styling with smooth transitions
  - Header now only hides after user-initiated scrolling

### 3. Smart Scroll Logic
- **MODIFIED**: `src/components/NovaChat.tsx`
  - Enhanced `scrollToBottom` effect to check for actual user/assistant messages
  - Prevents auto-scroll when only welcome message is present
  - Uses feature flag to control smart scrolling behavior
  - Maintains backwards compatibility when flag is disabled

### 4. Overscroll Prevention
- **MODIFIED**: `src/components/chat/WelcomeMessage.tsx`
  - Added `overscroll-x-contain` class to prompt chips container
  - Prevents iOS from affecting vertical scroll position during horizontal scroll painting
  - Eliminates unwanted scroll events that could trigger header hiding

### 5. Feature Flag Addition
- **MODIFIED**: `src/utils/featureFlags.ts`
  - Added `chat_header_sticky_on_load_v1` flag for controlling the new behavior

## Behavior Changes

### Before (Feature Flag Disabled)
- Chat header could disappear immediately on page load due to programmatic scrolling
- Welcome message rendering triggered unwanted scroll events
- Header visibility was inconsistent during initial page render

### After (Feature Flag Enabled)
- Chat header remains visible for 300ms after page load
- Only user-initiated scrolling can hide the header
- Welcome message doesn't trigger premature header hiding
- Smooth transitions when header visibility changes

## Technical Implementation
- **Grace Period**: 300ms window after mount where scroll events are ignored
- **Mount Tracking**: `useRef` to track component mount time
- **Smart Detection**: Distinguishes between programmatic and user scrolls
- **Smooth Transitions**: CSS transitions for header show/hide animations

## Testing Notes
- Test chat page load - header should stay visible initially
- Scroll down manually - header should hide with smooth transition
- Scroll back up - header should reappear
- Verify welcome message doesn't cause premature hiding
- Check horizontal scrolling in prompt chips doesn't affect header
- Validate fallback behavior when feature flag disabled

## Backwards Compatibility
- Feature flag provides complete backwards compatibility
- When `chat_header_sticky_on_load_v1` is `false`, original behavior preserved
- No breaking changes to existing scroll behavior
- Graceful degradation when enhanced features are disabled
