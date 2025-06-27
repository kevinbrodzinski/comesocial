import React, { useState } from 'react';
import { Calendar, Clock, Users, Share2, Edit, ChevronDown, ChevronUp, Copy, Navigation, CheckCircle, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEventTimer } from '../../hooks/useEventTimer';
import { Plan } from '../../data/plansData';
import ExpandableStopCard from './ExpandableStopCard';

interface PlanCardWithTimerProps {
  plan: Plan;
  showOrganizer?: boolean;
  userRSVPs: Record<number, 'going' | 'maybe' | 'cantGo'>;
  planStatuses: Record<number, 'onTheWay' | 'checkedIn' | 'none'>;
  expandedPlans: Set<number>;
  onPlanClick: (plan: Plan) => void;
  onRSVP: (planId: number, response: 'going' | 'maybe' | 'cantGo') => void;
  onStatusChange: (planId: number, status: 'onTheWay' | 'checkedIn' | 'none') => void;
  onToggleExpansion: (planId: number) => void;
  onBlastPlan: (plan: Plan) => void;
  onEditPlan: (plan: Plan) => void;
  onGenerateShareLink: (planId: number) => void;
}

const PlanCardWithTimer = ({
  plan,
  showOrganizer = false,
  userRSVPs,
  planStatuses,
  expandedPlans,
  onPlanClick,
  onRSVP,
  onStatusChange,
  onToggleExpansion,
  onBlastPlan,
  onEditPlan,
  onGenerateShareLink
}: PlanCardWithTimerProps) => {
  const timeUntil = useEventTimer(plan.date, plan.time);
  const currentStatus = planStatuses[plan.id] || 'none';
  const isExpanded = expandedPlans.has(plan.id);
  const userRSVP = userRSVPs[plan.id];
  const [expandedStops, setExpandedStops] = useState<Set<number>>(new Set());

  // Handle individual stop expansion
  const handleStopToggle = (stopId: number) => {
    setExpandedStops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stopId)) {
        newSet.delete(stopId);
      } else {
        newSet.add(stopId);
      }
      return newSet;
    });
  };

  // Determine status colors and border
  const getStatusColors = () => {
    if (plan.status === 'active') {
      return {
        borderColor: 'border-l-primary',
        shadow: 'shadow-lg shadow-primary/20',
        background: 'bg-gradient-to-r from-primary/5 to-transparent'
      };
    }
    if (plan.status === 'invited') {
      return {
        borderColor: 'border-l-green-500',
        shadow: 'shadow-lg shadow-green-500/20',
        background: 'bg-gradient-to-r from-green-500/5 to-transparent'
      };
    }
    return {
      borderColor: 'border-l-muted-foreground/30',
      shadow: 'shadow-md shadow-black/20',
      background: 'bg-gradient-to-r from-muted/10 to-transparent'
    };
  };

  const statusColors = getStatusColors();

  // Get status emoji
  const getStatusEmoji = () => {
    if (plan.status === 'active') return '🎉';
    if (plan.status === 'invited') return '✉️';
    if (currentStatus === 'onTheWay') return '🚶‍♂️';
    if (currentStatus === 'checkedIn') return '📍';
    return '📅';
  };

  return (
    <Card 
      className={`
        border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer 
        hover:scale-[1.02] active:scale-[0.98] border-l-4 ${statusColors.borderColor} 
        ${statusColors.shadow} bg-card/80 backdrop-blur-sm hover:bg-card/90
        rounded-xl overflow-hidden
      `}
      style={{
        background: `linear-gradient(135deg, rgba(21, 21, 21, 0.95) 0%, rgba(12, 12, 12, 0.98) 100%)`
      }}
    >
      <CardContent className="p-5">
        {/* Status Background Overlay */}
        <div className={`absolute inset-0 ${statusColors.background} pointer-events-none`} />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0" onClick={() => onPlanClick(plan)}>
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">{getStatusEmoji()}</span>
                <h3 className="font-semibold text-foreground text-lg leading-tight truncate">{plan.name}</h3>
              </div>
              {showOrganizer && (
                <p className="text-sm text-muted-foreground mb-2 truncate">by {plan.organizer}</p>
              )}
              <div className="flex items-center text-sm text-muted-foreground mb-3 flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center bg-muted/20 rounded-full px-3 py-1">
                  <Calendar size={14} className="mr-2 flex-shrink-0" />
                  <span className="truncate font-medium">{plan.date}</span>
                </div>
                <div className="flex items-center bg-muted/20 rounded-full px-3 py-1">
                  <Clock size={14} className="mr-2 flex-shrink-0" />
                  <span className="truncate font-medium">{plan.time}</span>
                </div>
              </div>
              {/* Enhanced Timer */}
              <div className="flex items-center text-sm bg-primary/10 text-primary rounded-full px-3 py-1 w-fit">
                <Timer size={14} className="mr-2 flex-shrink-0" />
                <span className="font-semibold truncate">Starts in {timeUntil}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
              {plan.status === 'active' && (
                <Badge className="bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 text-xs px-3 py-1">
                  🔥 Active
                </Badge>
              )}
              {plan.status === 'invited' && (
                <Badge className="bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30 text-xs px-3 py-1">
                  ✨ Invited
                </Badge>
              )}
              {plan.status === 'maybe' && (
                <Badge className="bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500/30 text-xs px-3 py-1">
                  🤔 Maybe
                </Badge>
              )}
              {/* Status Badge */}
              {currentStatus === 'onTheWay' && (
                <Badge className="bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30 text-xs px-3 py-1">
                  🚶‍♂️ On the Way
                </Badge>
              )}
              {currentStatus === 'checkedIn' && (
                <Badge className="bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/30 text-xs px-3 py-1">
                  📍 Checked In
                </Badge>
              )}
              {/* RSVP Badge */}
              {userRSVP && (
                <Badge className={`text-xs px-3 py-1 shadow-lg ${
                  userRSVP === 'going' ? 'bg-green-500 text-white border-green-500 shadow-green-500/30' :
                  userRSVP === 'maybe' ? 'bg-yellow-500 text-white border-yellow-500 shadow-yellow-500/30' :
                  'bg-red-500 text-white border-red-500 shadow-red-500/30'
                }`}>
                  {userRSVP === 'going' ? '✅ Going' : userRSVP === 'maybe' ? '🤔 Maybe' : "❌ Can't Go"}
                </Badge>
              )}
            </div>
          </div>

          {/* Fold Animation Toggle */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion(plan.id);
              }}
              className="w-full justify-between p-3 h-10 text-sm bg-muted/10 hover:bg-muted/20 rounded-lg border border-border/30"
            >
              <span className="font-medium">
                {isExpanded ? 'Hide' : 'Show'} Plan Details
              </span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          {/* Expandable Stops Section with Individual Stop Cards */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-3">
              {plan.stops.map((stop, index) => (
                <ExpandableStopCard
                  key={stop.id}
                  stop={stop}
                  index={index}
                  isExpanded={expandedStops.has(stop.id)}
                  onToggle={() => handleStopToggle(stop.id)}
                />
              ))}
            </div>
          </div>
          
          {/* RSVP Buttons */}
          {showOrganizer && (
            <div className="flex space-x-2 mb-4">
              <Button
                variant={userRSVP === 'going' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-9 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onRSVP(plan.id, 'going');
                }}
              >
                Going
              </Button>
              <Button
                variant={userRSVP === 'maybe' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-9 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onRSVP(plan.id, 'maybe');
                }}
              >
                Maybe
              </Button>
              <Button
                variant={userRSVP === 'cantGo' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-9 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onRSVP(plan.id, 'cantGo');
                }}
              >
                Can't Go
              </Button>
            </div>
          )}

          {/* Status Buttons */}
          {!showOrganizer && (
            <div className="flex space-x-2 mb-4">
              <Button
                variant={currentStatus === 'onTheWay' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-9 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(plan.id, currentStatus === 'onTheWay' ? 'none' : 'onTheWay');
                }}
              >
                <Navigation size={14} className="mr-2" />
                On the Way
              </Button>
              <Button
                variant={currentStatus === 'checkedIn' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 h-9 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(plan.id, currentStatus === 'checkedIn' ? 'none' : 'checkedIn');
                }}
              >
                <CheckCircle size={14} className="mr-2" />
                Checked In
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center text-sm text-muted-foreground min-w-0 flex-1">
              <Users size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate font-medium">{plan.attendees} going</span>
              {plan.rsvpResponses && (
                <span className="ml-2 text-xs whitespace-nowrap bg-muted/20 rounded-full px-2 py-1">
                  {plan.rsvpResponses.going}G • {plan.rsvpResponses.maybe}M • {plan.rsvpResponses.cantGo}N
                </span>
              )}
            </div>
            <div className="flex space-x-2 ml-3 flex-shrink-0">
              {/* Add Blast This Plan button for user's own plans */}
              {!showOrganizer && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs font-medium bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlastPlan(plan);
                  }}
                >
                  <Zap size={12} className="mr-1" />
                  Blast This
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateShareLink(plan.id);
                }}
              >
                <Copy size={12} className="mr-1" />
                Share
              </Button>
              {!showOrganizer && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 text-xs font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPlan(plan);
                  }}
                >
                  <Edit size={12} className="mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCardWithTimer;
