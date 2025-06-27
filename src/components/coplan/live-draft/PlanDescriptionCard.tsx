
import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getFeatureFlag } from '@/utils/featureFlags';
import { cn } from '@/lib/utils';

interface PlanDescriptionCardProps {
  title: string;
  description: string;
  planType?: string;
  onUpdate: (field: string, value: string) => void;
}

const PlanDescriptionCard = ({ title, description, planType, onUpdate }: PlanDescriptionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(description);
  const iosNavFixEnabled = getFeatureFlag('draft_ios_nav_fix_v1');

  const handleSave = () => {
    onUpdate('description', editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(description);
    setIsEditing(false);
  };

  const planTypeEmojis: Record<string, string> = {
    'dinner-drinks': '🍽️',
    'birthday': '🎉',
    'concert': '🎵',
    'casual-hangout': '☕',
    'night-out': '🌙',
    'special-event': '✨'
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {planType && (
              <span className="text-lg">{planTypeEmojis[planType] || '📋'}</span>
            )}
            <h3 className="font-medium">{title}</h3>
            {planType && (
              <Badge variant="secondary" className="text-xs">
                {planType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </div>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={14} />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={cn(
                "min-h-20",
                iosNavFixEnabled && "text-base md:text-sm"
              )}
              placeholder="Describe what this plan is about..."
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>
                <Check size={14} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={14} className="mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {description || 'No description yet - click edit to add one'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanDescriptionCard;
