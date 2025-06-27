
import React from 'react';
import { Calendar, Users, MapPin, DollarSign, Star, RotateCcw, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecentPlan } from '../../hooks/useProfileData';

interface RecentPlansSectionProps {
  plans: RecentPlan[];
}

const RecentPlansSection = ({ plans }: RecentPlansSectionProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground mb-6">
        Your night out history • {plans.length} plans
      </div>

      {plans.map((plan) => (
        <Card key={plan.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">{plan.name}</h4>
                <div className="flex items-center text-sm text-muted-foreground space-x-3">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(plan.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users size={12} className="mr-1" />
                    {plan.attendees.length + 1} people
                  </div>
                </div>
              </div>
              
              <Badge 
                variant={plan.type === 'created' ? 'default' : 'outline'}
                className="text-xs"
              >
                {plan.type === 'created' ? 'Created' : 'Attended'}
              </Badge>
            </div>

            {/* Plan Details */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Stops</div>
                <div className="flex items-center text-sm">
                  <MapPin size={14} className="mr-2 text-primary" />
                  {plan.stops.join(' → ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <DollarSign size={14} className="mr-1 text-muted-foreground" />
                  <span>{plan.cost} total</span>
                </div>
                
                {plan.rating && (
                  <div className="flex items-center space-x-1">
                    {renderStars(plan.rating)}
                    <span className="text-xs text-muted-foreground ml-1">
                      {plan.rating}/5
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Went with</div>
                <div className="text-sm">{plan.attendees.join(', ')}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1">
                <RotateCcw size={14} className="mr-2" />
                Recreate Plan
              </Button>
              
              {!plan.rating && (
                <Button variant="outline" size="sm" className="flex-1">
                  <ThumbsUp size={14} className="mr-2" />
                  Rate Night
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentPlansSection;
