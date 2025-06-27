
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Users, Eye, Calendar, ChevronDown } from 'lucide-react';
import { useTrendingFeed } from '@/hooks/useTrendingFeed';
import { useFriendsData } from '@/hooks/useFriendsData';

interface TrendingCarouselProps {
  onEventClick: (eventId: number) => void;
}

const TrendingCarousel = ({ onEventClick }: TrendingCarouselProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { friends } = useFriendsData();
  const { getTrendingEvents } = useTrendingFeed(friends);
  
  const trendingEvents = getTrendingEvents(3);

  if (trendingEvents.length === 0) return null;

  return (
    <div className="mb-6">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="px-4">
          <CollapsibleTrigger className="w-full group">
            <div className="flex items-center justify-between py-3 hover:bg-secondary/30 rounded-lg px-2 transition-colors">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  🔥 Trending with friends
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {trendingEvents.length} hot spots
                </Badge>
              </div>
              
              <ChevronDown 
                size={20} 
                className={`text-muted-foreground transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
            
            {!isExpanded && (
              <div className="text-xs text-muted-foreground text-left px-2 pb-2">
                Tap to see what's trending with your friends
              </div>
            )}
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="flex space-x-3 px-4 overflow-x-auto pb-2 pt-2">
            {trendingEvents.map((event) => (
              <Card 
                key={event.id} 
                className="flex-shrink-0 w-72 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => onEventClick(event.id)}
              >
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <Badge 
                    className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600"
                  >
                    {event.trendingScore}% buzz
                  </Badge>
                </div>
                
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.venue} • {event.timeframe}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Eye size={12} className="mr-1 text-muted-foreground" />
                          <span>{event.friendEngagement.watching.length}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1 text-muted-foreground" />
                          <span>{event.friendEngagement.rsvped.length}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={12} className="mr-1 text-muted-foreground" />
                          <span>{event.friendEngagement.checkedIn.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Friend avatars */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {event.friendEngagement.watching.slice(0, 3).map((friend) => (
                          <div
                            key={friend.id}
                            className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border-2 border-background"
                          >
                            {friend.avatar}
                          </div>
                        ))}
                        {event.friendEngagement.watching.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center border-2 border-background">
                            +{event.friendEngagement.watching.length - 3}
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TrendingCarousel;
