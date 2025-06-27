
import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessagesStore } from '@/messages/useMessagesStore';
import MapThreadCard from './MapThreadCard';
import { useNavigate } from 'react-router-dom';

interface MessageCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessageCenterModal: React.FC<MessageCenterModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { threads } = useMessagesStore();
  
  // Filter threads that have map context
  const mapThreads = threads.filter(thread => thread.context === 'map');
  const unreadCount = mapThreads.filter(thread => thread.unread).length;

  const handleThreadClick = (thread: any) => {
    // Mark as read when clicked
    useMessagesStore.getState().markRead(thread.id);
    // For now, we'll open the full chat - in a real implementation this could open a chat overlay
    onClose();
    navigate(`/messages?tab=messages&threadId=${thread.id}`);
  };

  const handleJumpToMessages = () => {
    onClose();
    navigate('/messages?tab=messages');
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Map Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 px-2 text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1 -mx-2">
        <div className="space-y-1 px-2">
          {mapThreads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No map messages yet</p>
              <p className="text-xs mt-1">Messages from map pins will appear here</p>
            </div>
          ) : (
            mapThreads.map(thread => (
              <MapThreadCard
                key={thread.id}
                thread={thread}
                onClick={() => handleThreadClick(thread)}
                onJumpToMessages={handleJumpToMessages}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleJumpToMessages}
          className="text-xs"
        >
          View All Messages
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm w-full max-h-[70vh] flex flex-col hidden md:flex">
          {content}
        </DialogContent>
      </Dialog>

      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80vh] flex flex-col md:hidden">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MessageCenterModal;
