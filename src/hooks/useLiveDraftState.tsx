import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DraftState, DraftStop, DraftPresence, DraftVote } from '@/types/liveDraftTypes';
import { type Venue } from '@/data/venuesData';

export const useLiveDraftState = (draftId: string, currentUserId: number) => {
  const { toast } = useToast();
  
  const [draftState, setDraftState] = useState<DraftState>({
    id: draftId,
    is_locked: false,
    stops: [], // Truly start with blank canvas - no demo data
    votes: [],
    presence: [
      {
        user_id: 1,
        name: 'You',
        avatar: 'YU',
        is_active: true,
        last_seen: new Date()
      },
      {
        user_id: 2,
        name: 'Alex',
        avatar: 'AM',
        is_active: true,
        last_seen: new Date()
      },
      {
        user_id: 3,
        name: 'Sarah',
        avatar: 'SM',
        is_active: false,
        last_seen: new Date(Date.now() - 5 * 60 * 1000)
      }
    ],
    chat_open: false
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        const collaborators = draftState.presence.filter(p => p.user_id !== currentUserId);
        if (collaborators.length > 0) {
          const randomUser = collaborators[Math.floor(Math.random() * collaborators.length)];
          const updateTypes = ['edit', 'presence'];
          const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];

          if (updateType === 'edit' && draftState.stops.length > 0) {
            // Simulate someone editing
            setDraftState(prev => ({
              ...prev,
              presence: prev.presence.map(p => 
                p.user_id === randomUser.user_id 
                  ? { ...p, editing_field: 'venue', editing_stop_id: prev.stops[0]?.id }
                  : p
              )
            }));

            toast({
              title: "Real-time Update",
              description: `${randomUser.name} is editing the plan`,
              duration: 2000
            });

            // Clear editing state after 2 seconds
            setTimeout(() => {
              setDraftState(prev => ({
                ...prev,
                presence: prev.presence.map(p => 
                  p.user_id === randomUser.user_id 
                    ? { ...p, editing_field: undefined, editing_stop_id: undefined }
                    : p
                )
              }));
            }, 2000);
          }
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUserId, draftState.presence, draftState.stops.length, toast]);

  const updateStop = useCallback((stopId: string, field: string, value: any) => {
    setDraftState(prev => ({
      ...prev,
      stops: prev.stops.map(stop =>
        stop.id === stopId ? { ...stop, [field]: value } : stop
      )
    }));

    // Broadcast update (mock)
    console.log(`Broadcasting update - Stop ${stopId}, ${field}:`, value);
  }, []);

  const addCustomStop = useCallback(() => {
    const newStop: DraftStop = {
      id: `stop_${Date.now()}`,
      venue: '',
      time: '',
      duration: 0,
      notes: '',
      order: draftState.stops.length
    };

    setDraftState(prev => ({
      ...prev,
      stops: [...prev.stops, newStop]
    }));

    toast({
      title: "Stop Added",
      description: "New custom stop added to the plan",
      duration: 1500
    });
  }, [draftState.stops.length, toast]);

  const addVenueStop = useCallback((venue: Venue) => {
    const newStop: DraftStop = {
      id: `stop_${Date.now()}`,
      venue: venue.name,
      time: '',
      duration: 60, // Default 1 hour
      notes: `${venue.type} • ${venue.vibe} vibes • ${venue.distance}`,
      order: draftState.stops.length
    };

    setDraftState(prev => ({
      ...prev,
      stops: [...prev.stops, newStop]
    }));
  }, [draftState.stops.length]);

  const openVenueSearch = useCallback(() => {
    toast({
      title: "Venue Search",
      description: "Opening venue search (feature coming soon)",
      duration: 2000
    });
  }, [toast]);

  const deleteStop = useCallback((stopId: string) => {
    setDraftState(prev => ({
      ...prev,
      stops: prev.stops.filter(stop => stop.id !== stopId).map((stop, index) => ({
        ...stop,
        order: index
      }))
    }));

    toast({
      title: "Stop Deleted",
      description: "Stop removed from the plan",
      duration: 1500
    });
  }, [toast]);

  const reorderStops = useCallback((draggedId: string, targetId: string) => {
    setDraftState(prev => {
      const stops = [...prev.stops];
      const draggedIndex = stops.findIndex(s => s.id === draggedId);
      const targetIndex = stops.findIndex(s => s.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const [draggedStop] = stops.splice(draggedIndex, 1);
      stops.splice(targetIndex, 0, draggedStop);
      
      // Update order values
      const reorderedStops = stops.map((stop, index) => ({
        ...stop,
        order: index
      }));

      return {
        ...prev,
        stops: reorderedStops
      };
    });

    toast({
      title: "Stops Reordered",
      description: "Plan order updated",
      duration: 1500
    });
  }, [toast]);

  const setEditingState = useCallback((stopId: string, field: string) => {
    setDraftState(prev => ({
      ...prev,
      presence: prev.presence.map(p =>
        p.user_id === currentUserId
          ? { ...p, editing_field: field, editing_stop_id: stopId }
          : p
      )
    }));
  }, [currentUserId]);

  const clearEditingState = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      presence: prev.presence.map(p =>
        p.user_id === currentUserId
          ? { ...p, editing_field: undefined, editing_stop_id: undefined }
          : p
      )
    }));
  }, [currentUserId]);

  const toggleLock = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      is_locked: !prev.is_locked,
      locked_by: !prev.is_locked ? currentUserId : undefined,
      locked_at: !prev.is_locked ? new Date() : undefined
    }));

    toast({
      title: draftState.is_locked ? "Plan Unlocked" : "Plan Locked",
      description: draftState.is_locked ? "Plan is now editable" : "Plan locked - ready to launch!",
      duration: 2000
    });
  }, [currentUserId, draftState.is_locked, toast]);

  const toggleChat = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      chat_open: !prev.chat_open
    }));
  }, []);

  const addVote = useCallback((description: string, type: 'move_stop' | 'add_stop' | 'remove_stop', stopId: string) => {
    const newVote: DraftVote = {
      id: `vote_${Date.now()}`,
      type,
      proposed_by: currentUserId,
      stop_id: stopId,
      votes: [],
      total_participants: draftState.presence.length,
      description
    };

    setDraftState(prev => ({
      ...prev,
      votes: [...prev.votes, newVote]
    }));
  }, [currentUserId, draftState.presence.length]);

  const castVote = useCallback((voteId: string) => {
    setDraftState(prev => ({
      ...prev,
      votes: prev.votes.map(vote =>
        vote.id === voteId && !vote.votes.includes(currentUserId)
          ? { ...vote, votes: [...vote.votes, currentUserId] }
          : vote
      )
    }));

    toast({
      title: "Vote Cast",
      description: "Your vote has been recorded",
      duration: 1500
    });
  }, [currentUserId, toast]);

  const dismissVote = useCallback((voteId: string) => {
    setDraftState(prev => ({
      ...prev,
      votes: prev.votes.filter(vote => vote.id !== voteId)
    }));
  }, []);

  return {
    draftState,
    updateStop,
    addCustomStop,
    addVenueStop,
    openVenueSearch,
    deleteStop,
    reorderStops,
    setEditingState,
    clearEditingState,
    toggleLock,
    toggleChat,
    addVote,
    castVote,
    dismissVote
  };
};
