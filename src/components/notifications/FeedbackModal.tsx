
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationType: string;
  venue?: string;
  onFeedbackSubmit: (feedback: UserFeedback) => void;
}

interface UserFeedback {
  helpful: boolean;
  relevance: number; // 1-5 stars
  timing: 'too-early' | 'perfect' | 'too-late';
  frequency: 'too-many' | 'just-right' | 'too-few';
  comments?: string;
}

const FeedbackModal = ({ isOpen, onClose, notificationType, venue, onFeedbackSubmit }: FeedbackModalProps) => {
  const [feedback, setFeedback] = useState<Partial<UserFeedback>>({});
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    if (feedback.helpful !== undefined && feedback.relevance) {
      onFeedbackSubmit(feedback as UserFeedback);
      onClose();
      setStep(1);
      setFeedback({});
    }
  };

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Was this notification helpful?</h3>
        <p className="text-sm text-muted-foreground">
          {notificationType} {venue && `for ${venue}`}
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant={feedback.helpful === true ? "default" : "outline"}
          onClick={() => setFeedback(prev => ({ ...prev, helpful: true }))}
          className="flex items-center space-x-2"
        >
          <ThumbsUp size={16} />
          <span>Helpful</span>
        </Button>
        <Button
          variant={feedback.helpful === false ? "default" : "outline"}
          onClick={() => setFeedback(prev => ({ ...prev, helpful: false }))}
          className="flex items-center space-x-2"
        >
          <ThumbsDown size={16} />
          <span>Not helpful</span>
        </Button>
      </div>

      {feedback.helpful !== undefined && (
        <div className="text-center">
          <p className="text-sm mb-3">How relevant was this notification?</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                size="sm"
                onClick={() => setFeedback(prev => ({ ...prev, relevance: rating }))}
                className="p-1"
              >
                <Star 
                  size={20} 
                  className={rating <= (feedback.relevance || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                />
              </Button>
            ))}
          </div>
        </div>
      )}

      {feedback.relevance && (
        <div className="flex justify-center">
          <Button onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Help us improve timing & frequency</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Notification timing:</p>
            <div className="flex space-x-2">
              {(['too-early', 'perfect', 'too-late'] as const).map((timing) => (
                <Button
                  key={timing}
                  variant={feedback.timing === timing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFeedback(prev => ({ ...prev, timing }))}
                  className="text-xs"
                >
                  {timing === 'too-early' ? 'Too Early' : 
                   timing === 'perfect' ? 'Perfect' : 'Too Late'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Notification frequency:</p>
            <div className="flex space-x-2">
              {(['too-many', 'just-right', 'too-few'] as const).map((frequency) => (
                <Button
                  key={frequency}
                  variant={feedback.frequency === frequency ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFeedback(prev => ({ ...prev, frequency }))}
                  className="text-xs"
                >
                  {frequency === 'too-many' ? 'Too Many' : 
                   frequency === 'just-right' ? 'Just Right' : 'Too Few'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Additional comments (optional):</p>
            <Textarea
              placeholder="Any other feedback about our notifications?"
              value={feedback.comments || ''}
              onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
              className="text-sm"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Submit Feedback
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Quick Feedback</span>
            <Badge variant="outline" className="text-xs">
              {step}/2
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-4">
            {step === 1 ? renderStepOne() : renderStepTwo()}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
