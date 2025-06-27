
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vibe, getVibesByTimeOfDay } from '@/types/vibeTypes';
import { useVibeModalEffects } from '@/hooks/useVibeModalEffects';
import VibeModalHeader from './VibeModalHeader';
import VibeTabContent from './VibeTabContent';
import VibeCustomTextInput from './VibeCustomTextInput';
import VibeActionButtons from './VibeActionButtons';

interface VibeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSetVibe: (vibe: Vibe, customText?: string) => void;
  currentVibe?: Vibe;
}

const VibeSelector = ({ isOpen, onClose, onSetVibe, currentVibe }: VibeSelectorProps) => {
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(currentVibe || null);
  const [customText, setCustomText] = useState('');
  const [activeTab, setActiveTab] = useState('day');

  useVibeModalEffects({ isOpen, onClose });

  if (!isOpen) return null;

  const handleVibeSelect = (vibe: Vibe) => {
    setSelectedVibe(vibe);
  };

  const handleSetVibe = () => {
    if (selectedVibe) {
      onSetVibe(selectedVibe, customText.trim() || undefined);
      onClose();
      setCustomText('');
    }
  };

  const handleClearVibe = () => {
    setSelectedVibe(null);
    onClose();
    setCustomText('');
  };

  const dayVibes = getVibesByTimeOfDay('day');
  const nightVibes = getVibesByTimeOfDay('night');

  return (
    <>
      {/* Enhanced Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" 
        onClick={onClose} 
      />
      
      {/* Modal - Now fully scrollable */}
      <div className="fixed inset-x-4 top-4 bottom-4 z-50 animate-in fade-in-0 scale-in-95 sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:max-h-[90vh]">
        <Card className="bg-background border-border h-full">
          <CardContent className="p-0 h-full overflow-y-auto">
            <div className="p-6">
              <VibeModalHeader onClose={onClose} />

              {/* Tabs Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="day" className="text-sm">Day</TabsTrigger>
                  <TabsTrigger value="night" className="text-sm">Night</TabsTrigger>
                </TabsList>

                {/* Day Tab */}
                <TabsContent value="day" className="mt-0">
                  <VibeTabContent 
                    vibes={dayVibes}
                    selectedVibe={selectedVibe}
                    onVibeSelect={handleVibeSelect}
                  />
                </TabsContent>

                {/* Night Tab */}
                <TabsContent value="night" className="mt-0">
                  <VibeTabContent 
                    vibes={nightVibes}
                    selectedVibe={selectedVibe}
                    onVibeSelect={handleVibeSelect}
                  />
                </TabsContent>
              </Tabs>

              <VibeCustomTextInput
                customText={customText}
                onCustomTextChange={setCustomText}
                isVisible={!!selectedVibe}
              />

              <VibeActionButtons
                hasSelectedVibe={!!selectedVibe}
                onClearVibe={handleClearVibe}
                onSetVibe={handleSetVibe}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VibeSelector;
