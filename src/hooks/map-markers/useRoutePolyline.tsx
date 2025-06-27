
import { useState, useEffect } from 'react';

interface UseRoutePolylineProps {
  map: google.maps.Map | null;
  planningMode: boolean;
  stablePlanStops: any[];
}

export const useRoutePolyline = ({ map, planningMode, stablePlanStops }: UseRoutePolylineProps) => {
  const [routePolyline, setRoutePolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !planningMode) {
      if (routePolyline) {
        routePolyline.setMap(null);
        setRoutePolyline(null);
      }
      return;
    }

    if (stablePlanStops.length < 2) {
      if (routePolyline) {
        routePolyline.setMap(null);
        setRoutePolyline(null);
      }
      return;
    }

    if (routePolyline) {
      routePolyline.setMap(null);
    }

    const path = stablePlanStops.map(stop => ({ lat: stop.lat, lng: stop.lng }));

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#3b82f6',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    polyline.setMap(map);
    setRoutePolyline(polyline);

    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.fitBounds(bounds);

  }, [map, stablePlanStops, planningMode]);

  return routePolyline;
};
