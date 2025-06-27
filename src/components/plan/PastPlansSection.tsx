
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, UserPlus } from 'lucide-react';
import { Plan } from '@/data/plansData';
import ExpandablePastPlanCard from './ExpandablePastPlanCard';

interface PastPlansSectionProps {
  pastPlans: Plan[];
  onRecreatePlan: (plan: Plan) => void;
  onConnectWithAttendee: (attendeeName: string) => void;
  onUpdatePlan: (planId: number, updates: Partial<Plan>) => void;
}

const PastPlansSection = ({ 
  pastPlans, 
  onRecreatePlan, 
  onConnectWithAttendee,
  onUpdatePlan 
}: PastPlansSectionProps) => {
  const totalPlansAttended = pastPlans.filter(p => p.attendanceStatus === 'attended').length;
  const averageRating = pastPlans.reduce((sum, p) => sum + (p.userRating || 0), 0) / pastPlans.length;

  return (
    <div className="space-y-6">
      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="text-yellow-500" size={24} />
          </div>
          <div className="text-2xl font-bold">{totalPlansAttended}</div>
          <div className="text-sm text-muted-foreground">Plans Attended</div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Star className="text-yellow-500" size={24} />
          </div>
          <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <UserPlus className="text-primary" size={24} />
          </div>
          <div className="text-2xl font-bold">
            {pastPlans.reduce((sum, p) => sum + (p.connections?.length || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">New Connections</div>
        </Card>
      </div>

      {/* Past Plans List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Night Out History</h3>
        
        {pastPlans.map((plan) => (
          <ExpandablePastPlanCard
            key={plan.id}
            plan={plan}
            onRecreatePlan={onRecreatePlan}
            onConnectWithAttendee={onConnectWithAttendee}
            onUpdatePlan={onUpdatePlan}
          />
        ))}
      </div>
    </div>
  );
};

export default PastPlansSection;
