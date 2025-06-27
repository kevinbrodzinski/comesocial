
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Eye, Trash2, Users, Clock } from 'lucide-react';
import { PlannerDraft } from '@/types/coPlanTypes';
import { cn } from '@/lib/utils';

interface DraftPlanCardProps {
  draft: PlannerDraft;
  onEdit: (draft: PlannerDraft) => void;
  onView: (draft: PlannerDraft) => void;
  onDelete: (draftId: string, draftTitle: string) => void;
  isHighlighted?: boolean;
}

const DraftPlanCard = ({ draft, onEdit, onView, onDelete, isHighlighted = false }: DraftPlanCardProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn(
      "border-dashed border-primary/50 bg-primary/5 transition-all duration-300",
      isHighlighted && "bg-primary/10 border-primary shadow-md"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-base truncate">
                {draft.title || 'Untitled Draft'}
              </h3>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                DRAFT
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {draft.description || 'No description'}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={10} />
              Edited · {formatDate(draft.updated_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users size={12} />
              <span>{draft.participants.length} participants</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {draft.participants.slice(0, 3).map((participant, index) => (
              <Avatar key={participant.id} className="h-6 w-6">
                <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
              </Avatar>
            ))}
            {draft.participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs">+{draft.participants.length - 3}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-3">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onEdit(draft)}
            className="flex-1"
          >
            <Edit size={14} className="mr-1" />
            Continue Editing
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(draft)}
          >
            <Eye size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(draft.id, draft.title || 'Untitled Draft')}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftPlanCard;
