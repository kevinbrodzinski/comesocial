
import { NotificationPreferences } from './types';

export const useDndLogic = (preferences: NotificationPreferences) => {
  const isInDndHours = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const { dndStart, dndEnd } = preferences;
    
    if (dndStart > dndEnd) {
      // Overnight DND (e.g., 23:00 to 09:00)
      return currentTime >= dndStart || currentTime <= dndEnd;
    } else {
      // Same day DND (e.g., 14:00 to 16:00)
      return currentTime >= dndStart && currentTime <= dndEnd;
    }
  };

  return {
    isInDndHours
  };
};
