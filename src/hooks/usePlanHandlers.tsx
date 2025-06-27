
import { useToast } from '@/hooks/use-toast';

export const usePlanHandlers = (
  planData: any,
  handleInputChange: (field: string, value: any) => void,
  setDraggedIndex: (index: number | null) => void,
  draggedIndex: number | null,
  trackPlanEvent: (eventType: string, data: any) => void,
  step: number
) => {
  const { toast } = useToast();

  const handleLocationSelect = (location: string) => {
    handleInputChange('meetupLocation', location);
  };

  const handleVenueSelect = (venue: any) => {
    const newStop = {
      id: Date.now(),
      name: venue.name,
      type: venue.type || 'venue',
      estimatedTime: venue.estimatedTime || 90,
      cost: venue.avgCost || 25
    };
    
    handleInputChange('stops', [...planData.stops, newStop]);
  };

  const handleCustomVenueCreate = (venue: any) => {
    const newStop = {
      id: Date.now(),
      name: venue.name,
      type: venue.type,
      estimatedTime: venue.estimatedTime,
      cost: venue.avgCost
    };
    
    handleInputChange('stops', [...planData.stops, newStop]);
  };

  const handleFriendToggle = (friend: any) => {
    const isInvited = planData.invitedFriends.some(f => f.id === friend.id);
    if (isInvited) {
      handleInputChange('invitedFriends', planData.invitedFriends.filter(f => f.id !== friend.id));
    } else {
      handleInputChange('invitedFriends', [...planData.invitedFriends, friend]);
    }
  };

  const handleStopRemove = (stopIndex: number) => {
    handleInputChange('stops', planData.stops.filter((_, index) => index !== stopIndex));
  };

  const handleGroupPresetSelect = (group: any) => {
    handleInputChange('invitedFriends', group.members);
    toast({
      title: "Group added!",
      description: `Added ${group.members.length} friends from "${group.name}"`,
    });
  };

  const handlePaymentSetup = (paymentData: any) => {
    handleInputChange('paymentSetup', paymentData);
    handleInputChange('splitPayment', true);
    
    toast({
      title: "Payment setup complete!",
      description: "Your group can now split costs automatically",
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newStops = [...planData.stops];
    const draggedStop = newStops[draggedIndex];
    
    newStops.splice(draggedIndex, 1);
    newStops.splice(dropIndex, 0, draggedStop);
    
    handleInputChange('stops', newStops);
    setDraggedIndex(null);
  };

  const handleSendNotification = (type: string, recipients: string[], data: any) => {
    console.log('Sending notification:', { type, recipients, data });
    toast({
      title: "Notification Sent",
      description: `Updated ${recipients.length} friends about plan changes`
    });
  };

  const handleTrackShare = (platform: string) => {
    trackPlanEvent('plan_shared', {
      platform,
      plan_name: planData.name,
      timestamp: new Date().toISOString()
    });
  };

  const handleCreatePlan = (
    editingPlan: any,
    onCreatePlan: (planData: any) => void,
    onClose: () => void
  ) => {
    if (!planData.name || !planData.date || planData.stops.length === 0) {
      toast({
        title: "Plan incomplete",
        description: "Please add a name, date, and at least one stop",
        variant: "destructive"
      });
      return;
    }

    trackPlanEvent(editingPlan ? 'plan_updated' : 'plan_created', {
      ...planData,
      [editingPlan ? 'update_timestamp' : 'creation_timestamp']: new Date().toISOString(),
      total_steps_completed: step
    });

    onCreatePlan(planData);
    
    toast({
      title: editingPlan ? "Plan updated! 🎉" : "Plan created! 🎉",
      description: `"${planData.name}" is ready to go!`,
    });
    
    onClose();
  };

  return {
    handleLocationSelect,
    handleVenueSelect,
    handleCustomVenueCreate,
    handleFriendToggle,
    handleStopRemove,
    handleGroupPresetSelect,
    handlePaymentSetup,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleSendNotification,
    handleTrackShare,
    handleCreatePlan
  };
};
