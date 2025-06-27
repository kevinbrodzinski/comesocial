import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserStatusType, statusOptions, getStatusOption } from '@/types/userStatus';
import StatusActionService from '@/services/StatusActionService';

interface EnhancedStatusDropdownProps {
  children: React.ReactNode;
  currentStatus: UserStatusType;
  onStatusChange: (status: UserStatusType, context?: any) => void;
  lastUpdated?: string;
  context?: any;
}

const EnhancedStatusDropdown = ({
  children,
  currentStatus,
  onStatusChange,
  lastUpdated,
  context = {}
}: EnhancedStatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<UserStatusType | null>(null);
  const [eta, setEta] = useState('');
  const [note, setNote] = useState('');
  const [delayReason, setDelayReason] = useState('');

  const statusActionService = StatusActionService.getInstance();

  const handleStatusSelect = async (status: UserStatusType) => {
    console.log('🎯 Status selected:', status);
    
    // For statuses that need additional input, show form
    if (status === 'running-late' || (status === 'on-my-way' && !eta)) {
      setSelectedStatus(status);
      return;
    }

    await executeStatusChange(status);
  };

  const executeStatusChange = async (status: UserStatusType) => {
    const statusContext = {
      ...context,
      eta,
      note,
      delayReason,
      timestamp: new Date().toISOString()
    };

    // Execute status-specific actions
    const actionResult = await statusActionService.executeStatusActions(status, statusContext);
    
    // Call the original status change handler
    onStatusChange(status, statusContext);
    
    // Handle action results
    handleActionResults(actionResult);
    
    // Close dropdown and reset form
    setIsOpen(false);
    setSelectedStatus(null);
    setEta('');
    setNote('');
    setDelayReason('');
  };

  const handleActionResults = (result: any) => {
    if (!result) return;

    // Handle various action results
    if (result.showETAInput && !eta) {
      // Keep form open for ETA input
      return;
    }

    if (result.showCheckInConfirmation) {
      // Trigger check-in confirmation UI
      const event = new CustomEvent('showCheckInConfirmation', { detail: result });
      window.dispatchEvent(event);
    }

    if (result.showNightSummary) {
      // Trigger night summary modal
      const event = new CustomEvent('showNightSummary', { detail: result });
      window.dispatchEvent(event);
    }

    console.log('✅ Status action results:', result);
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

  const renderStatusForm = () => {
    if (!selectedStatus) return null;

    const statusOption = getStatusOption(selectedStatus);

    return (
      <div className="p-4 border-t space-y-3">
        <h4 className="font-medium text-sm">Update {statusOption.label}</h4>
        
        {selectedStatus === 'running-late' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="eta" className="text-xs">New ETA (optional)</Label>
              <Input
                id="eta"
                placeholder="15 minutes"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="Traffic, work meeting, etc."
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </>
        )}

        {selectedStatus === 'on-my-way' && (
          <div className="space-y-2">
            <Label htmlFor="eta" className="text-xs">ETA (optional)</Label>
            <Input
              id="eta"
              placeholder="10 minutes"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="note" className="text-xs">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Add a quick note for your friends..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-16 text-sm resize-none"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => executeStatusChange(selectedStatus)}
            className="flex-1 h-8 text-xs"
          >
            Update Status
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedStatus(null)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white shadow-lg border rounded-lg z-50" align="center" side="top">
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
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm text-gray-900">{option.label}</p>
                  {option.actions.some(a => a.type === 'auto') && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Auto</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{option.description}</p>
              </div>
              {currentStatus === option.type && (
                <span className="text-xs text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>

        {renderStatusForm()}

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

export default EnhancedStatusDropdown;
