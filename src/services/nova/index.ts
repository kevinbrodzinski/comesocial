
// Clean exports for Nova service
export { NovaApiService } from './NovaApiService';
export { novaApi } from '../novaApi';
export * from './types';
export * from './intentMappings';
export * from './venueFilterUtils';
export * from './responseGenerator';

// Use the enhanced follow-up system as the primary exports
export { 
  FollowUpManager, 
  type FollowUpResult,
  followUpTrees,
  type FollowUpNode
} from './followUpManager';

// Export enhanced versions with their original names for direct access if needed
export { EnhancedFollowUpManager } from './enhancedFollowUpManager';
export { enhancedFollowUpTrees } from './enhancedFollowUpTrees';
export { normalizeKey, findBestMatch } from './keyNormalization';
