
import { NovaApiService } from './nova/NovaApiService';

export const novaApi = new NovaApiService({
  model: 'gpt-3.5-turbo',
  maxTokens: 500,
  temperature: 0.7,
});

// Re-export types for backward compatibility
export type { NovaConfig, NovaContext, NovaResponse, IntentMapping } from './nova/types';
export { NovaApiService } from './nova/NovaApiService';
