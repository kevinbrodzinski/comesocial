
import React from 'react';
import { X } from 'lucide-react';
import MessageThreadCard from '@/components/messages/MessageThreadCard';

interface MapMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  threads: any[];
}

const MapMessagesModal: React.FC<MapMessagesModalProps> = ({ isOpen, onClose, threads }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-4 top-[var(--map-header-h)] z-50 rounded-xl bg-background p-4 shadow-lg max-h-[70vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Map Group Chats</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto space-y-2 flex-1">
        {threads.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No map group chats yet.</div>
        ) : (
          threads.map(thread => (
            <MessageThreadCard key={thread.id} thread={thread} variant="group" />
          ))
        )}
      </div>
    </div>
  );
};

export default MapMessagesModal;
