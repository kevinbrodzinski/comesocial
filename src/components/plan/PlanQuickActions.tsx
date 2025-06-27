
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NotificationService from '@/services/NotificationService';

interface PlanQuickActionsProps {
  planId: number;
  planName: string;
  hostId?: string;
  hostName?: string;
  onGroupChat: () => void;
}

const PlanQuickActions = ({ 
  planId, 
  planName, 
  hostId, 
  hostName = 'Host',
  onGroupChat 
}: PlanQuickActionsProps) => {
  const { toast } = useToast();
  const notificationService = NotificationService.getInstance();

  const handleMessageHost = () => {
    if (hostId) {
      // Create a direct message thread with the host
      notificationService.sendMessage(
        hostId, 
        hostName, 
        `Hi! I have a question about "${planName}"`,
        'message'
      );
      
      toast({
        title: "Message Sent",
        description: `Started conversation with ${hostName}`,
      });
    } else {
      toast({
        title: "Message Host",
        description: "Opening message composer...",
      });
    }
  };

  const handleAddToCalendar = () => {
    // Create a calendar event
    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${planName}
DESCRIPTION:Night plan created in app
END:VEVENT
END:VCALENDAR`;
    
    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = `${planName.replace(/\s+/g, '-')}.ics`;
    link.click();
    
    toast({
      title: "Added to Calendar",
      description: "Calendar event downloaded",
    });
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">Quick Actions</h4>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleMessageHost}
          className="quick-action flex-col h-auto py-3"
          aria-label="Message host"
        >
          <Send size={16} className="mb-1" />
          <span className="text-xs">Message Host</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onGroupChat}
          className="quick-action flex-col h-auto py-3"
          aria-label="Open group chat"
        >
          <Users size={16} className="mb-1" />
          <span className="text-xs">Group Chat</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToCalendar}
          className="quick-action flex-col h-auto py-3"
          aria-label="Add to calendar"
        >
          <Calendar size={16} className="mb-1" />
          <span className="text-xs">Add to Cal</span>
        </Button>
      </div>
    </div>
  );
};

export default PlanQuickActions;
