
export type PlanRole = 'host' | 'co-planner' | 'guest';

export interface PlanWithRoles {
  id: number | string;
  hostId?: number;
  host_id?: number;
  organizer?: string;
  coPlanners?: number[];
  co_planners?: number[];
}

export const getPlanRole = (plan: PlanWithRoles, currentUserId: number): PlanRole => {
  if (!plan || !currentUserId) {
    return 'guest';
  }

  // Check if user is the host (handle different property names)
  const hostId = plan.hostId || plan.host_id;
  if (hostId === currentUserId) {
    return 'host';
  }

  // For plans where organizer is a string, check if it matches current user
  if (plan.organizer === 'Current User') {
    return 'host';
  }

  // Check if user is a co-planner
  const coPlanners = plan.coPlanners || plan.co_planners || [];
  if (coPlanners.includes(currentUserId)) {
    return 'co-planner';
  }

  return 'guest';
};

export const canEditPlan = (role: PlanRole): boolean => {
  return role === 'host' || role === 'co-planner';
};

export const getRoleDisplayName = (role: PlanRole): string => {
  switch (role) {
    case 'host': return 'Host';
    case 'co-planner': return 'Co-planner';
    case 'guest': return 'Guest';
    default: return 'Guest';
  }
};
