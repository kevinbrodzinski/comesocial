
import { useToast } from '@/hooks/use-toast';

interface UsePlanEditorHandlersProps {
  planData: any;
  setPlanData: (plan: any) => void;
  setInsertAfterIndex: (index: number) => void;
  setShowVenueBrowser: (show: boolean) => void;
  setDraggedIndex: (index: number | null) => void;
  insertAfterIndex: number;
  draggedIndex: number | null;
  onUpdatePlan: (updatedPlan: any) => void;
}

export const usePlanEditorHandlers = ({
  planData,
  setPlanData,
  setInsertAfterIndex,
  setShowVenueBrowser,
  setDraggedIndex,
  insertAfterIndex,
  draggedIndex,
  onUpdatePlan
}: UsePlanEditorHandlersProps) => {
  const { toast } = useToast();

  const handleStopSave = (updatedStop: any) => {
    const updatedStops = planData.stops.map((stop: any) => 
      stop.id === updatedStop.id ? updatedStop : stop
    );
    
    const updatedPlan = { ...planData, stops: updatedStops };
    setPlanData(updatedPlan);
    onUpdatePlan(updatedPlan);
    
    toast({
      title: "Stop updated",
      description: `${updatedStop.name} has been updated`,
    });
  };

  const handleStopDelete = (index: number) => {
    const updatedStops = planData.stops.filter((_: any, i: number) => i !== index);
    const updatedPlan = { ...planData, stops: updatedStops };
    setPlanData(updatedPlan);
    onUpdatePlan(updatedPlan);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const updatedStops = [...planData.stops];
    [updatedStops[index - 1], updatedStops[index]] = [updatedStops[index], updatedStops[index - 1]];
    
    const updatedPlan = { ...planData, stops: updatedStops };
    setPlanData(updatedPlan);
    onUpdatePlan(updatedPlan);
  };

  const handleMoveDown = (index: number) => {
    if (index === planData.stops.length - 1) return;
    
    const updatedStops = [...planData.stops];
    [updatedStops[index], updatedStops[index + 1]] = [updatedStops[index + 1], updatedStops[index]];
    
    const updatedPlan = { ...planData, stops: updatedStops };
    setPlanData(updatedPlan);
    onUpdatePlan(updatedPlan);
  };

  const handleAddAfter = (index: number) => {
    setInsertAfterIndex(index);
    setShowVenueBrowser(true);
  };

  const handleVenueSelect = (venue: any) => {
    const newStop = {
      id: Date.now(),
      name: venue.name,
      type: venue.type || 'venue',
      estimatedTime: venue.estimatedTime || 90,
      cost: venue.avgCost || 25,
      notes: ''
    };
    
    const updatedStops = [...planData.stops];
    updatedStops.splice(insertAfterIndex + 1, 0, newStop);
    
    const updatedPlan = { ...planData, stops: updatedStops };
    setPlanData(updatedPlan);
    onUpdatePlan(updatedPlan);
    
    toast({
      title: "Stop added",
      description: `${venue.name} has been added to your plan`,
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

    const updatedStops = [...planData.stops];
    const draggedStop = updatedStops[draggedIndex];
    
    updatedStops.splice(draggedIndex, 1);
    updatedStops.splice(dropIndex, 0, draggedStop);
    
    const updatedPlan = { ...planData, stops: updatedStops };
    setPlanData(updatedPlan);
    onUpdatePlan(updatedPlan);
    setDraggedIndex(null);
  };

  return {
    handleStopSave,
    handleStopDelete,
    handleMoveUp,
    handleMoveDown,
    handleAddAfter,
    handleVenueSelect,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};
