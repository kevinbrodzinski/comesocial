
import React from 'react';
import { MapPin, Users, Clock, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EventJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    venue: string;
    type: string;
    vibe: string;
    image: string;
    crowdLevel: number;
    distance: string;
    timePosted: string;
    friend: string;
    friendAvatar: string;
    caption: string;
  };
  onJoin: () => void;
  onWatch: () => void;
}

const EventJoinModal = ({ isOpen, onClose, post, onJoin, onWatch }: EventJoinModalProps) => {
  // Mock data for the enhanced join experience
  const eventData = {
    timeStarted: '45 min ago',
    timeLeft: '1h 15m remaining',
    attendees: [
      { name: 'Alex M', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      { name: 'Sarah K', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=40&h=40&fit=crop&crop=face' },
      { name: 'Mike R', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' }
    ],
    totalAttendees: 12,
    plansAfter: 'Skybar',
    plansAfterCount: 6,
    watchingCount: 8
  };

  const getCrowdLabel = (level: number) => {
    if (level > 80) return 'Packed';
    if (level > 60) return 'Buzzing';
    return 'Chill';
  };

  const getCrowdColor = (level: number) => {
    if (level > 80) return 'text-red-400';
    if (level > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-sm mx-auto bg-background border-border max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-left">{post.venue}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-3">
          {/* Event Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt={post.venue}
              className="w-full h-28 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-black/60 text-white text-xs">
                <Users size={10} className="mr-1" />
                {post.crowdLevel}% Full
              </Badge>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock size={12} />
                <span>Started {eventData.timeStarted}</span>
              </div>
              <div className="font-medium">
                {eventData.timeLeft}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">{post.type}</Badge>
              <Badge variant="outline" className="text-xs">{post.vibe}</Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin size={10} className="mr-1" />
                {post.distance}
              </div>
            </div>

            {/* Buzz Score */}
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Live Buzz</span>
                <span className={`text-sm font-medium ${getCrowdColor(post.crowdLevel)}`}>
                  {getCrowdLabel(post.crowdLevel)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {post.caption}
              </p>
            </div>

            {/* Who's Here */}
            <div>
              <h4 className="text-sm font-medium mb-2">Who's Here Now</h4>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {eventData.attendees.map((attendee, index) => (
                    <Avatar key={index} className="w-6 h-6 border border-background">
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                      <AvatarFallback className="text-xs">{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {eventData.attendees.map(a => a.name.split(' ')[0]).join(', ')} + {eventData.totalAttendees - eventData.attendees.length} more
                </span>
              </div>
            </div>

            {/* Plans After */}
            <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-3 border border-border/50">
              <h4 className="text-sm font-medium mb-1 text-foreground">Plans After</h4>
              <p className="text-xs text-foreground/80">
                {eventData.plansAfterCount} people planning to go to <span className="font-medium text-foreground">{eventData.plansAfter}</span> next
              </p>
            </div>

            {/* Watching Count */}
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Eye size={12} />
              <span>{eventData.watchingCount} friends watching this event</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={onClose}
            >
              Not Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={onWatch}
            >
              <Eye size={12} className="mr-1" />
              Watch Instead
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-xs"
              onClick={onJoin}
            >
              ✅ Join Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventJoinModal;
