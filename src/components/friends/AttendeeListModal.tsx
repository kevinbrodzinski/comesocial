
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Users } from 'lucide-react';

interface AttendeeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: string;
  attendees: any[];
  onMessageAll: () => void;
  onPingAll: () => void;
}

const AttendeeListModal = ({ 
  isOpen, 
  onClose, 
  venue, 
  attendees, 
  onMessageAll, 
  onPingAll 
}: AttendeeListModalProps) => {
  const getStatusBadge = (action: string) => {
    switch (action) {
      case 'checked-in':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Checked In</Badge>;
      case 'on-the-way':
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">On The Way</Badge>;
      case 'pre-gaming':
        return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">Pre-Gaming</Badge>;
      default:
        return <Badge variant="secondary">Here</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{venue} - {attendees.length} friends</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Attendee List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {attendees.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {friend.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">{friend.timeAgo}</p>
                  </div>
                </div>
                {getStatusBadge(friend.currentAction)}
              </div>
            ))}
          </div>

          {/* Group Actions */}
          <div className="space-y-2 pt-4 border-t">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={onMessageAll}
            >
              <MessageCircle size={16} className="mr-2" />
              Chat with {venue} crew
            </Button>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={onPingAll}
            >
              <Users size={16} className="mr-2" />
              Ping all
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeeListModal;
