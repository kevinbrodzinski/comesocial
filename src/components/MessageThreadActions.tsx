
import React, { useState } from 'react';
import { MoreHorizontal, Trash2, Archive, VolumeX, Search, AlertTriangle, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import NotificationService from '@/services/NotificationService';

interface MessageThreadActionsProps {
  threadId: string;
  friendName: string;
  isPinned?: boolean;
  onDeleteThread?: (threadId: string) => void;
  onArchiveThread?: (threadId: string) => void;
  onMuteThread?: (threadId: string) => void;
  onSearchInThread?: (threadId: string) => void;
  onPinToggle?: (threadId: string, isPinned: boolean) => void;
}

const MessageThreadActions = ({ 
  threadId, 
  friendName,
  isPinned = false,
  onDeleteThread, 
  onArchiveThread, 
  onMuteThread, 
  onSearchInThread,
  onPinToggle
}: MessageThreadActionsProps) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteOption, setDeleteOption] = useState<'delete' | 'clear'>('delete');
  const { toast } = useToast();
  const notificationService = NotificationService.getInstance();

  const handleDeleteConfirm = () => {
    if (deleteOption === 'delete') {
      onDeleteThread?.(threadId);
      toast({
        title: "Conversation deleted",
        description: `Conversation with ${friendName} has been permanently deleted`,
      });
    } else {
      toast({
        title: "Chat history cleared",
        description: `Chat history with ${friendName} has been cleared`,
      });
    }
    setDeleteDialog(false);
  };

  const handleArchive = () => {
    onArchiveThread?.(threadId);
    toast({
      title: "Conversation archived",
      description: `Conversation with ${friendName} has been archived`,
    });
  };

  const handleMute = () => {
    onMuteThread?.(threadId);
    toast({
      title: "Conversation muted",
      description: `You won't receive notifications from ${friendName}`,
    });
  };

  const handlePinToggle = () => {
    const newPinnedState = !isPinned;
    notificationService.toggleThreadPin(threadId);
    onPinToggle?.(threadId, newPinnedState);
    
    toast({
      title: newPinnedState ? "Conversation pinned" : "Conversation unpinned",
      description: newPinnedState 
        ? `Conversation with ${friendName} will stay at the top`
        : `Conversation with ${friendName} unpinned`,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handlePinToggle}>
            {isPinned ? (
              <>
                <PinOff size={14} className="mr-2" />
                Unpin conversation
              </>
            ) : (
              <>
                <Pin size={14} className="mr-2" />
                Pin conversation
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSearchInThread?.(threadId)}>
            <Search size={14} className="mr-2" />
            Search in chat
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive}>
            <Archive size={14} className="mr-2" />
            Archive conversation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMute}>
            <VolumeX size={14} className="mr-2" />
            Mute notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 size={14} className="mr-2" />
            Delete conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              Delete Conversation?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Choose how you want to handle this conversation with <strong>{friendName}</strong>:</p>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="deleteOption" 
                    value="clear"
                    checked={deleteOption === 'clear'}
                    onChange={(e) => setDeleteOption(e.target.value as 'clear')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Clear chat history</p>
                    <p className="text-sm text-muted-foreground">
                      Remove all messages but keep the friendship intact
                    </p>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="deleteOption" 
                    value="delete"
                    checked={deleteOption === 'delete'}
                    onChange={(e) => setDeleteOption(e.target.value as 'delete')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Delete entire conversation</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently remove this conversation thread
                    </p>
                  </div>
                </label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteOption === 'clear' ? 'Clear History' : 'Delete Conversation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessageThreadActions;
