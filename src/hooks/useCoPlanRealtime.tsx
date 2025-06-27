
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CoPlanUpdate } from '@/types/coPlanTypes';

export const useCoPlanRealtime = (draftId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const subscribeToUpdates = useCallback((onUpdate: (update: CoPlanUpdate) => void) => {
    // Mock Supabase realtime subscription
    console.log(`Subscribing to draft updates for: ${draftId}`);
    setIsConnected(true);

    // Simulate occasional updates from other users
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        const mockUpdate: CoPlanUpdate = {
          field: 'description',
          value: 'Updated from another user!',
          user_id: 2,
          timestamp: new Date()
        };
        onUpdate(mockUpdate);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
      console.log(`Unsubscribed from draft: ${draftId}`);
    };
  }, [draftId]);

  const broadcastUpdate = useCallback((field: string, value: any) => {
    // Mock broadcasting update to other participants
    console.log(`Broadcasting update - ${field}:`, value);
    
    // In real implementation, this would send to Supabase channel
    // supabase.channel(`draft:${draftId}`).send({
    //   type: 'broadcast',
    //   event: 'field_update',
    //   payload: { field, value, user_id: currentUserId, timestamp: new Date() }
    // });
  }, [draftId]);

  const showUpdateToast = useCallback(() => {
    toast({
      title: "Plan Updated",
      description: "A co-planner made changes to this draft",
      duration: 2000
    });
  }, [toast]);

  return {
    isConnected,
    subscribeToUpdates,
    broadcastUpdate,
    showUpdateToast
  };
};
