
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, MessageSquare, CheckSquare } from 'lucide-react';
import RSVPSwitch from './RSVPSwitch';
import PlanQuickActions from './PlanQuickActions';
import { Plan } from '@/data/plansData';
import { getCurrentUserId } from '@/utils/userUtils';
import { getFeatureFlag } from '@/utils/featureFlags';
import { useNavigate } from 'react-router-dom';

interface PlanOverviewProps {
  plan: Plan;
  currentUserRsvp?: 'going' | 'maybe' | 'cant_go' | null;
  onRsvpChange: (status: 'going' | 'maybe' | 'cant_go') => void;
  isVisible: boolean;
}

const PlanOverview = ({ plan, currentUserRsvp, onRsvpChange, isVisible }: PlanOverviewProps) => {
  const planIdentifiersEnabled = getFeatureFlag('plan_identifiers_v1');
  const currentUserId = getCurrentUserId();
  const navigate = useNavigate();
  
  if (!planIdentifiersEnabled) return null;

  // Mock attendees data with RSVP status
  const attendees = [
    { id: 1, name: 'You', avatar: 'Y', rsvp: currentUserRsvp || 'going' },
    { id: 2, name: 'Sarah M.', avatar: 'SM', rsvp: 'going' },
    { id: 3, name: 'Mike K.', avatar: 'MK', rsvp: 'maybe' },
    { id: 4, name: 'Alex R.', avatar: 'AR', rsvp: 'going' },
    { id: 5, name: 'Emma L.', avatar: 'EL', rsvp: 'cant_go' },
    { id: 6, name: 'Tom W.', avatar: 'TW', rsvp: 'going' },
  ];

  const getRsvpColor = (rsvp: string) => {
    switch (rsvp) {
      case 'going': return 'ring-green-500';
      case 'maybe': return 'ring-yellow-500';
      case 'cant_go': return 'ring-gray-400';
      default: return 'ring-gray-300';
    }
  };

  const isInvitedUser = plan.organizer && plan.organizer !== 'Current User';
  const hasUserResponded = currentUserRsvp !== null && currentUserRsvp !== undefined;

  const nightTasks = [
    'Pre-drinks start at 9 PM',
    'Uber to first venue together',
    'Group photo at Sky Bar rooftop',
    'Keep group chat active for location updates'
  ];

  const handleGroupChat = () => {
    // Navigate to Messages → Plans tab and find this plan's thread
    navigate('/messages?tab=plans&highlight=' + plan.id);
  };

  return (
    <div 
      className={`sticky top-16 z-40 bg-background border-b border-border transition-transform duration-200 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Card className="rounded-none border-x-0 border-t-0">
        <CardContent className="p-4 space-y-4">
          {/* Attendees Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Users size={16} className="text-muted-foreground" />
              <h3 className="font-medium">Attendees ({attendees.length})</h3>
            </div>
            <div className="flex items-center space-x-2">
              {attendees.slice(0, 6).map((attendee) => (
                <div key={attendee.id} className="relative">
                  <Avatar className={`w-8 h-8 ring-2 ${getRsvpColor(attendee.rsvp)}`}>
                    <AvatarFallback className="text-xs">{attendee.avatar}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
              {attendees.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{attendees.length - 6}
                </Badge>
              )}
            </div>
          </div>

          {/* Host Message */}
          {plan.description && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare size={16} className="text-muted-foreground" />
                <h3 className="font-medium">Host Note</h3>
              </div>
              <div className="bg-[#F4F4F6] rounded-lg p-3 text-sm text-foreground">
                {plan.description}
              </div>
            </div>
          )}

          {/* Night-wide Tasks */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="plan-overview-tasks" className="border-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center space-x-2">
                  <CheckSquare size={16} className="text-muted-foreground" />
                  <span className="font-medium">Night-wide Tasks</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <ul className="space-y-2">
                  {nightTasks.map((task, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Quick Actions Row */}
          <PlanQuickActions
            planId={plan.id}
            planName={plan.name}
            hostId={plan.organizer === 'Current User' ? undefined : '2'}
            hostName={plan.organizer || 'Host'}
            onGroupChat={handleGroupChat}
          />

          {/* Inline RSVP for Invited Users */}
          {isInvitedUser && !hasUserResponded && (
            <div>
              <h3 className="font-medium mb-3">Will you be joining?</h3>
              <RSVPSwitch
                planId={plan.id}
                currentRsvp={currentUserRsvp}
                onRsvpChange={onRsvpChange}
                layout="inline"
                size="sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanOverview;
