
import { useState, useRef } from 'react';

export const usePlanEditorState = (initialPlan: any) => {
  const [editingStop, setEditingStop] = useState<any>(null);
  const [showVenueBrowser, setShowVenueBrowser] = useState(false);
  const [insertAfterIndex, setInsertAfterIndex] = useState<number>(-1);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [planData, setPlanData] = useState(initialPlan);
  const timelineRef = useRef<HTMLDivElement>(null);

  return {
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
  };
};
