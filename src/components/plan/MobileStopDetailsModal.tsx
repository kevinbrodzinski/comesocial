
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, DollarSign, X, Calendar } from 'lucide-react';
import { isFeatureEnabled } from '@/utils/featureFlags';

interface MobileStopDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: any;
  onSave: (updatedStop: any) => void;
}

const MobileStopDetailsModal = ({ isOpen, onClose, stop, onSave }: MobileStopDetailsModalProps) => {
  const [editedStop, setEditedStop] = useState(stop || {});

  useEffect(() => {
    setEditedStop(stop || {});
  }, [stop]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Auto-calculate end time if start time and duration are provided
    if (editedStop.startTime && editedStop.estimatedTime) {
      const startTime = new Date(`2024-01-01T${editedStop.startTime}`);
      startTime.setMinutes(startTime.getMinutes() + (editedStop.estimatedTime || 0));
      const endTime = startTime.toTimeString().slice(0, 5);
      setEditedStop(prev => ({ ...prev, endTime }));
    }
    
    onSave({ ...editedStop });
    onClose();
  };

  const venueTypes = [
    'restaurant', 'bar', 'club', 'lounge', 'cafe', 'rooftop', 'live music', 'sports bar'
  ];

  const bookingStatuses = [
    { value: 'none', label: 'No Booking Needed', color: 'bg-gray-100' },
    { value: 'pending', label: 'Booking Pending', color: 'bg-yellow-100' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100' }
  ];

  const useSheetSections = isFeatureEnabled('stop_sheet_visual_v1');
  const sectionClass = useSheetSections ? 'sheet-section' : '';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl border-t border-border max-h-[85vh] flex flex-col animate-slide-in-from-bottom">
        {/* Mobile Header */}
        <div className="flex-shrink-0 bg-background border-b border-border rounded-t-2xl">
          {/* Drag handle */}
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-3 mb-2"></div>
          
          <div className="flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-10 w-10 p-0"
            >
              <X size={20} />
            </Button>
            <h2 className="font-semibold text-lg">Edit Stop Details</h2>
            <Button 
              onClick={handleSave}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </div>

        {/* Mobile Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Basic Info Section */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-primary" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile-name" className="text-sm font-medium">Venue Name</Label>
                <Input
                  id="mobile-name"
                  value={editedStop.name || ''}
                  onChange={(e) => setEditedStop({ ...editedStop, name: e.target.value })}
                  placeholder="Enter venue name"
                  className="h-12 text-base bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-type" className="text-sm font-medium">Venue Type</Label>
                <Select 
                  value={editedStop.type || ''} 
                  onValueChange={(value) => setEditedStop({ ...editedStop, type: value })}
                >
                  <SelectTrigger className="h-12 text-base bg-background border-border focus:border-primary">
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {venueTypes.map((type) => (
                      <SelectItem 
                        key={type} 
                        value={type} 
                        className="h-12 text-base hover:bg-primary/10"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-address" className="text-sm font-medium">Address</Label>
                <Input
                  id="mobile-address"
                  value={editedStop.address || ''}
                  onChange={(e) => setEditedStop({ ...editedStop, address: e.target.value })}
                  placeholder="Enter venue address"
                  className="h-12 text-base bg-background border-border focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Timing Section */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-primary" />
              <h3 className="font-semibold">Timing</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-start-time" className="text-sm font-medium">Start Time</Label>
                  <Input
                    id="mobile-start-time"
                    type="time"
                    value={editedStop.startTime || ''}
                    onChange={(e) => setEditedStop({ ...editedStop, startTime: e.target.value })}
                    className="h-12 text-base bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile-end-time" className="text-sm font-medium">End Time</Label>
                  <Input
                    id="mobile-end-time"
                    type="time"
                    value={editedStop.endTime || ''}
                    onChange={(e) => setEditedStop({ ...editedStop, endTime: e.target.value })}
                    className="h-12 text-base bg-background border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-duration" className="text-sm font-medium">Duration (minutes)</Label>
                <Input
                  id="mobile-duration"
                  type="number"
                  value={editedStop.estimatedTime || ''}
                  onChange={(e) => setEditedStop({ ...editedStop, estimatedTime: parseInt(e.target.value) })}
                  placeholder="90"
                  className="h-12 text-base bg-background border-border focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Capacity & Cost Section */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-primary" />
              <h3 className="font-semibold">Capacity & Cost</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile-cost" className="text-sm font-medium">Cost per Person ($)</Label>
                <Input
                  id="mobile-cost"
                  type="number"
                  value={editedStop.cost || ''}
                  onChange={(e) => setEditedStop({ ...editedStop, cost: parseInt(e.target.value) })}
                  placeholder="25"
                  className="h-12 text-base bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-capacity" className="text-sm font-medium">Max Capacity</Label>
                <Input
                  id="mobile-capacity"
                  type="number"
                  value={editedStop.maxCapacity || ''}
                  onChange={(e) => setEditedStop({ ...editedStop, maxCapacity: parseInt(e.target.value) })}
                  placeholder="20"
                  className="h-12 text-base bg-background border-border focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-primary" />
              <h3 className="font-semibold">Requirements</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile-dresscode" className="text-sm font-medium">Dress Code</Label>
                <Select 
                  value={editedStop.dresscode || ''} 
                  onValueChange={(value) => setEditedStop({ ...editedStop, dresscode: value })}
                >
                  <SelectTrigger className="h-12 text-base bg-background border-border focus:border-primary">
                    <SelectValue placeholder="Select dress code" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="casual" className="h-12 text-base">Casual</SelectItem>
                    <SelectItem value="smart-casual" className="h-12 text-base">Smart Casual</SelectItem>
                    <SelectItem value="business" className="h-12 text-base">Business</SelectItem>
                    <SelectItem value="formal" className="h-12 text-base">Formal</SelectItem>
                    <SelectItem value="cocktail" className="h-12 text-base">Cocktail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-booking" className="text-sm font-medium">Booking Status</Label>
                <Select 
                  value={editedStop.bookingStatus || 'none'} 
                  onValueChange={(value) => setEditedStop({ ...editedStop, bookingStatus: value })}
                >
                  <SelectTrigger className="h-12 text-base bg-background border-border focus:border-primary">
                    <SelectValue placeholder="Select booking status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {bookingStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value} className="h-12 text-base">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className={sectionClass}>
            <div className="space-y-2">
              <Label htmlFor="mobile-notes" className="text-sm font-medium">Notes & Special Requirements</Label>
              <Textarea
                id="mobile-notes"
                value={editedStop.notes || ''}
                onChange={(e) => setEditedStop({ ...editedStop, notes: e.target.value })}
                placeholder="Add any special notes, requirements, or instructions..."
                rows={4}
                className="text-base bg-background border-border focus:border-primary resize-none"
              />
            </div>
          </div>
          
          {/* Summary Card */}
          {(editedStop.startTime || editedStop.cost || editedStop.estimatedTime) && (
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {editedStop.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span>{editedStop.startTime}</span>
                  </div>
                )}
                {editedStop.estimatedTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{editedStop.estimatedTime}m</span>
                  </div>
                )}
                {editedStop.cost && (
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-green-600" />
                    <span>${editedStop.cost}</span>
                  </div>
                )}
                {editedStop.maxCapacity && (
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-blue-600" />
                    <span>Max {editedStop.maxCapacity}</span>
                  </div>
                )}
              </div>
              {editedStop.bookingStatus && editedStop.bookingStatus !== 'none' && (
                <div className="mt-3">
                  <Badge variant="outline" className={
                    editedStop.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                    editedStop.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {bookingStatuses.find(s => s.value === editedStop.bookingStatus)?.label}
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          {/* Bottom padding for safe area */}
          <div className="h-6"></div>
        </div>
      </div>
    </>
  );
};

export default MobileStopDetailsModal;
