
import { useCallback, useRef } from 'react';

export const useButtonPerformance = () => {
  const timingRef = useRef<{ [key: string]: number }>({});

  const trackButtonClick = useCallback((buttonName: string) => {
    const startTime = performance.now();
    timingRef.current[`${buttonName}_start`] = startTime;
    console.log(`🔘 Button "${buttonName}" clicked at: ${startTime}ms`);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - timingRef.current[`${buttonName}_start`];
      console.log(`🔘 Button "${buttonName}" completed in: ${duration}ms`);
      delete timingRef.current[`${buttonName}_start`];
    };
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    return {
      pendingOperations: Object.keys(timingRef.current).length,
      activeButtons: Object.keys(timingRef.current)
    };
  }, []);

  return {
    trackButtonClick,
    getPerformanceMetrics
  };
};
