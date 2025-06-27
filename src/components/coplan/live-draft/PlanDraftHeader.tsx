
import React, { useState } from 'react';
import { X, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getFeatureFlag } from '@/utils/featureFlags';
import { useHideOnScroll } from '@/utils/useHideOnScroll';
import { cn } from '@/lib/utils';

interface PlanDraftHeaderProps {
  title: string;
  description?: string;
  isLocked: boolean;
  canLock: boolean;
  hasStops: boolean;
  onBack: () => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onToggleLock: () => void;
}

const PlanDraftHeader = ({ 
  title, 
  description,
  isLocked, 
  canLock, 
  hasStops,
  onBack, 
  onTitleChange, 
  onDescriptionChange,
  onToggleLock 
}: PlanDraftHeaderProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || '');
  
  const isPolishEnabled = getFeatureFlag('co_plan_polish_v2');
  const iosNavFixEnabled = getFeatureFlag('draft_ios_nav_fix_v1');
  const isVisible = useHideOnScroll();
  const lockDisabled = !hasStops;

  const handleTitleSubmit = () => {
    onTitleChange(editTitle);
    setIsEditingTitle(false);
  };

  const handleDescriptionSubmit = () => {
    if (onDescriptionChange) {
      onDescriptionChange(editDescription);
    }
    setIsEditingDescription(false);
  };

  return (
    <div className={cn(
      "border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50",
      isPolishEnabled && "transition-transform duration-200 ease-out",
      isPolishEnabled && !isVisible && "-translate-y-full"
    )}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0 mr-3">
            {isEditingTitle ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className={cn(
                  "border-none p-0 h-auto text-lg font-semibold bg-transparent",
                  iosNavFixEnabled && "text-base md:text-lg"
                )}
                autoFocus
              />
            ) : (
              <h1
                className="text-lg font-semibold truncate cursor-pointer hover:bg-muted/50 rounded px-2 py-1"
                onClick={() => !isLocked && setIsEditingTitle(true)}
              >
                {title || 'Untitled Plan'}
              </h1>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Only show lock button if polish feature is disabled */}
            {!isPolishEnabled && canLock && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant={isLocked ? "default" : "outline"}
                        size="sm"
                        onClick={onToggleLock}
                        disabled={lockDisabled}
                        className={lockDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                      >
                        {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                        <span className="ml-2">{isLocked ? 'Locked' : 'Lock'}</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {lockDisabled && (
                    <TooltipContent>
                      <p>Add a stop before locking</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Inline Editable Subtitle (Polish V2) */}
        {isPolishEnabled && onDescriptionChange && (
          <div className="mt-2">
            {isEditingDescription ? (
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onBlur={handleDescriptionSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleDescriptionSubmit()}
                className={cn(
                  "border-none p-0 h-auto text-sm text-muted-foreground bg-transparent",
                  iosNavFixEnabled && "text-base md:text-sm"
                )}
                placeholder="Add description..."
                autoFocus
              />
            ) : description ? (
              <p
                className="text-sm text-muted-foreground cursor-pointer hover:bg-muted/30 rounded px-2 py-1 truncate"
                onClick={() => !isLocked && setIsEditingDescription(true)}
              >
                {description}
              </p>
            ) : (
              <p
                className="text-sm text-muted-foreground/50 cursor-pointer hover:bg-muted/30 rounded px-2 py-1"
                onClick={() => !isLocked && setIsEditingDescription(true)}
              >
                Add description...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDraftHeader;
