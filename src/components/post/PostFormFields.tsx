
import React from 'react';
import { MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUpload from '../ImageUpload';

interface PostFormFieldsProps {
  caption: string;
  venue: string;
  image: File | null;
  imagePreview: string | null;
  isGoingOutMode: boolean;
  onCaptionChange: (caption: string) => void;
  onVenueChange: (venue: string) => void;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

const PostFormFields = ({
  caption,
  venue,
  image,
  imagePreview,
  isGoingOutMode,
  onCaptionChange,
  onVenueChange,
  onImageSelect,
  onImageRemove
}: PostFormFieldsProps) => {
  return (
    <>
      {!isGoingOutMode && (
        <ImageUpload
          onImageSelect={onImageSelect}
          onImageRemove={onImageRemove}
          currentImage={imagePreview}
          placeholder="Add a photo to your post"
        />
      )}

      <div>
        <Label htmlFor="post-caption">
          {isGoingOutMode ? "What's the vibe?" : "Caption"}
        </Label>
        <Textarea
          id="post-caption"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder={isGoingOutMode ? "Who's down for drinks at Sky Lounge?" : "What's happening at this spot?"}
          className="mt-1 resize-none"
          rows={3}
          maxLength={200}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {caption.length}/200
        </div>
      </div>

      <div>
        <Label htmlFor="post-venue">Location {!isGoingOutMode && "(Optional)"}</Label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            id="post-venue"
            value={venue}
            onChange={(e) => onVenueChange(e.target.value)}
            placeholder="Where are you going?"
            className="pl-10 mt-1"
          />
        </div>
      </div>
    </>
  );
};

export default PostFormFields;
