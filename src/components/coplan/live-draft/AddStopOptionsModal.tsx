
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AddStopOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchVenues: () => void;
  onCreateCustom: () => void;
}

const AddStopOptionsModal = ({ 
  isOpen, 
  onClose, 
  onSearchVenues, 
  onCreateCustom 
}: AddStopOptionsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Stop</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => {
              onSearchVenues();
              onClose();
            }}
            className="w-full h-12 justify-start text-left"
            variant="outline"
          >
            <Search size={20} className="mr-3" />
            <div>
              <div className="font-medium">Search Venues</div>
              <div className="text-xs text-muted-foreground">Find restaurants, bars, and activities</div>
            </div>
          </Button>
          
          <Button
            onClick={() => {
              onCreateCustom();
              onClose();
            }}
            className="w-full h-12 justify-start text-left"
            variant="outline"
          >
            <Plus size={20} className="mr-3" />
            <div>
              <div className="font-medium">Create Custom Stop</div>
              <div className="text-xs text-muted-foreground">Add your own venue or activity</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStopOptionsModal;
