
import React, { useLayoutEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { scrollTimeline } from '@/utils/scrollTimeline';
import { usePlanEditorState } from '@/hooks/usePlanEditorState';
import { usePlanEditorHandlers } from '@/hooks/usePlanEditorHandlers';
import PlanEditorHeader from './PlanEditorHeader';
import PlanEditorOverview from './PlanEditorOverview';
import PlanEditorTimeline from './PlanEditorTimeline';
import MobileStopDetailsModal from './MobileStopDetailsModal';
import MobileVenueBrowserModal from './MobileVenueBrowserModal';

interface PlanEditorContainerProps {
  plan: any;
  onClose: () => void;
  onUpdatePlan: (updatedPlan: any) => void;
}

const PlanEditorContainer = ({ plan, onClose, onUpdatePlan }: PlanEditorContainerProps) => {
  const isMobile = useIsMobile();
  
  const {
    editingStop,
    setEditingStop,
    showVenueBrowser,
    setShowVenueBrowser,
    insertAfterIndex,
    setInsertAfterIndex,
    draggedIndex,
    setDraggedIndex,
    planData,
    setPlanData,
    timelineRef
  } = usePlanEditorState(plan);

  const {
    handleStopSave,
    handleStopDelete,
    handleMoveUp,
    handleMoveDown,
    handleAddAfter,
    handleVenueSelect,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = usePlanEditorHandlers({
    planData,
    setPlanData,
    setInsertAfterIndex,
    setShowVenueBrowser,
    setDraggedIndex,
    insertAfterIndex,
    draggedIndex,
    onUpdatePlan
  });

  // Apply central scroll logic with improved mobile handling
  useLayoutEffect(() => {
    scrollTimeline(timelineRef.current, planData.stops, planData.status || 'planned');
  }, [planData.stops, planData.status]);

  const handleStopEdit = (stop: any) => {
    setEditingStop(stop);
  };

  const totalCost = planData.stops.reduce((sum: number, stop: any) => sum + (stop.cost || 0), 0);
  const totalTime = planData.stops.reduce((sum: number, stop: any) => sum + (stop.estimatedTime || 0), 0);

  return (
    <div className={`min-h-screen bg-background ${isMobile ? '' : 'max-w-4xl mx-auto'}`}>
      <div className="min-h-screen" ref={timelineRef}>
        <div className={`${isMobile ? '' : 'p-6'} space-y-6`}>
          {/* Header - Mobile vs Desktop */}
          <PlanEditorHeader
            planName={planData.name}
            planDate={planData.date}
            planTime={planData.time}
            stopsCount={planData.stops.length}
            onClose={onClose}
          />

          {/* Overview Cards - Mobile vs Desktop */}
          <PlanEditorOverview
            stopsCount={planData.stops.length}
            totalTime={totalTime}
            totalCost={totalCost}
            attendees={planData.attendees || 1}
            planStops={planData.stops}
          />

          {/* Route Timeline - Mobile vs Desktop */}
          <PlanEditorTimeline
            planStops={planData.stops}
            draggedIndex={draggedIndex}
            onStopEdit={handleStopEdit}
            onStopDelete={handleStopDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onAddAfter={handleAddAfter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onShowVenueBrowser={() => setShowVenueBrowser(true)}
          />
        </div>
      </div>

      {/* Modals - Mobile-optimized */}
      <MobileStopDetailsModal
        isOpen={!!editingStop}
        onClose={() => setEditingStop(null)}
        stop={editingStop}
        onSave={handleStopSave}
      />

      <MobileVenueBrowserModal
        open={showVenueBrowser}
        onOpenChange={setShowVenueBrowser}
        onVenueSelect={(venue) => {
          handleVenueSelect(venue);
          setShowVenueBrowser(false);
        }}
      />
    </div>
  );
};

export default PlanEditorContainer;
