
import { useToast } from '@/hooks/use-toast';

export interface SaveRsvpRequest {
  planId: number;
  status: 'going' | 'maybe' | 'cant_go';
}

export interface SaveRsvpResponse {
  success: boolean;
  message: string;
}

// Mock RSVP persistence service
export const saveRsvp = async (planId: number, status: 'going' | 'maybe' | 'cant_go'): Promise<SaveRsvpResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock successful response
  console.log(`Saving RSVP for plan ${planId}: ${status}`);
  
  return {
    success: true,
    message: `RSVP saved: ${status}`
  };
};

export const PlanService = {
  saveRsvp
};
