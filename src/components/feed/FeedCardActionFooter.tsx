
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Plus, Bookmark, BookmarkCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import SaveTooltip from '../SaveTooltip';

interface FeedCardActionFooterProps {
  post: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
  isSaved: boolean;
  isWatched: boolean;
  onLike: () => void;
  onSave: () => void;
  onWatch: () => void;
  onComment: () => void;
  onShare: () => void;
  onJoin: () => void;
  onStopPropagation: (e: React.MouseEvent) => void;
}

const FeedCardActionFooter = ({
  post,
  isLiked,
  isSaved,
  isWatched,
  onLike,
  onSave,
  onWatch,
  onComment,
  onShare,
  onJoin,
  onStopPropagation
}: FeedCardActionFooterProps) => {
  const [showSaveTooltip, setShowSaveTooltip] = useState(false);
  const [showWatchTooltip, setShowWatchTooltip] = useState(false);

  const handleSave = () => {
    onSave();
    if (!isSaved) {
      setShowSaveTooltip(true);
    }
  };

  const handleWatch = () => {
    onWatch();
    if (!isWatched) {
      setShowWatchTooltip(true);
    }
  };

  return (
    <CardContent className="p-4 bg-card/80 backdrop-blur-sm" onClick={onStopPropagation}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={onLike}
            className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors group"
          >
            <Heart 
              size={18} 
              className={`${isLiked ? 'fill-red-500 text-red-500 animate-pulse' : 'group-hover:scale-110'} transition-all`} 
            />
            <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          
          <button
            onClick={onComment}
            className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors group"
          >
            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors group"
          >
            <Share size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all group"
              title={isSaved ? 'Saved' : 'Save post'}
            >
              {isSaved ? (
                <BookmarkCheck size={16} className="text-primary animate-in scale-in-0" />
              ) : (
                <Bookmark size={16} className="group-hover:scale-110 transition-transform" />
              )}
            </Button>
            <SaveTooltip 
              isVisible={showSaveTooltip} 
              onComplete={() => setShowSaveTooltip(false)} 
            />
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWatch}
              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all group"
              title={isWatched ? 'Watching' : 'Add to watchlist'}
            >
              {isWatched ? (
                <EyeOff size={16} className="text-blue-600 animate-in scale-in-0" />
              ) : (
                <Eye size={16} className="group-hover:scale-110 transition-transform" />
              )}
            </Button>
            <SaveTooltip 
              isVisible={showWatchTooltip} 
              onComplete={() => setShowWatchTooltip(false)} 
            />
          </div>
          
          <Button
            size="sm"
            onClick={onJoin}
            className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
          >
            <Plus size={14} className="mr-1" />
            <span className="text-xs font-medium">Join</span>
          </Button>
        </div>
      </div>
    </CardContent>
  );
};

export default FeedCardActionFooter;
