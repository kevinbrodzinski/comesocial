
import React, { useState } from 'react';
import { Plus, MapPin, MessageCircle, Lock, Unlock, Save, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getFeatureFlag } from '@/utils/featureFlags';
import { PlanRole, canEditPlan } from '@/utils/getPlanRole';
import { cn } from '@/lib/utils';

interface BottomActionBarProps {
  isLocked: boolean;
  isChatOpen: boolean;
  hasStops: boolean;
  onAddStopClick: () => void;
  onSuggestNearby: () => void;
  onToggleChat: () => void;
  onToggleLock?: () => void;
  onSaveDraft?: () => void;
  canLock?: boolean;
  userRole?: PlanRole;
  onSuggestStop?: () => void;
}

const BottomActionBar = ({
  isLocked,
  isChatOpen,
  hasStops,
  onAddStopClick,
  onSuggestNearby,
  onToggleChat,
  onToggleLock = () => {},
  onSaveDraft = () => {},
  canLock = true,
  userRole = 'host',
  onSuggestStop = () => {}
}: BottomActionBarProps) => {
  const isPolishEnabled = getFeatureFlag('co_plan_polish_v2');
  const isSaveButtonEnabled = getFeatureFlag('draft_save_button_v1');
  const isRoleGuardEnabled = getFeatureFlag('plan_edit_role_guard_v1');
  const lockDisabled = !hasStops;
  const [isSaving, setIsSaving] = useState(false);
  
  const canEdit = canEditPlan(userRole);
  const isGuest = userRole === 'guest';

  const handleSaveDraft = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSaveDraft();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuggestStop = () => {
    onSuggestStop();
    onToggleChat();
  };

  return (
    <div className={cn(
      "border-t bg-background/95 backdrop-blur-sm sticky bottom-0 z-40",
      isPolishEnabled && "pb-safe"
    )}>
      <div className="p-2 space-y-2">
        {/* Top Row - Main Actions */}
        <div className="flex items-center gap-2">
          {isRoleGuardEnabled && isGuest ? (
            // Guest view - suggest instead of add
            <Button
              variant="outline"
              size="sm"
              onClick={handleSuggestStop}
              disabled={isLocked}
              className="flex-1 h-10 text-sm px-3 flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              <span>Suggest Stop</span>
            </Button>
          ) : (
            // Host/co-planner view - normal add button
            <Button
              variant="outline"
              size="sm"
              onClick={onAddStopClick}
              disabled={isLocked || (isRoleGuardEnabled && !canEdit)}
              className="flex-1 h-10 text-sm px-3 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>Add Stop</span>
            </Button>
          )}

          {/* Hide Nearby for guests when role guard is enabled */}
          {!(isRoleGuardEnabled && isGuest) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSuggestNearby}
              disabled={isLocked || (isRoleGuardEnabled && !canEdit)}
              className="flex-1 h-10 text-sm px-3 flex items-center justify-center gap-2"
            >
              <MapPin size={16} />
              <span>Nearby</span>
            </Button>
          )}

          <Button
            variant={isChatOpen ? "default" : "outline"}
            size="sm"
            onClick={onToggleChat}
            className="flex-1 h-10 text-sm px-3 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            <span>Chat</span>
          </Button>
        </div>

        {/* Save Draft Row - only for editors */}
        {isSaveButtonEnabled && !(isRoleGuardEnabled && isGuest) && (
          <div className="w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving || (isRoleGuardEnabled && !canEdit)}
              className="w-full h-10 text-sm px-3 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </Button>
          </div>
        )}

        {/* Bottom Row - Lock Control */}
        {isPolishEnabled && canLock && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleLock}
                    disabled={lockDisabled || (isRoleGuardEnabled && !canEdit)}
                    className={cn(
                      "w-full h-10 text-sm px-3 flex items-center justify-center gap-2",
                      (lockDisabled || (isRoleGuardEnabled && !canEdit)) && "opacity-40 bg-surface-2 cursor-not-allowed"
                    )}
                  >
                    {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                    <span>{isLocked ? 'Unlock Plan' : 'Lock Plan'}</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {lockDisabled 
                    ? "Add a stop before locking" 
                    : isRoleGuardEnabled && !canEdit 
                      ? "Only host/co-planners can lock the plan"
                      : isLocked 
                        ? "Unlock plan to allow editing"
                        : "Lock plan to prevent further changes"
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default BottomActionBar;
