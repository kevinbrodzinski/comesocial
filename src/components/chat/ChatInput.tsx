
import React, { useState } from 'react';
import { Send, Mic, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ImageUpload from '../ImageUpload';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onImageSelect?: (file: File) => void;
  disabled?: boolean;
}

const ChatInput = ({ 
  inputValue, 
  onInputChange, 
  onSendMessage, 
  onImageSelect,
  disabled = false 
}: ChatInputProps) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSendMessage();
    }
  };

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setShowImageUpload(false);
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border z-40">
      {/* Image Preview */}
      {selectedImage && (
        <div className="p-4 border-b border-border">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-20 rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveImage}
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="p-4 border-b border-border">
          <ImageUpload
            onImageSelect={handleImageSelect}
            placeholder="Select a photo to share"
            className="max-w-sm mx-auto"
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full max-w-sm mx-auto block"
            onClick={() => setShowImageUpload(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Chat Input */}
      <div className="flex items-center space-x-3 p-6 max-w-md mx-auto">
        <Button 
          variant="outline" 
          size="icon" 
          className="shrink-0 w-12 h-12"
          disabled={disabled}
        >
          <Mic size={18} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 w-12 h-12"
          onClick={() => setShowImageUpload(!showImageUpload)}
          disabled={disabled}
        >
          <Camera size={18} />
        </Button>
        
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={disabled ? "Nova is thinking..." : "What kind of night are you looking for?"}
          className="flex-1 bg-background border-border h-12"
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        
        <Button 
          onClick={onSendMessage} 
          size="icon" 
          className="shrink-0 w-12 h-12 bg-primary hover:bg-primary/80"
          disabled={disabled || (!inputValue.trim() && !selectedImage)}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
