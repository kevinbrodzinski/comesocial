import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { MapPin, Plus, Navigation, Clock, Users, Settings, CheckCircle, AlertCircle, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLocationPermission } from '../hooks/useLocationPermission';
import InlineStopAdder from './plan/InlineStopAdder';
import SmartAlert from './plan/SmartAlert';
import StopDetailModal from './plan/StopDetailModal';
import PlanOverview from './plan/PlanOverview';
import { Stop, Plan } from '@/data/plansData';
import { getCurrentUserId } from '@/utils/userUtils';
import { getFeatureFlag } from '@/utils/featureFlags';
import { useHideOnScroll } from '@/utils/useHideOnScroll';
import { scrollTimeline } from '@/utils/scrollTimeline';

interface EnhancedStop extends Stop {
  status: 'upcoming' | 'current' | 'completed';
  distance?: string;
  eta?: string;
  coordinates?: { lat: number; lng: number };
}

interface EnhancedPlanViewProps {
  plan: Plan;
  onUpdatePlan?: (updatedPlan: any) => void;
}

const EnhancedPlanView = ({ plan, onUpdatePlan }: EnhancedPlanViewProps) => {
  const [autoCheckIn, setAutoCheckIn] = useState(false);
  const [showAddStop, setShowAddStop] = useState<number | null>(null);
  const [selectedStop, setSelectedStop] = useState<EnhancedStop | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [smartAlerts, setSmartAlerts] = useState<any[]>([]);
  const [currentUserRsvp, setCurrentUserRsvp] = useState<'going' | 'maybe' | 'cant_go' | null>('going');
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const { userLocation, requestLocation } = useLocationPermission();
  const { toast } = useToast();
  const planIdentifiersEnabled = getFeatureFlag('plan_identifiers_v1');
  const initialScrollFixEnabled = getFeatureFlag('plan_initial_scroll_fix_v1');
  const overviewVisible = useHideOnScroll(10, 0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Mock data for demo - convert Plan stops to EnhancedStops
  const [planStops, setPlanStops] = useState<EnhancedStop[]>([
    {
      id: 1,
      name: "Sky Bar",
      type: "bar",
      estimatedTime: 90,
      cost: 30,
      address: "123 Rooftop Ave",
      status: 'completed',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      dresscode: "Smart Casual",
      bookingStatus: "confirmed",
      maxCapacity: 25,
      notes: "Great rooftop views, arrive early for best seats"
    },
    {
      id: 2,
      name: "Pulse Dance Club",
      type: "club", 
      estimatedTime: 120,
      cost: 40,
      address: "456 Beat Street",
      status: 'current',
      distance: "1.2 mi",
      eta: "12 mins",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      dresscode: "Cocktail",
      bookingStatus: "pending",
      maxCapacity: 100,
      startTime: "22:00",
      endTime: "02:00"
    },
    {
      id: 3,
      name: "Underground Lounge",
      type: "club",
      estimatedTime: 90,
      cost: 35,
      address: "789 Bass Blvd",
      status: 'upcoming',
      distance: "0.8 mi",
      eta: "8 mins",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      dresscode: "Business",
      bookingStatus: "none",
      maxCapacity: 50,
      notes: "Intimate venue with live DJ sets"
    }
  ]);

  // Use improved central scroll utility
  useLayoutEffect(() => {
    scrollTimeline(timelineRef.current, planStops, plan.status);
  }, [planStops, plan.status]);

  // Legacy auto-scroll behavior (only when feature flag is disabled)
  useEffect(() => {
    if (!initialScrollFixEnabled && planIdentifiersEnabled) {
      const scrollToRelevantStop = () => {
        const currentStop = planStops.find(stop => stop.status === 'current');
        const upcomingStop = planStops.find(stop => stop.status === 'upcoming');
        
        if (plan.status === 'active' && currentStop) {
          // Scroll to current stop and add glow effect
          setTimeout(() => {
            const element = document.getElementById(`stop-${currentStop.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Add pulsating glow effect
              element.classList.add('animate-pulse', 'ring-2', 'ring-[#7B5BFF]/30');
              setTimeout(() => {
                element.classList.remove('animate-pulse', 'ring-2', 'ring-[#7B5BFF]/30');
              }, 2000);
            }
          }, 500);
        } else if (plan.status === 'planned' && upcomingStop) {
          // Scroll to first upcoming stop
          setTimeout(() => {
            const element = document.getElementById(`stop-${upcomingStop.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }
      };

      scrollToRelevantStop();
    }
  }, [plan.status, planStops, planIdentifiersEnabled, initialScrollFixEnabled]);

  // Calculate distances and ETAs based on user location
  useEffect(() => {
    if (userLocation && planStops.length > 0) {
      const currentStop = planStops.find(stop => stop.status === 'current');
      if (currentStop && currentStop.coordinates) {
        // Calculate distance (simplified calculation)
        const distance = calculateDistance(userLocation, currentStop.coordinates);
        if (distance < 0.1 && autoCheckIn) { // Within 100 meters
          handleAutoCheckIn(currentStop);
        }
        
        // Generate smart alert for next stop
        if (distance < 0.5) { // Within 0.5 miles
          generateSmartAlert(currentStop);
        }
      }
    }
  }, [userLocation, planStops, autoCheckIn]);

  const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }) => {
    // Simplified distance calculation (in miles)
    const R = 3959; // Earth's radius in miles
    const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleAutoCheckIn = (stop: EnhancedStop) => {
    setPlanStops(prev => prev.map(s => 
      s.id === stop.id ? { ...s, status: 'completed' as const } : s
    ));
    toast({
      title: "Auto Check-in",
      description: `Checked into ${stop.name}!`,
    });
  };

  const generateSmartAlert = (stop: EnhancedStop) => {
    setSmartAlerts(prev => {
      if (prev.some(alert => alert.stopId === stop.id)) return prev;
      return [...prev, {
        id: Date.now(),
        stopId: stop.id,
        message: `Your next stop is ${stop.distance} away`,
        action: 'Navigate',
        type: 'navigation'
      }];
    });
  };

  const handleAddStop = (newStop: any, afterIndex: number) => {
    const stop: EnhancedStop = {
      id: Date.now(),
      name: newStop.name,
      type: newStop.type || 'bar',
      estimatedTime: newStop.estimatedTime || 60,
      cost: newStop.cost || 0,
      address: newStop.address || 'Address TBD',
      status: 'upcoming',
      coordinates: newStop.coordinates
    };
    
    setPlanStops(prev => {
      const newStops = [...prev];
      newStops.splice(afterIndex + 1, 0, stop);
      return newStops;
    });
    
    setShowAddStop(null);
    toast({
      title: "Stop Added",
      description: `${newStop.name} added to your plan`,
    });
  };

  const handleManualCheckIn = (stopId: number) => {
    setPlanStops(prev => prev.map(stop => 
      stop.id === stopId ? { ...stop, status: 'completed' as const } : stop
    ));
    setSelectedStop(null);
    setUserHasInteracted(true);
    toast({
      title: "Checked In",
      description: "Status updated!",
    });
  };

  const handleNavigate = (stop: EnhancedStop) => {
    if (stop.coordinates) {
      const url = `https://maps.google.com/?q=${stop.coordinates.lat},${stop.coordinates.lng}`;
      window.open(url, '_blank');
    }
    setSelectedStop(null);
  };

  const handleStopClick = (stop: EnhancedStop) => {
    setSelectedStop(stop);
    setUserHasInteracted(true);
  };

  const getStopIcon = (status: EnhancedStop['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'current': return <MapPin size={16} className="text-primary animate-pulse" />;
      case 'upcoming': return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  const getTimelineColor = (status: EnhancedStop['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-primary';
      case 'upcoming': return 'bg-muted-foreground/30';
    }
  };

  const shouldHighlightStop = (stop: EnhancedStop) => {
    if (initialScrollFixEnabled) {
      // Only highlight current stops in active plans after user interaction
      return plan.status === 'active' && stop.status === 'current' && userHasInteracted;
    } else {
      // Legacy behavior - highlight current stops automatically
      return stop.status === 'current';
    }
  };

  const handleRSVPChange = (status: 'going' | 'maybe' | 'cant_go') => {
    setCurrentUserRsvp(status);
    toast({
      title: "RSVP Updated",
      description: `You responded "${status === 'cant_go' ? "Can't Go" : status.charAt(0).toUpperCase() + status.slice(1)}" to the plan`,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">{plan.name}</h1>
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{plan.attendees}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          {plan.date} • Starting at {plan.time}
        </div>
        
        {/* Auto Check-in Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings size={16} className="text-muted-foreground" />
            <span className="text-sm">Auto Check-in</span>
          </div>
          <Switch
            checked={autoCheckIn}
            onCheckedChange={(checked) => {
              setAutoCheckIn(checked);
              if (checked && !userLocation) {
                requestLocation();
              }
            }}
          />
        </div>
      </div>

      {/* Plan Overview Section */}
      {planIdentifiersEnabled && (
        <PlanOverview
          plan={plan}
          currentUserRsvp={currentUserRsvp}
          onRsvpChange={handleRSVPChange}
          isVisible={overviewVisible}
        />
      )}

      {/* Smart Alerts */}
      {smartAlerts.map((alert) => (
        <SmartAlert
          key={alert.id}
          alert={alert}
          onDismiss={() => setSmartAlerts(prev => prev.filter(a => a.id !== alert.id))}
          onAction={() => {
            const stop = planStops.find(s => s.id === alert.stopId);
            if (stop) handleNavigate(stop);
          }}
        />
      ))}

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto" ref={timelineRef}>
        <div className="p-4 pb-[env(safe-area-inset-bottom)]">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-4">
              {planStops.map((stop, index) => (
                <div key={stop.id} className="relative" id={`stop-${stop.id}`}>
                  {/* Timeline Node */}
                  <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-background ${getTimelineColor(stop.status)} z-10`}>
                    <div className="absolute inset-0.5 flex items-center justify-center">
                      {stop.status === 'current' && (
                        <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Stop Card */}
                  <Card 
                    className={`ml-12 cursor-pointer hover:shadow-md transition-shadow ${
                      shouldHighlightStop(stop) ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleStopClick(stop)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getStopIcon(stop.status)}
                            <h3 className="font-medium">{stop.name}</h3>
                            {stop.status === 'current' && shouldHighlightStop(stop) && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{stop.address}</p>
                          <p className="text-xs text-muted-foreground">{stop.estimatedTime} mins • ${stop.cost}</p>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          {stop.distance && (
                            <Badge variant="outline" className="text-xs">
                              {stop.distance}
                            </Badge>
                          )}
                          {stop.eta && stop.status !== 'completed' && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Car size={12} />
                              <span>{stop.eta}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inline Add Stop */}
                  {showAddStop === index && (
                    <div className="ml-12 mt-2">
                      <InlineStopAdder
                        onAdd={(newStop) => handleAddStop(newStop, index)}
                        onCancel={() => setShowAddStop(null)}
                      />
                    </div>
                  )}

                  {/* Add Stop Button */}
                  {showAddStop !== index && (
                    <button
                      onClick={() => setShowAddStop(index)}
                      className="ml-12 mt-2 flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <Plus size={14} />
                      <span>Add stop after {stop.name}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stop Detail Modal */}
      <StopDetailModal
        isOpen={!!selectedStop}
        onClose={() => setSelectedStop(null)}
        stop={selectedStop}
        onNavigate={selectedStop ? () => handleNavigate(selectedStop) : undefined}
        onCheckIn={selectedStop?.status === 'current' ? () => handleManualCheckIn(selectedStop.id) : undefined}
      />
    </div>
  );
};

export default EnhancedPlanView;
