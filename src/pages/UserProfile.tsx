
import React, { useState } from 'react';
import { ArrowLeft, Edit, Trophy, MapPin, Calendar, Heart, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import BuzzLevelSection from '../components/profile/BuzzLevelSection';
import AchievementsSection from '../components/profile/AchievementsSection';
import CheckInHistorySection from '../components/profile/CheckInHistorySection';
import FavoritesSection from '../components/profile/FavoritesSection';
import RecentPlansSection from '../components/profile/RecentPlansSection';
import { useProfileData } from '../hooks/useProfileData';

const UserProfile = ({ onBack }: { onBack?: () => void }) => {
  const { profileData, buzzLevel, achievements, checkInHistory, favorites, recentPlans } = useProfileData();
  const [isEditing, setIsEditing] = useState(false);

  const getBuzzLevelColor = (score: number) => {
    if (score >= 80) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    if (score >= 60) return 'text-pink-500 bg-pink-500/10 border-pink-500/30';
    if (score >= 40) return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
    if (score >= 20) return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
  };

  const getBuzzLevelLabel = (score: number) => {
    if (score >= 80) return 'City Legend';
    if (score >= 60) return 'Socialite';
    if (score >= 40) return 'Local';
    if (score >= 20) return 'Lurker';
    return 'Ghost';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 pb-20">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 z-10 bg-background/80 hover:bg-background"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        )}
        
        <div className="pt-16 pb-6 px-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 bg-background"
                  onClick={() => console.log('Change photo')}
                >
                  <Camera size={12} />
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                <p className="text-muted-foreground">@{profileData.handle}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-background/80"
            >
              <Edit size={14} className="mr-2" />
              Edit
            </Button>
          </div>

          {/* Buzz Level Badge */}
          <div className="flex items-center justify-center">
            <Badge className={`${getBuzzLevelColor(buzzLevel.score)} px-4 py-2 text-sm font-bold border animate-pulse`}>
              <Trophy size={14} className="mr-2" />
              {getBuzzLevelLabel(buzzLevel.score)} • {buzzLevel.score}/100
            </Badge>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6 -mt-12">
        <Tabs defaultValue="buzz-level" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-card shadow-lg">
            <TabsTrigger value="buzz-level" className="text-xs">Buzz</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">Badges</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
            <TabsTrigger value="plans" className="text-xs">Plans</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="buzz-level">
              <BuzzLevelSection buzzLevel={buzzLevel} />
            </TabsContent>
            
            <TabsContent value="achievements">
              <AchievementsSection achievements={achievements} />
            </TabsContent>
            
            <TabsContent value="history">
              <CheckInHistorySection history={checkInHistory} />
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoritesSection favorites={favorites} />
            </TabsContent>
            
            <TabsContent value="plans">
              <RecentPlansSection plans={recentPlans} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
