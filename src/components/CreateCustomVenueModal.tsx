
import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';

interface CreateCustomVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVenue: (venueData: any) => void;
}

const CreateCustomVenueModal = ({ isOpen, onClose, onCreateVenue }: CreateCustomVenueModalProps) => {
  const [venueData, setVenueData] = useState({
    name: '',
    type: '',
    address: '',
    description: '',
    image: null as File | null,
    imagePreview: null as string | null,
    estimatedTime: 60,
    avgCost: 25
  });
  const { toast } = useToast();

  const venueTypes = [
    'Bar', 'Nightclub', 'Restaurant', 'Rooftop Bar', 'Speakeasy', 
    'Wine Bar', 'Cocktail Lounge', 'Sports Bar', 'Cafe', 'Other'
  ];

  const handleInputChange = (field: string, value: any) => {
    setVenueData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setVenueData(prev => ({
      ...prev,
      image: file,
      imagePreview: imageUrl
    }));
  };

  const handleImageRemove = () => {
    if (venueData.imagePreview) {
      URL.revokeObjectURL(venueData.imagePreview);
    }
    setVenueData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleCreateVenue = () => {
    if (!venueData.name.trim() || !venueData.type) {
      toast({
        title: "Venue incomplete",
        description: "Please add a name and type for your venue",
        variant: "destructive"
      });
      return;
    }

    const newVenue = {
      id: Date.now(),
      name: venueData.name,
      type: venueData.type,
      address: venueData.address,
      description: venueData.description,
      image: venueData.imagePreview || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop',
      distance: '0.0 mi',
      crowdLevel: Math.floor(Math.random() * 100),
      vibe: 'Custom',
      rating: 4.0,
      averageWait: '5-10 min',
      bestTimes: ['Custom hours'],
      features: ['Custom venue'],
      lastVisited: 'Never',
      estimatedTime: venueData.estimatedTime,
      avgCost: venueData.avgCost
    };

    onCreateVenue(newVenue);
    
    // Clean up
    if (venueData.imagePreview) {
      URL.revokeObjectURL(venueData.imagePreview);
    }
    
    setVenueData({
      name: '',
      type: '',
      address: '',
      description: '',
      image: null,
      imagePreview: null,
      estimatedTime: 60,
      avgCost: 25
    });

    toast({
      title: "Custom venue created! 🏢",
      description: `"${venueData.name}" has been added to your plan`,
    });

    onClose();
  };

  const handleClose = () => {
    if (venueData.imagePreview) {
      URL.revokeObjectURL(venueData.imagePreview);
    }
    setVenueData({
      name: '',
      type: '',
      address: '',
      description: '',
      image: null,
      imagePreview: null,
      estimatedTime: 60,
      avgCost: 25
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Venue</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="venue-name">Venue Name *</Label>
            <Input
              id="venue-name"
              value={venueData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter venue name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="venue-type">Type *</Label>
            <Select value={venueData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent>
                {venueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="venue-address">Address</Label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="venue-address"
                value={venueData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter venue address"
                className="pl-10 mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Venue Image (Optional)</Label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              currentImage={venueData.imagePreview}
              placeholder="Add a photo of this venue"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="venue-description">Description</Label>
            <Textarea
              id="venue-description"
              value={venueData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe this venue..."
              className="mt-1 resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated-time">Est. Time (min)</Label>
              <Input
                id="estimated-time"
                type="number"
                value={venueData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 60)}
                className="mt-1"
                min="15"
                max="300"
              />
            </div>
            <div>
              <Label htmlFor="avg-cost">Avg. Cost ($)</Label>
              <Input
                id="avg-cost"
                type="number"
                value={venueData.avgCost}
                onChange={(e) => handleInputChange('avgCost', parseInt(e.target.value) || 25)}
                className="mt-1"
                min="5"
                max="200"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateVenue} className="flex-1">
              Create Venue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomVenueModal;
