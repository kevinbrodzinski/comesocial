
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '../../hooks/useProfileData';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection = ({ achievements }: AchievementsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'Check-ins', 'Planner', 'Friends', 'Venue Type', 'Streaks', 'Content'];
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">{unlockedCount}/{achievements.length}</div>
        <div className="text-sm text-muted-foreground">Badges Unlocked</div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All' : category}
          </Badge>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`${achievement.unlocked ? 'border-primary/30 bg-primary/5' : 'opacity-60'} cursor-pointer hover:shadow-md transition-all`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    {achievement.unlocked && (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="space-y-2">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress!) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-muted-foreground">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
