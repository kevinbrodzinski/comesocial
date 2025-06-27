
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyMessagesState = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No messages yet</h3>
        <p className="text-muted-foreground">
          Your friend messages and venue pings will appear here
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyMessagesState;
