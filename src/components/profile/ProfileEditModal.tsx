
import React, { useState, useRef } from 'react';
import { X, Camera, User, MapPin, Heart, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ExtendedProfileData } from '../../hooks/useExtendedProfileData';
import ImageUpload from '../ImageUpload';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ExtendedProfileData;
  onSave: (updates: Partial<ExtendedProfileData>) => void;
}

const ProfileEditModal = ({ isOpen, onClose, profile, onSave }: ProfileEditModalProps) => {
  const [editedProfile, setEditedProfile] = useState<ExtendedProfileData>(profile);
  const [activeTab, setActiveTab] = useState('basic');
  const [newInterest, setNewInterest] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editedProfile);
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
    onClose();
  };

  const updateField = (field: keyof ExtendedProfileData, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !editedProfile.interests.includes(newInterest.trim())) {
      updateField('interests', [...editedProfile.interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    updateField('interests', editedProfile.interests.filter(i => i !== interest));
  };

  const toggleArrayItem = (field: keyof ExtendedProfileData, item: string) => {
    const currentArray = editedProfile[field] as string[];
    const updated = currentArray.includes(item) 
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateField(field, updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <User size={20} />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
              <TabsTrigger value="location" className="text-xs">Location</TabsTrigger>
              <TabsTrigger value="interests" className="text-xs">Interests</TabsTrigger>
              <TabsTrigger value="privacy" className="text-xs">Privacy</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6 mt-0">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={editedProfile.profilePhoto} />
                    <AvatarFallback className="text-2xl">{editedProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                  >
                    <Camera size={12} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      id="username"
                      value={editedProfile.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      className="pl-8"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedProfile.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    maxLength={150}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {editedProfile.bio.length}/150
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Why are you on this app?</Label>
                  <Input
                    id="reason"
                    value={editedProfile.reasonForApp}
                    onChange={(e) => updateField('reasonForApp', e.target.value)}
                    placeholder="Discover new venues, meet people..."
                  />
                </div>
              </div>
            </TabsContent>

            {/* Location & Status Tab */}
            <TabsContent value="location" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="city">Current City</Label>
                  <Input
                    id="city"
                    value={editedProfile.currentCity}
                    onChange={(e) => updateField('currentCity', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>

                <div>
                  <Label htmlFor="currentLocation">Current Location (Optional)</Label>
                  <Input
                    id="currentLocation"
                    value={editedProfile.currentLocation || ''}
                    onChange={(e) => updateField('currentLocation', e.target.value)}
                    placeholder="Sky Bar, Home, etc."
                  />
                </div>

                <div>
                  <Label>Location Status</Label>
                  <Select
                    value={editedProfile.locationStatus}
                    onValueChange={(value) => updateField('locationStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="at-venue">At Venue</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Relationship Status</Label>
                  <Select
                    value={editedProfile.relationshipStatus}
                    onValueChange={(value) => updateField('relationshipStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="In a relationship">In a relationship</SelectItem>
                      <SelectItem value="It's complicated">It's complicated</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Interests Tab */}
            <TabsContent value="interests" className="space-y-6 mt-0">
              <div>
                <Label>Favorite Venue Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Rooftop Bars', 'Dance Clubs', 'Live Music', 'Cocktail Lounges', 'Sports Bars', 'Wine Bars'].map(type => (
                    <Badge
                      key={type}
                      variant={editedProfile.favoriteVenueTypes.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('favoriteVenueTypes', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>What you like to do most often</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Dancing', 'Live Music', 'Cocktail Tasting', 'Meeting New People', 'Karaoke', 'Pool/Billiards'].map(activity => (
                    <Badge
                      key={activity}
                      variant={editedProfile.activities.includes(activity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('activities', activity)}
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Looking For</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['New Friends', 'Activity Partners', 'Nightlife Crew', 'Dating', 'Professional Networking'].map(item => (
                    <Badge
                      key={item}
                      variant={editedProfile.lookingFor.includes(item) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('lookingFor', item)}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Personal Interests</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button onClick={addInterest} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedProfile.interests.map(interest => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select
                    value={editedProfile.profileVisibility}
                    onValueChange={(value) => updateField('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private - Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location Sharing</Label>
                  <Select
                    value={editedProfile.locationSharing}
                    onValueChange={(value) => updateField('locationSharing', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Everyone can see</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="off">Off - No one can see</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Who can message you?</Label>
                  <Select
                    value={editedProfile.messagingPermissions}
                    onValueChange={(value) => updateField('messagingPermissions', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anyone">Anyone</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="friends-of-friends">Friends of Friends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Activity Status</Label>
                    <p className="text-sm text-muted-foreground">Let others see when you're at venues</p>
                  </div>
                  <Switch
                    checked={editedProfile.showActivityStatus}
                    onCheckedChange={(checked) => updateField('showActivityStatus', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6 mt-0">
              <div className="text-center text-muted-foreground">
                <Settings size={48} className="mx-auto mb-4 opacity-50" />
                <p>Advanced settings coming soon...</p>
                <p className="text-sm">Notification preferences, account settings, and more.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
