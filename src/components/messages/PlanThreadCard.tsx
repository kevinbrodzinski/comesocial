import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageThread } from '@/types/messaging';
import { withFeatureFlag } from '@/utils/featureFlags';
import { useNavigate } from 'react-router-dom';
import { WeekdayBadge } from '@/components/ui/weekday-badge';

interface PlanThreadCardProps {
  thread: MessageThread;
  onClick?: () => void;
}

const PlanThreadCard = ({ thread, onClick }: PlanThreadCardProps) => {
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(thread.timestamp, { addSuffix: true });
  const participantCount = thread.participants?.length || 0;
  const displayParticipants = thread.participants?.slice(0, 3) || [];
  const extraCount = Math.max(0, participantCount - 3);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'Live Now';
      case 'upcoming': return 'Starting Soon';
      case 'completed': return 'Completed';
      default: return 'Planned';
    }
  };

  const getRsvpBadge = (rsvp?: string) => {
    if (!rsvp) return null;
    
    const rsvpStyles = {
      going: 'rsvp-going',
      maybe: 'rsvp-maybe', 
      cant_go: 'rsvp-cantgo'
    };
    
    const rsvpLabels = {
      going: 'Going',
      maybe: 'Maybe',
      cant_go: "Can't Go"
    };
    
    return (
      <Badge className={`text-xs ${rsvpStyles[rsvp as keyof typeof rsvpStyles]}`}>
        {rsvpLabels[rsvp as keyof typeof rsvpLabels]}
      </Badge>
    );
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (thread.planId) {
      // Navigate to plan view with chat hash
      navigate(`/planner/${thread.planId}#chat`);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 border-l-4 ${
        thread.unread 
          ? `border-l-primary bg-primary/5 hover:bg-primary/10 ${withFeatureFlag('contrast-pass-01', 'border-l-primary/80')}` 
          : 'border-l-transparent hover:bg-muted/50'
      } hover:shadow-md`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-base truncate">{thread.planName}</h3>
              <div className="flex items-center space-x-2 flex-wrap">
                {thread.planTime && (
                  <WeekdayBadge date={thread.planTime} />
                )}
                {getRsvpBadge(thread.userRsvp)}
                <Badge 
                  className={`text-xs text-white ${getStatusColor(thread.planStatus)}`}
                >
                  {getStatusText(thread.planStatus)}
                </Badge>
              </div>
            </div>
            
            {thread.venue && (
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{thread.venue.name}</span>
              </div>
            )}
            
            {thread.planTime && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Clock size={12} className="mr-1" />
                <span>{thread.planTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Participants Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Users size={14} className="text-muted-foreground" />
            <div className="flex -space-x-2">
              {displayParticipants.map((participant, index) => (
                <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extraCount > 0 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">+{extraCount}</span>
                </div>
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        {/* Last Message */}
        <p className="text-sm text-muted-foreground truncate bg-muted/30 rounded-md px-2 py-1">
          {thread.lastMessage}
        </p>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mt-3">
          <Badge 
            variant="outline" 
            className={`text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground ${withFeatureFlag('contrast-pass-01', 'bg-background/60')}`}
          >
            I'll be there soon! 🚗
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground ${withFeatureFlag('contrast-pass-01', 'bg-background/60')}`}
          >
            Count me in! 👍
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanThreadCard;
