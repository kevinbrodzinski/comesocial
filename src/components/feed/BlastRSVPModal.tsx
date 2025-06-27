
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, MapPin } from 'lucide-react';

interface BlastRSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  blast: {
    id: number;
    friend: string;
    friendAvatar: string;
    message: string;
    timePosted: string;
    location?: string;
    type: 'going-out' | 'rally' | 'looking-for';
    timeSlot?: string;
    rsvpList: string[];
    maybeList: string[];
  } | null;
}

const BlastRSVPModal = ({ isOpen, onClose, blast }: BlastRSVPModalProps) => {
  if (!blast) return null;

  const getBlastTypeLabel = (type: string) => {
    switch (type) {
      case 'rally':
        return '🔥 Rally';
      case 'going-out':
        return '🍻 Going Out';
      default:
        return '💭 Looking For';
    }
  };

  const getBlastTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'rally':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
      case 'going-out':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    }
  };

  // Mock avatar URLs for demo
  const getAvatarUrl = (name: string) => {
    const avatars = {
      'Alex': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      'Mike': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      'Emma': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      'Chris': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'Taylor': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      'You': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
    return avatars[name as keyof typeof avatars] || avatars['Alex'];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users size={20} className="text-orange-600" />
            <span>Who's Going</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Blast Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getBlastTypeBadgeStyle(blast.type)}`}>
                {getBlastTypeLabel(blast.type)}
              </Badge>
              {blast.timeSlot && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock size={12} className="mr-1" />
                  <span>{blast.timeSlot}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-2">{blast.message}</p>
            {blast.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin size={14} className="mr-1" />
                <span>{blast.location}</span>
              </div>
            )}
          </div>

          {/* RSVP Lists */}
          <div className="space-y-4">
            {/* Going List */}
            {blast.rsvpList.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Going ({blast.rsvpList.length})
                </h3>
                <div className="space-y-2">
                  {blast.rsvpList.map((name, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={getAvatarUrl(name)} alt={name} />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">{name}</span>
                      {name === blast.friend && (
                        <Badge variant="outline" className="text-xs">Host</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maybe List */}
            {blast.maybeList.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Maybe ({blast.maybeList.length})
                </h3>
                <div className="space-y-2">
                  {blast.maybeList.map((name, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={getAvatarUrl(name)} alt={name} />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-muted-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {blast.rsvpList.length === 0 && blast.maybeList.length === 0 && (
              <div className="text-center py-4">
                <div className="text-muted-foreground mb-2">No responses yet</div>
                <div className="text-sm text-muted-foreground">
                  Be the first to respond!
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlastRSVPModal;
