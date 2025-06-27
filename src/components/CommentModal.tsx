
import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Comment {
  id: number;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    venue: string;
    friend?: string;
    avatar?: string;
  };
}

const CommentModal = ({ isOpen, onClose, post }: CommentModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      username: 'mike_j',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      message: 'This place looks amazing! 🔥',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      username: 'sarah_k',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      message: 'Was just there last week, the rooftop vibes are unreal!',
      timestamp: '5 min ago'
    },
    {
      id: 3,
      username: 'alex_m',
      message: 'Adding this to my weekend plans 📍',
      timestamp: '8 min ago'
    }
  ]);

  const commentsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, comments]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        username: 'you',
        message: newComment.trim(),
        timestamp: 'now'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card border border-border rounded-t-xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300 shadow-xl ring-1 ring-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            {post.friend && post.avatar && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.avatar} alt={post.friend} />
                <AvatarFallback>{post.friend.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="font-semibold text-foreground">{post.venue}</h3>
              {post.friend && (
                <p className="text-sm text-muted-foreground">@{post.friend}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                {comment.avatar ? (
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                ) : null}
                <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-foreground">
                    {comment.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.message}
                </p>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                className="w-full resize-none border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md max-h-20"
                rows={1}
              />
            </div>
            <Button 
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              size="sm"
              className="flex-shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
