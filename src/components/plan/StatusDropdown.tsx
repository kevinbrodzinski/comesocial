
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserStatusType, statusOptions, getStatusOption } from '@/types/userStatus';

interface StatusDropdownProps {
  children: React.ReactNode;
  currentStatus: UserStatusType;
  onStatusChange: (status: UserStatusType) => void;
  lastUpdated?: string;
}

const StatusDropdown = ({
  children,
  currentStatus,
  onStatusChange,
  lastUpdated
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusSelect = (status: UserStatusType) => {
    onStatusChange(status);
    setIsOpen(false); // Close dropdown after selection
  };

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-white shadow-lg border rounded-lg z-50" align="center" side="top">
        <div className="p-3 border-b">
          <h3 className="font-medium text-sm">Update Status</h3>
        </div>
        
        <div className="p-2 space-y-1">
          {statusOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleStatusSelect(option.type)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors hover:bg-gray-50 ${
                currentStatus === option.type ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${option.bgColor} ${option.borderColor} border flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500 truncate">{option.description}</p>
              </div>
              {currentStatus === option.type && (
                <span className="text-xs text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>

        {lastUpdated && (
          <div className="p-3 border-t bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Last updated {formatLastUpdated(lastUpdated)}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StatusDropdown;
