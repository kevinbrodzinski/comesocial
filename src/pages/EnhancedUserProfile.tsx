
import React, { useState } from 'react';
import { ArrowLeft, Edit, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuzzLevelSection from '../components/profile/BuzzLevelSection';
import AchievementsSection from '../components/profile/AchievementsSection';
import CheckInHistorySection from '../components/profile/CheckInHistorySection';
import FavoritesSection from '../components/profile/FavoritesSection';
import RecentPlansSection from '../components/profile/RecentPlansSection';
import EnhancedProfileDisplay from '../components/profile/EnhancedProfileDisplay';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import { useProfileData } from '../hooks/useProfileData';
import { useExtendedProfileData } from '../hooks/useExtendedProfileData';

const EnhancedUserProfile = ({ onBack }: { onBack?: () => void }) => {
  const { buzzLevel, achievements, checkInHistory, favorites, recentPlans } = useProfileData();
  const { extendedProfile, updateProfile } = useExtendedProfileData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      <div className="relative bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 pb-6">
        <div className="flex items-center justify-between p-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="bg-background/80 hover:bg-background"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="bg-background/80 ml-auto"
          >
            <Edit size={14} className="mr-2" />
            Edit Profile
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

      {/* Content */}
      <div className="px-6 -mt-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-card shadow-lg">
            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="buzz-level" className="text-xs">Buzz</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs">Badges</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
            <TabsTrigger value="plans" className="text-xs">Plans</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile">
              <EnhancedProfileDisplay profile={extendedProfile} />
            </TabsContent>
            
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

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={extendedProfile}
        onSave={updateProfile}
      />
    </div>
  );
};

export default EnhancedUserProfile;
