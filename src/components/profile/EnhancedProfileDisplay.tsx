
import React from 'react';
import { MapPin, Users, Heart, Eye, Calendar, Music } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExtendedProfileData } from '../../hooks/useExtendedProfileData';

interface EnhancedProfileDisplayProps {
  profile: ExtendedProfileData;
}

const EnhancedProfileDisplay = ({ profile }: EnhancedProfileDisplayProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'at-venue': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'at-venue': return profile.currentLocation ? `At ${profile.currentLocation}` : 'At Venue';
      default: return 'Offline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      {profile.coverPhoto && (
        <div
          className="h-32 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${profile.coverPhoto})` }}
        />
      )}

      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.profilePhoto} />
            <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(profile.locationStatus)} rounded-full border-2 border-background`} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin size={12} />
            {profile.currentCity} • {getStatusText(profile.locationStatus)}
          </p>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground">Check-ins this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-xs text-muted-foreground">Plans created</div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Heart size={16} className="text-primary" />
            About {profile.name.split(' ')[0]}
          </h3>
          
          {profile.reasonForApp && (
            <div>
              <p className="text-sm font-medium">Why I'm here:</p>
              <p className="text-sm text-muted-foreground">{profile.reasonForApp}</p>
            </div>
          )}

          {profile.relationshipStatus !== 'Prefer not to say' && (
            <div>
              <p className="text-sm font-medium">Relationship Status:</p>
              <p className="text-sm text-muted-foreground">{profile.relationshipStatus}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Venue Types */}
      {profile.favoriteVenueTypes.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Eye size={16} className="text-primary" />
              Favorite Venues
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteVenueTypes.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities */}
      {profile.activities.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Music size={16} className="text-primary" />
              What I Love To Do
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.activities.map(activity => (
                <Badge key={activity} variant="outline" className="text-xs">
                  {activity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Looking For */}
      {profile.lookingFor.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Looking For
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.lookingFor.map(item => (
                <Badge key={item} variant="default" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Interests */}
      {profile.interests.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Personal Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProfileDisplay;
