
import React from 'react';
import { TrendingUp, Users, Clock, DollarSign, Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanAnalyticsProps {
  planData: any;
  onTrackEvent: (eventType: string, data: any) => void;
}

const PlanAnalytics = ({ planData, onTrackEvent }: PlanAnalyticsProps) => {
  // Track plan creation analytics
  React.useEffect(() => {
    onTrackEvent('plan_creation_started', {
      step: 'analytics_view',
      plan_name: planData.name,
      stops_count: planData.stops.length,
      attendees_count: planData.invitedFriends.length + 1,
      estimated_cost: planData.estimatedCost,
      timestamp: new Date().toISOString()
    });
  }, []);

  const predictSuccessScore = () => {
    let score = 50; // Base score
    
    // Plan name quality
    if (planData.name && planData.name.length > 5) score += 10;
    
    // Optimal timing
    const planTime = planData.time ? parseInt(planData.time.split(':')[0]) : 20;
    if (planTime >= 19 && planTime <= 23) score += 15;
    
    // Group size sweet spot
    const groupSize = planData.invitedFriends.length + 1;
    if (groupSize >= 3 && groupSize <= 6) score += 15;
    else if (groupSize >= 2 && groupSize <= 8) score += 10;
    
    // Stop count optimization
    if (planData.stops.length >= 2 && planData.stops.length <= 4) score += 10;
    
    // Cost reasonableness
    if (planData.estimatedCost >= 30 && planData.estimatedCost <= 120) score += 10;
    
    return Math.min(100, Math.max(0, score));
  };

  const getOptimizationTips = () => {
    const tips = [];
    const groupSize = planData.invitedFriends.length + 1;
    
    if (groupSize < 3) {
      tips.push({ icon: Users, text: "Consider inviting 1-2 more friends for optimal group dynamics", type: "suggestion" });
    }
    
    if (planData.stops.length > 4) {
      tips.push({ icon: Clock, text: "4+ stops might be ambitious - consider prioritizing top venues", type: "warning" });
    }
    
    if (planData.estimatedCost > 150) {
      tips.push({ icon: DollarSign, text: "High cost estimate - consider more budget-friendly options", type: "warning" });
    }
    
    if (!planData.meetupLocation) {
      tips.push({ icon: MapPin, text: "Setting a meetup location increases plan success by 40%", type: "suggestion" });
    }
    
    return tips;
  };

  const successScore = predictSuccessScore();
  const optimizationTips = getOptimizationTips();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <TrendingUp size={16} className="mr-2" />
            Plan Success Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Success Score</span>
            <Badge 
              variant={successScore >= 80 ? "default" : successScore >= 60 ? "secondary" : "outline"}
              className="text-sm"
            >
              {successScore}%
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                successScore >= 80 ? 'bg-green-500' : 
                successScore >= 60 ? 'bg-blue-500' : 'bg-orange-500'
              }`}
              style={{ width: `${successScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on group size, timing, venue count, and cost analysis
          </p>
        </CardContent>
      </Card>

      {optimizationTips.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Star size={16} className="mr-2" />
              Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {optimizationTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <IconComponent 
                    size={14} 
                    className={`mt-0.5 ${
                      tip.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
                    }`} 
                  />
                  <span className="text-sm text-muted-foreground">{tip.text}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">${planData.estimatedCost}</div>
              <div className="text-xs text-muted-foreground">Est. Cost/Person</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{planData.invitedFriends.length + 1}</div>
              <div className="text-xs text-muted-foreground">Total Attendees</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanAnalytics;
