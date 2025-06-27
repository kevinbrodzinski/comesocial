// Re-export the enhanced follow-up manager for backward compatibility
export { EnhancedFollowUpManager as FollowUpManager, type EnhancedFollowUpResult as FollowUpResult } from './enhancedFollowUpManager';

// Keep the old exports for any existing imports
export { enhancedFollowUpTrees as followUpTrees } from './enhancedFollowUpTrees';
export type { FollowUpNode } from './enhancedFollowUpTrees';
