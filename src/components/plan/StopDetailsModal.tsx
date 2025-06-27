
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StopDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: any;
  onSave: (updatedStop: any) => void;
}

const StopDetailsModal = ({ isOpen, onClose, stop, onSave }: StopDetailsModalProps) => {
  const [editedStop, setEditedStop] = useState(stop || {});

  const handleSave = () => {
    onSave(editedStop);
    onClose();
  };

  const venueTypes = [
    'restaurant', 'bar', 'club', 'lounge', 'cafe', 'rooftop', 'live music', 'sports bar'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border light-card-shadow-xl">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Edit Stop Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-foreground">Venue Name</Label>
            <Input
              id="name"
              value={editedStop.name || ''}
              onChange={(e) => setEditedStop({ ...editedStop, name: e.target.value })}
              placeholder="Enter venue name"
              className="bg-background border-border focus:bg-card transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-base font-medium text-foreground">Venue Type</Label>
            <Select 
              value={editedStop.type || ''} 
              onValueChange={(value) => setEditedStop({ ...editedStop, type: value })}
            >
              <SelectTrigger className="bg-background border-border focus:bg-card">
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent className="bg-card border light-card-shadow-xl">
                {venueTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-primary/10">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="text-base font-medium text-foreground">Time (minutes)</Label>
              <Input
                id="time"
                type="number"
                value={editedStop.estimatedTime || ''}
                onChange={(e) => setEditedStop({ ...editedStop, estimatedTime: parseInt(e.target.value) })}
                placeholder="90"
                className="bg-background border-border focus:bg-card transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="text-base font-medium text-foreground">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                value={editedStop.cost || ''}
                onChange={(e) => setEditedStop({ ...editedStop, cost: parseInt(e.target.value) })}
                placeholder="25"
                className="bg-background border-border focus:bg-card transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium text-foreground">Notes</Label>
            <Textarea
              id="notes"
              value={editedStop.notes || ''}
              onChange={(e) => setEditedStop({ ...editedStop, notes: e.target.value })}
              placeholder="Add any special notes about this stop..."
              rows={4}
              className="bg-background border-border focus:bg-card transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-muted/50 transition-colors border-border"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white light-card-shadow hover:light-card-shadow-hover transition-all hover:scale-105"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StopDetailsModal;
