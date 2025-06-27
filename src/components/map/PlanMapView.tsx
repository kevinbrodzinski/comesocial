import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getAPIKey } from '../../config/novaConfig';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Navigation, Users, Clock } from 'lucide-react';

interface PlanStop {
  id: number;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  estimatedTime?: string;
  status?: 'upcoming' | 'current' | 'completed';
}

interface PlanMapViewProps {
  plan: {
    id: number;
    name: string;
    date: string;
    time: string;
    stops: PlanStop[];
    attendees: number;
  };
  onBack: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const PlanMapView = ({ plan, onBack, userLocation }: PlanMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [userLocationMarker, setUserLocationMarker] = useState<google.maps.Marker | null>(null);
  const apiKey = getAPIKey('google');

  // Mock coordinates for demo (in real app, these would be fetched from places)
  const stopsWithCoordinates: PlanStop[] = [
    {
      id: 1,
      name: "Sky Bar",
      address: "123 Rooftop Ave",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      estimatedTime: "9:00 PM - 10:30 PM",
      status: 'upcoming'
    },
    {
      id: 2,
      name: "Pulse Dance Club",
      address: "456 Beat Street",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      estimatedTime: "10:45 PM - 1:00 AM",
      status: 'upcoming'
    },
    {
      id: 3,
      name: "Underground Lounge",
      address: "789 Bass Blvd",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      estimatedTime: "1:15 AM - 3:00 AM",
      status: 'upcoming'
    }
  ];

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      const initialCenter = userLocation || { lat: 40.7128, lng: -74.0060 };
      
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: initialCenter,
        zoom: 13,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#1a1a2e" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#16213e" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#2a2a5e" }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const directionsServiceInstance = new google.maps.DirectionsService();
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We'll add custom markers
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });

      directionsRendererInstance.setMap(mapInstance);

      setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
    });
  }, [apiKey, userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    // Remove existing user location marker
    if (userLocationMarker) {
      userLocationMarker.setMap(null);
    }

    // Create new user location marker
    const marker = new google.maps.Marker({
      position: userLocation,
      map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285f4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      },
      zIndex: 1000
    });

    setUserLocationMarker(marker);
  }, [map, userLocation]);

  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create markers for each stop
    const newMarkers = stopsWithCoordinates.map((stop, index) => {
      if (!stop.coordinates) return null;

      const marker = new google.maps.Marker({
        position: stop.coordinates,
        map,
        title: stop.name,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: index === 0 ? '#22c55e' : index === stopsWithCoordinates.length - 1 ? '#ef4444' : '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: black; padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${stop.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${stop.address}</p>
            ${stop.estimatedTime ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${stop.estimatedTime}</p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    }).filter(Boolean) as google.maps.Marker[];

    setMarkers(newMarkers);

    // Create route if we have at least 2 stops
    if (stopsWithCoordinates.length >= 2) {
      const waypoints = stopsWithCoordinates.slice(1, -1).map(stop => ({
        location: stop.coordinates!,
        stopover: true
      }));

      directionsService.route(
        {
          origin: stopsWithCoordinates[0].coordinates!,
          destination: stopsWithCoordinates[stopsWithCoordinates.length - 1].coordinates!,
          waypoints,
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }

    // Fit map to show all markers including user location
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      
      // Include user location in bounds if available
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      map.fitBounds(bounds);
    }
  }, [map, directionsService, directionsRenderer, userLocation]);

  const handleNavigateToStop = (stop: PlanStop) => {
    if (stop.coordinates) {
      const url = `https://maps.google.com/?q=${stop.coordinates.lat},${stop.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  if (!apiKey) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="p-4 border-b border-border/50">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-2">Google Maps API key not configured</p>
            <p className="text-sm text-muted-foreground">Add your Google Maps API key to see the plan route</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{plan.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{plan.date} • {plan.time}</span>
              </div>
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{plan.attendees} attending</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {stopsWithCoordinates.length} stops
          </Badge>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Stop List Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <div className="p-3">
            <h3 className="font-medium mb-2">Route Stops</h3>
            <div className="space-y-2">
              {stopsWithCoordinates.map((stop, index) => (
                <div key={stop.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-green-500' : 
                      index === stopsWithCoordinates.length - 1 ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{stop.name}</p>
                      {stop.estimatedTime && (
                        <p className="text-xs text-muted-foreground">{stop.estimatedTime}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleNavigateToStop(stop)}
                    className="h-7 text-xs"
                  >
                    <Navigation size={12} className="mr-1" />
                    Navigate
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanMapView;
