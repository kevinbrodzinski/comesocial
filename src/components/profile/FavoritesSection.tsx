
import React, { useState } from 'react';
import { MapPin, Heart, Bell, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FavoriteVenue } from '../../hooks/useProfileData';

interface FavoritesSectionProps {
  favorites: FavoriteVenue[];
}

const FavoritesSection = ({ favorites }: FavoritesSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: 'All Favorites' },
    { id: 'most-visited', label: 'Most Visited' },
    { id: 'saved', label: 'Saved' },
    { id: 'notify-when-busy', label: 'Notify Me' }
  ];

  const filteredFavorites = selectedCategory === 'all' 
    ? favorites 
    : favorites.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Badge>
        ))}
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {filteredFavorites.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="p-8 text-center">
              <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No favorites yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start exploring and save your favorite venues
              </p>
              <Button size="sm">Discover Venues</Button>
            </CardContent>
          </Card>
        ) : (
          filteredFavorites.map((venue) => (
            <Card key={venue.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="flex">
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    className="w-24 h-24 object-cover rounded-l-lg"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{venue.name}</h4>
                        <p className="text-sm text-muted-foreground">{venue.type}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {venue.visitCount > 0 && (
                          <div className="flex items-center">
                            <Star size={12} className="mr-1" />
                            {venue.visitCount} visits
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {venue.lastVisited && (
                        <span>Last visit: {new Date(venue.lastVisited).toLocaleDateString()}</span>
                      )}
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <MapPin size={12} className="mr-1" />
                          Directions
                        </Button>
                        {venue.category === 'notify-when-busy'  && (
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Bell size={12} className="mr-1" />
                            Notifications
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesSection;
