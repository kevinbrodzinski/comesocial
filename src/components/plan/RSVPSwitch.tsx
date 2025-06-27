
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveRsvp } from '@/services/plan';
import NotificationService from '@/services/NotificationService';

interface RSVPSwitchProps {
  planId: number;
  planName?: string;
  currentRsvp?: 'going' | 'maybe' | 'cant_go' | null;
  onRsvpChange: (status: 'going' | 'maybe' | 'cant_go') => void;
  layout?: 'inline' | 'stack';
  size?: 'sm' | 'default';
}

const RSVPSwitch = ({ 
  planId, 
  planName = 'Plan',
  currentRsvp, 
  onRsvpChange, 
  layout = 'inline',
  size = 'sm'
}: RSVPSwitchProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const notificationService = NotificationService.getInstance();

  const handleRsvp = async (status: 'going' | 'maybe' | 'cant_go') => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Optimistic update
      onRsvpChange(status);
      
      // Save to backend
      const response = await saveRsvp(planId, status);
      
      if (response.success) {
        const statusLabels = {
          going: 'Going',
          maybe: 'Maybe',
          cant_go: "Can't Go"
        };
        
        // Create or update plan thread when user RSVPs
        if (status === 'going' || status === 'maybe') {
          const threadId = notificationService.createPlanThread(
            planId,
            planName,
            [
              { id: 'current-user', name: 'You' },
              { id: 'host', name: 'Host' }
            ],
            undefined,
            'upcoming',
            undefined,
            `You responded "${statusLabels[status]}" to ${planName}`
          );
          
          // Update thread with user's RSVP status
          const threads = notificationService.getMessageThreads();
          const planThread = threads.find(t => t.planId === planId);
          if (planThread) {
            planThread.userRsvp = status;
          }
        }
        
        toast({
          title: "RSVP Updated",
          description: `You responded "${statusLabels[status]}" to the plan`,
          duration: 2000
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error('Failed to save RSVP:', error);
      toast({
        title: "Error",
        description: "Failed to save RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass = layout === 'stack' ? 'w-full' : 'flex-1';
  const containerClass = layout === 'stack' ? 'flex flex-col space-y-2' : 'flex gap-2';

  return (
    <div className={containerClass}>
      <Button
        variant={currentRsvp === 'going' ? 'default' : 'outline'}
        size={size}
        onClick={() => handleRsvp('going')}
        disabled={isLoading}
        className={`${buttonClass} rsvp-going`}
      >
        {isLoading && <Loader2 size={12} className="mr-1 animate-spin" />}
        Going
      </Button>
      <Button
        variant={currentRsvp === 'maybe' ? 'default' : 'outline'}
        size={size}
        onClick={() => handleRsvp('maybe')}
        disabled={isLoading}
        className={`${buttonClass} rsvp-maybe`}
      >
        {isLoading && <Loader2 size={12} className="mr-1 animate-spin" />}
        Maybe
      </Button>
      <Button
        variant={currentRsvp === 'cant_go' ? 'default' : 'outline'}
        size={size}
        onClick={() => handleRsvp('cant_go')}
        disabled={isLoading}
        className={`${buttonClass} rsvp-cantgo`}
      >
        {isLoading && <Loader2 size={12} className="mr-1 animate-spin" />}
        Can't Go
      </Button>
    </div>
  );
};

export default RSVPSwitch;
