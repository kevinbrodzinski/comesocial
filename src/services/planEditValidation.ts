
import { PlanRole, getPlanRole, canEditPlan } from '@/utils/getPlanRole';

export interface PlanEditRequest {
  planId: string;
  userId: number;
  action: 'add_stop' | 'edit_stop' | 'delete_stop' | 'reorder_stops' | 'lock_plan';
  data?: any;
}

export interface PlanEditResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

// Mock plan data for validation
const mockPlans = {
  '1': { id: 1, host_id: 1, co_planners: [2, 3] },
  '2': { id: 2, host_id: 2, co_planners: [1] },
  '3': { id: 3, host_id: 3, co_planners: [] },
};

export const validatePlanEdit = async (request: PlanEditRequest): Promise<PlanEditResponse> => {
  const { planId, userId, action } = request;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Get plan data (in real app, this would be from database)
  const plan = mockPlans[planId as keyof typeof mockPlans];
  
  if (!plan) {
    return {
      success: false,
      message: 'Plan not found',
      statusCode: 404
    };
  }
  
  // Check user role and permissions
  const userRole = getPlanRole(plan, userId);
  const hasEditPermission = canEditPlan(userRole);
  
  if (!hasEditPermission) {
    console.log(`Permission denied: User ${userId} (role: ${userRole}) attempted ${action} on plan ${planId}`);
    
    return {
      success: false,
      message: 'Only hosts and co-planners can edit this plan. Guests can suggest changes via chat.',
      statusCode: 403
    };
  }
  
  // If user has permission, allow the action
  console.log(`Permission granted: User ${userId} (role: ${userRole}) can perform ${action} on plan ${planId}`);
  
  return {
    success: true,
    message: `Action ${action} completed successfully`,
    statusCode: 200
  };
};

export const PlanEditService = {
  validateEdit: validatePlanEdit
};
