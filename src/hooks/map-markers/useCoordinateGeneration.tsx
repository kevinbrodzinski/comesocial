
import { useMemo } from 'react';
import { generateStableCoordinates } from '../../utils/coordinateUtils';

export const useCoordinateGeneration = (planStops: any[]) => {
  return useMemo(() => {
    return planStops.map((stop) => {
      if (stop.lat && stop.lng) {
        return stop;
      }
      const coords = generateStableCoordinates(stop.id || '', stop.name || '', 1);
      return {
        ...stop,
        lat: coords.lat,
        lng: coords.lng
      };
    });
  }, [planStops]);
};
