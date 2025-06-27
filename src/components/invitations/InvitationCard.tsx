
import React from 'react';
import { Clock, Users, MapPin, Calendar, CheckCircle, XCircle, HelpCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlanInvitation } from '../../services/InvitationService';

interface InvitationCardProps {
  invitation: PlanInvitation;
  onRespond: (response: 'accepted' | 'declined' | 'maybe') => void;
  onViewPlan: () => void;
}

const InvitationCard = ({ invitation, onRespond, onViewPlan }: InvitationCardProps) => {
  const { plan, organizer, organizerAvatar, mutualFriends, message, urgency, invitedAt, expiresAt, type = 'regular' } = invitation;
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getExpiryText = (expiresAt?: Date) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const diffInHours = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Expires soon';
    if (diffInHours < 24) return `Expires in ${diffInHours}h`;
    return `Expires in ${Math.floor(diffInHours / 24)}d`;
  };

  const isCoplan = type === 'co-plan';

  return (
    <Card className={`mb-4 border-l-4 ${isCoplan ? 'border-l-blue-500' : 'border-l-primary'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={organizerAvatar} />
              <AvatarFallback className="text-xs sm:text-sm">{organizerAvatar || organizer.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-medium text-sm sm:text-base">{organizer}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {isCoplan ? 'wants to co-plan with you' : 'invited you'}
                </span>
                {isCoplan && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    <UserPlus size={10} className="mr-1" />
                    Co-plan
                  </Badge>
                )}
                <Badge variant={getUrgencyColor(urgency)} className="text-xs">
                  {urgency}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{getTimeAgo(invitedAt)}</p>
            </div>
          </div>
          {expiresAt && (
            <Badge variant="outline" className="text-xs">
              {getExpiryText(expiresAt)}
            </Badge>
          )}
        </div>
        
        {message && (
          <div className="mt-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
            <p className="text-xs sm:text-sm italic">"{message}"</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base sm:text-lg">{plan.name}</h3>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar size={12} className="sm:w-4 sm:h-4" />
              <span>{plan.date} at {plan.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={12} className="sm:w-4 sm:h-4" />
              <span>{plan.attendees} {isCoplan ? 'co-planners' : 'going'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} className="sm:w-4 sm:h-4" />
              <span>{plan.duration}</span>
            </div>
          </div>
          
          {plan.stops.length > 0 && (
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
              <MapPin size={12} className="sm:w-4 sm:h-4" />
              <span>{plan.stops[0].name}{plan.stops.length > 1 ? ` +${plan.stops.length - 1} more` : ''}</span>
            </div>
          )}
        </div>

        {/* Mutual Friends */}
        {mutualFriends && mutualFriends.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {isCoplan ? 'Also co-planning:' : 'Also invited:'}
            </span>
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              {mutualFriends.slice(0, 3).map((friend, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {friend}
                </Badge>
              ))}
              {mutualFriends.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{mutualFriends.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              onClick={() => onRespond('accepted')}
              className="flex-1 bg-green-600 hover:bg-green-700 h-10 sm:h-9"
            >
              <CheckCircle size={16} className="mr-2" />
              {isCoplan ? 'Join Co-plan' : 'Going'}
            </Button>
            <Button
              onClick={() => onRespond('maybe')}
              variant="outline"
              className="flex-1 h-10 sm:h-9"
            >
              <HelpCircle size={16} className="mr-2" />
              Maybe
            </Button>
            <Button
              onClick={() => onRespond('declined')}
              variant="outline"
              className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-300 h-10 sm:h-9"
            >
              <XCircle size={16} className="mr-2" />
              {isCoplan ? 'Decline' : "Can't Go"}
            </Button>
          </div>
          
          <Button
            onClick={onViewPlan}
            variant="ghost"
            className="w-full h-10 sm:h-9"
          >
            View Full Plan Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationCard;
