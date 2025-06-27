
import { useToast } from '@/hooks/use-toast';
import { useUndoToast } from '@/components/toast/UndoToast';
import { getFeatureFlag } from '@/utils/featureFlags';
import CoPlanService from './CoPlanService';

class DraftActionsService {
  private static instance: DraftActionsService;
  private lastSaveTime: number = 0;
  private readonly DEBOUNCE_DELAY = 1000; // 1 second

  static getInstance(): DraftActionsService {
    if (!DraftActionsService.instance) {
      DraftActionsService.instance = new DraftActionsService();
    }
    return DraftActionsService.instance;
  }

  async saveDraft(draftId: string, payload: any, onSaveSuccess?: () => void): Promise<boolean> {
    const now = Date.now();
    
    // Debounce: ignore if another save happened less than 1 second ago
    if (now - this.lastSaveTime < this.DEBOUNCE_DELAY) {
      console.log('Save request debounced');
      return false;
    }
    
    this.lastSaveTime = now;

    try {
      const coPlanService = CoPlanService.getInstance();
      
      // Update draft with current timestamp and payload
      const updatedDraft = coPlanService.updateDraft(draftId, {
        ...payload,
        updated_at: new Date()
      });

      if (updatedDraft) {
        console.log('Draft saved successfully:', draftId, updatedDraft);
        // Also log what was saved for debugging
        console.log('Saved payload:', payload);
        
        // Call success callback if provided (for navigation)
        if (onSaveSuccess && getFeatureFlag('draft_ios_nav_fix_v1')) {
          onSaveSuccess();
        }
        
        return true;
      }
      
      console.error('Failed to update draft - no updated draft returned');
      return false;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return false;
    }
  }
}

export default DraftActionsService;
