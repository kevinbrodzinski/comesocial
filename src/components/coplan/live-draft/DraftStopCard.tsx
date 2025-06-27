
import React, { useState, useEffect } from 'react';
import { GripVertical, Clock, MapPin, StickyNote, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DraftStop, DraftPresence } from '@/types/liveDraftTypes';
import { getFeatureFlag } from '@/utils/featureFlags';
import { PlanRole, canEditPlan } from '@/utils/getPlanRole';
import { useUndoToast } from '@/components/toast/UndoToast';
import { cn } from '@/lib/utils';

interface DraftStopCardProps {
  stop: DraftStop;
  isLocked: boolean;
  presence: DraftPresence[];
  currentUserId: number;
  onUpdate: (stopId: string, field: string, value: any) => void;
  onDelete?: (stopId: string) => void;
  onRestore?: (stopId: string, stopData: DraftStop) => void;
  onEditStart: (stopId: string, field: string) => void;
  onEditEnd: () => void;
  onDragStart: (e: React.DragEvent, stopId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stopId: string) => void;
  userRole?: PlanRole;
}

const DraftStopCard = ({
  stop,
  isLocked,
  presence,
  currentUserId,
  onUpdate,
  onDelete,
  onRestore,
  onEditStart,
  onEditEnd,
  onDragStart,
  onDragOver,
  onDrop,
  userRole = 'host'
}: DraftStopCardProps) => {
  const [localValues, setLocalValues] = useState({
    venue: stop.venue,
    time: stop.time,
    duration: stop.duration.toString(),
    notes: stop.notes
  });
  const [showDelete, setShowDelete] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  
  const isPolishEnabled = getFeatureFlag('co_plan_polish_v2');
  const isRoleGuardEnabled = getFeatureFlag('plan_edit_role_guard_v1');
  const { showUndoToast } = useUndoToast();

  const canEdit = canEditPlan(userRole);
  const isEditingDisabled = isLocked || (isRoleGuardEnabled && !canEdit);
  const isDragDisabled = isEditingDisabled;

  // Find who's editing this stop
  const editingUser = presence.find(p => 
    p.editing_stop_id === stop.id && p.user_id !== currentUserId
  );

  // Check if card has any filled fields
  const hasFilledFields = stop.venue || stop.time || stop.notes || stop.duration > 0;

  const getEditingColor = (user?: DraftPresence) => {
    if (!user) return '';
    const colors = ['border-blue-500', 'border-green-500', 'border-purple-500', 'border-orange-500'];
    return colors[user.user_id % colors.length];
  };

  const handleFieldUpdate = (field: string, value: string) => {
    if (isEditingDisabled) return;
    
    setLocalValues(prev => ({ ...prev, [field]: value }));
    onUpdate(stop.id, field, field === 'duration' ? parseInt(value) || 0 : value);
  };

  const handleSwipeDelete = () => {
    if (onDelete && hasFilledFields && isPolishEnabled && canEdit) {
      const stopData = { ...stop };
      onDelete(stop.id);
      
      // Show undo toast
      showUndoToast({
        message: "Stop deleted",
        onUndo: () => {
          if (onRestore) {
            onRestore(stop.id, stopData);
          }
        }
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditingDisabled) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasFilledFields || !isPolishEnabled || isEditingDisabled) return;
    
    const touchX = e.touches[0].clientX;
    const deltaX = touchStartX - touchX;
    
    if (deltaX > 60) {
      setShowDelete(true);
    } else if (deltaX < 30) {
      setShowDelete(false);
    }
  };

  // Sync external updates
  useEffect(() => {
    setLocalValues({
      venue: stop.venue,
      time: stop.time,
      duration: stop.duration.toString(),
      notes: stop.notes
    });
  }, [stop]);

  return (
    <div className="relative">
      <Card
        className={cn(
          "mb-3 transition-all duration-200",
          editingUser && isPolishEnabled && `border-2 ${getEditingColor(editingUser)}`,
          editingUser && !isPolishEnabled && `border-2 ${getEditingColor(editingUser)} shadow-md`,
          !isDragDisabled && "cursor-move hover:shadow-md",
          isRoleGuardEnabled && !canEdit && "bg-muted/20",
          showDelete && "transform -translate-x-[60px]"
        )}
        draggable={!isDragDisabled}
        onDragStart={(e) => !isDragDisabled && onDragStart(e, stop.id)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, stop.id)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <CardContent className="p-3">
          <div className="flex items-start space-x-3">
            {!isDragDisabled && (
              <div 
                className="mt-2 cursor-grab flex-shrink-0 w-8 h-8 flex items-center justify-center"
              >
                <GripVertical size={16} className="text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 space-y-3">
              {/* Venue Name */}
              <div className="relative">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="text-base font-medium">Venue</span>
                </div>
                <Input
                  value={localValues.venue}
                  onChange={(e) => handleFieldUpdate('venue', e.target.value)}
                  onFocus={() => canEdit && onEditStart(stop.id, 'venue')}
                  onBlur={onEditEnd}
                  placeholder="Enter venue name..."
                  disabled={isEditingDisabled}
                  readOnly={isRoleGuardEnabled && !canEdit}
                  className={cn(
                    "border-none p-0 h-auto text-sm font-medium bg-transparent focus:bg-muted/20",
                    isRoleGuardEnabled && !canEdit && "cursor-default"
                  )}
                />
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-base font-medium">Time</span>
                  </div>
                  <Input
                    type="time"
                    value={localValues.time}
                    onChange={(e) => handleFieldUpdate('time', e.target.value)}
                    onFocus={() => canEdit && onEditStart(stop.id, 'time')}
                    onBlur={onEditEnd}
                    disabled={isEditingDisabled}
                    readOnly={isRoleGuardEnabled && !canEdit}
                    className={cn(
                      "border-none p-0 h-auto text-sm bg-transparent focus:bg-muted/20",
                      isRoleGuardEnabled && !canEdit && "cursor-default"
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-base font-medium">Duration (min)</span>
                  </div>
                  <Input
                    type="number"
                    value={localValues.duration}
                    onChange={(e) => handleFieldUpdate('duration', e.target.value)}
                    onFocus={() => canEdit && onEditStart(stop.id, 'duration')}
                    onBlur={onEditEnd}
                    placeholder="60"
                    disabled={isEditingDisabled}
                    readOnly={isRoleGuardEnabled && !canEdit}
                    className={cn(
                      "border-none p-0 h-auto text-sm bg-transparent focus:bg-muted/20",
                      isRoleGuardEnabled && !canEdit && "cursor-default"
                    )}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <StickyNote size={14} className="text-muted-foreground" />
                  <span className="text-base font-medium">Notes</span>
                </div>
                <Textarea
                  value={localValues.notes}
                  onChange={(e) => handleFieldUpdate('notes', e.target.value)}
                  onFocus={() => canEdit && onEditStart(stop.id, 'notes')}
                  onBlur={onEditEnd}
                  placeholder="Add notes, special instructions..."
                  disabled={isEditingDisabled}
                  readOnly={isRoleGuardEnabled && !canEdit}
                  rows={2}
                  className={cn(
                    "border-none p-0 text-base md:text-sm bg-transparent focus:bg-muted/20 resize-none",
                    isRoleGuardEnabled && !canEdit && "cursor-default"
                  )}
                />
              </div>
            </div>

            {/* Avatar overlay when being edited */}
            {editingUser && (
              <div className="absolute top-2 right-2">
                <Avatar className={cn(
                  "h-4 w-4 border-2 border-background",
                  isPolishEnabled ? "border border-current" : ""
                )}>
                  <AvatarFallback className="text-xs">{editingUser.avatar}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Button (Swipe Left) - only for editors */}
      {hasFilledFields && !isEditingDisabled && isPolishEnabled && canEdit && (
        <div 
          className={cn(
            "absolute right-0 top-0 h-full w-[60px] bg-red-500 flex items-center justify-center transition-transform duration-200",
            showDelete ? "translate-x-0" : "translate-x-full"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwipeDelete}
            className="text-white hover:bg-red-600"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DraftStopCard;
