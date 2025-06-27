
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import RouteTimeline from './RouteTimeline';
import MobileRouteTimeline from './MobileRouteTimeline';

interface PlanEditorTimelineProps {
  planStops: any[];
  draggedIndex: number | null;
  onStopEdit: (stop: any) => void;
  onStopDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddAfter: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  onShowVenueBrowser: () => void;
}

const PlanEditorTimeline = ({
  planStops,
  draggedIndex,
  onStopEdit,
  onStopDelete,
  onMoveUp,
  onMoveDown,
  onAddAfter,
  onDragStart,
  onDragOver,
  onDrop,
  onShowVenueBrowser
}: PlanEditorTimelineProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileRouteTimeline
        planStops={planStops}
        onStopEdit={onStopEdit}
        onStopDelete={onStopDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onAddAfter={onAddAfter}
        onShowVenueBrowser={onShowVenueBrowser}
      />
    );
  }

  return (
    <RouteTimeline
      planStops={planStops}
      draggedIndex={draggedIndex}
      onStopEdit={onStopEdit}
      onStopDelete={onStopDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onAddAfter={onAddAfter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onShowVenueBrowser={onShowVenueBrowser}
    />
  );
};

export default PlanEditorTimeline;
