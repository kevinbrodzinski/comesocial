
import React from 'react';
import { Users, Clock, TrendingUp, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiveActivity } from '@/hooks/useLiveActivityData';

interface LiveActivityCardProps {
  activity: LiveActivity;
  onJoinAction?: () => void;
}

const LiveActivityCard = ({ activity, onJoinAction }: LiveActivityCardProps) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'check-in':
        return <MapPin size={14} className="text-green-500" />;
      case 'group-move':
        return <Users size={14} className="text-blue-500" />;
      case 'watchlist-alert':
        return <TrendingUp size={14} className="text-orange-500" />;
      case 'milestone':
        return <Users size={14} className="text-purple-500" />;
      default:
        return <Clock size={14} className="text-muted-foreground" />;
    }
  };

  const getActionButton = () => {
    switch (activity.type) {
      case 'check-in':
        return (
          <Button size="sm" variant="outline" onClick={onJoinAction} className="shrink-0">
            Join them
          </Button>
        );
      case 'group-move':
        return (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shrink-0" onClick={onJoinAction}>
            Follow crew
          </Button>
        );
      case 'watchlist-alert':
        return (
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 shrink-0" onClick={onJoinAction}>
            Join now
          </Button>
        );
      case 'milestone':
        return (
          <Button size="sm" variant="outline" onClick={onJoinAction} className="shrink-0">
            I'm considering
          </Button>
        );
      default:
        return (
          <Button size="sm" variant="outline" onClick={onJoinAction} className="shrink-0">
            {activity.action}
          </Button>
        );
    }
  };

  return (
    <Card className={`border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ${activity.isUrgent ? 'ring-2 ring-orange-400/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {activity.friendAvatar && (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={activity.friendAvatar} alt={activity.friendName || ''} />
                <AvatarFallback>{activity.friendName?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getActivityIcon()}
                <div className="text-sm font-medium text-foreground leading-tight">
                  {activity.friendName && (
                    <span className="text-primary">{activity.friendName} </span>
                  )}
                  <span>{activity.message}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.timeAgo}</span>
                  <span>•</span>
                  <span className="font-medium">{activity.venue}</span>
                </div>
                
                {(activity.groupSize || activity.crowdLevel) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {activity.groupSize && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {activity.groupSize} people
                      </Badge>
                    )}
                    {activity.crowdLevel && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1.5 py-0.5 ${
                          activity.crowdLevel > 75 ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' : 
                          activity.crowdLevel > 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800' : 
                          'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                        }`}
                      >
                        {activity.crowdLevel}% full
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveActivityCard;
