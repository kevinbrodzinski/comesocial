
import React from 'react';
import { Zap, X, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlastData {
  venue: string;
  timeSlot: string;
  caption: string;
  planId: number;
  postType: string;
}

interface BlastPlanModalProps {
  isOpen: boolean;
  blastData: BlastData | null;
  onClose: () => void;
  onCreate: (data: BlastData) => void;
}

const BlastPlanModal = ({ isOpen, blastData, onClose, onCreate }: BlastPlanModalProps) => {
  if (!isOpen || !blastData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-background rounded-t-3xl sm:rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Zap size={20} className="mr-2 text-orange-600" />
              Blast Your Plan
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
              <h3 className="font-medium text-foreground mb-2">Plan Preview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin size={14} className="mr-2" />
                  <span>{blastData.venue || 'Location TBD'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock size={14} className="mr-2" />
                  <span>{blastData.timeSlot}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Message
              </label>
              <textarea
                className="w-full p-3 border border-input rounded-md bg-background text-sm resize-none"
                rows={3}
                placeholder={blastData.caption}
                defaultValue={blastData.caption}
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => onCreate(blastData)}
              >
                Send Blast
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlastPlanModal;
