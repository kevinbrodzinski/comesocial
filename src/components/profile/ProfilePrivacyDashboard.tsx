
import React from 'react';
import { Shield, Eye, MessageCircle, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ExtendedProfileData } from '../../hooks/useExtendedProfileData';

interface ProfilePrivacyDashboardProps {
  profile: ExtendedProfileData;
  onUpdatePrivacy: (field: keyof ExtendedProfileData, value: any) => void;
}

const ProfilePrivacyDashboard = ({ profile, onUpdatePrivacy }: ProfilePrivacyDashboardProps) => {
  const privacySettings = [
    {
      icon: Eye,
      title: 'Profile Visibility',
      description: 'Who can see your profile',
      value: profile.profileVisibility,
      field: 'profileVisibility' as keyof ExtendedProfileData,
      options: [
        { value: 'public', label: 'Public', color: 'bg-green-500' },
        { value: 'friends', label: 'Friends Only', color: 'bg-yellow-500' },
        { value: 'private', label: 'Private', color: 'bg-red-500' }
      ]
    },
    {
      icon: MapPin,
      title: 'Location Sharing',
      description: 'Who can see your location',
      value: profile.locationSharing,
      field: 'locationSharing' as keyof ExtendedProfileData,
      options: [
        { value: 'public', label: 'Public', color: 'bg-green-500' },
        { value: 'friends', label: 'Friends Only', color: 'bg-yellow-500' },
        { value: 'off', label: 'Off', color: 'bg-red-500' }
      ]
    },
    {
      icon: MessageCircle,
      title: 'Messaging',
      description: 'Who can message you',
      value: profile.messagingPermissions,
      field: 'messagingPermissions' as keyof ExtendedProfileData,
      options: [
        { value: 'anyone', label: 'Anyone', color: 'bg-green-500' },
        { value: 'friends', label: 'Friends Only', color: 'bg-yellow-500' },
        { value: 'friends-of-friends', label: 'Friends of Friends', color: 'bg-blue-500' }
      ]
    }
  ];

  const getOptionColor = (setting: any, value: string) => {
    const option = setting.options.find((opt: any) => opt.value === value);
    return option?.color || 'bg-gray-500';
  };

  const getOptionLabel = (setting: any, value: string) => {
    const option = setting.options.find((opt: any) => opt.value === value);
    return option?.label || value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          Privacy Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {privacySettings.map((setting) => {
          const IconComponent = setting.icon;
          return (
            <div key={setting.field} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent size={16} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">{setting.title}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Badge 
                  className={`${getOptionColor(setting, setting.value)} text-white text-xs`}
                >
                  {getOptionLabel(setting, setting.value)}
                </Badge>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Activity Status</p>
              <p className="text-sm text-muted-foreground">Let others see when you're at venues</p>
            </div>
            <Switch
              checked={profile.showActivityStatus}
              onCheckedChange={(checked) => onUpdatePrivacy('showActivityStatus', checked)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield size={14} />
            <span>Your privacy settings are secure and can be changed anytime</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePrivacyDashboard;
