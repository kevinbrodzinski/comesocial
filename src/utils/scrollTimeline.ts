
import { getFeatureFlag } from '@/utils/featureFlags';

interface Stop {
  id: number | string;
  status?: 'upcoming' | 'current' | 'completed';
}

const isMobileDevice = () => {
  return window.innerWidth <= 640 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const scrollTimeline = (
  timelineElement: HTMLElement | null,
  stops: Stop[],
  planStatus: string
) => {
  const initialScrollFixEnabled = getFeatureFlag('plan_initial_scroll_fix_v1');
  
  if (!initialScrollFixEnabled) {
    return;
  }

  const isMobile = isMobileDevice();

  // Always scroll to top first - use window.scrollTo for mobile, element scroll for desktop
  if (isMobile) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (timelineElement) {
    timelineElement.scrollTop = 0;
  }

  // For active plans, scroll to current stop after DOM settles
  if (planStatus === 'active') {
    const currentStop = stops.find(stop => stop.status === 'current');
    if (currentStop) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.getElementById(`stop-${currentStop.id}`);
          if (element) {
            if (isMobile) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      });
    }
  }
};
