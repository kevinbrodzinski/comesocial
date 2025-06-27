
// Mock current user utilities
// In a real app, this would connect to authentication context

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
}

export const getCurrentUser = (): CurrentUser => {
  // Mock current user - in real app this would come from auth context
  return {
    id: 1,
    name: 'Current User',
    email: 'user@example.com'
  };
};

export const getCurrentUserId = (): number => {
  return getCurrentUser().id;
};
