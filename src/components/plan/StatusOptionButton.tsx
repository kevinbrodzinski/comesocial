
import React from 'react';
import { Button } from '@/components/ui/button';
import { StatusOption, UserStatusType } from '@/types/userStatus';

interface StatusOptionButtonProps {
  option: StatusOption;
  isSelected: boolean;
  onSelect: (status: UserStatusType) => void;
  lastUpdated?: string;
}

const StatusOptionButton = ({ option, isSelected, onSelect, lastUpdated }: StatusOptionButtonProps) => {
  const handleClick = () => {
    onSelect(option.type);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={`w-full h-auto p-4 flex flex-col items-start text-left space-y-2 transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-md border-primary bg-primary/5' 
          : 'hover:shadow-sm hover:border-primary/30 hover:bg-muted/30'
      }`}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className={`w-3 h-3 rounded-full ${option.bgColor} ${option.borderColor} border-2 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{option.label}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
        </div>
      </div>
      
      {isSelected && lastUpdated && (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">
            Updated {lastUpdated}
          </p>
        </div>
      )}
    </Button>
  );
};

export default StatusOptionButton;
