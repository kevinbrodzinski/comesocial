
import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  currentImage?: string | null;
  placeholder?: string;
  accept?: string;
  className?: string;
}

const ImageUpload = ({
  onImageSelect,
  onImageRemove,
  currentImage,
  placeholder = "Click to upload an image",
  accept = "image/*",
  className = ""
}: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {currentImage ? (
        <Card className="relative overflow-hidden">
          <img
            src={currentImage}
            alt="Upload preview"
            className="w-full h-48 object-cover"
          />
          {onImageRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
            >
              <X size={16} />
            </Button>
          )}
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              {dragOver ? (
                <Upload className="h-12 w-12 text-primary animate-bounce" />
              ) : (
                <Image className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Drag and drop or click to browse
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
