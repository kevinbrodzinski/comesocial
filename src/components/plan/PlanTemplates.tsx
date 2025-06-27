
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Heart, Cake, Music, Coffee } from 'lucide-react';

interface PlanTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: string;
  groupSize: string;
  stops: string[];
  color: string;
}

interface PlanTemplatesProps {
  onSelectTemplate: (template: PlanTemplate) => void;
}

const PlanTemplates = ({ onSelectTemplate }: PlanTemplatesProps) => {
  const templates: PlanTemplate[] = [
    {
      id: 'date-night',
      name: 'Date Night',
      icon: <Heart size={20} className="text-pink-500" />,
      description: 'Romantic evening for two',
      duration: '3-4 hours',
      groupSize: '2 people',
      stops: ['Dinner', 'Cocktails', 'Rooftop views'],
      color: 'bg-pink-50 border-pink-200 hover:border-pink-300'
    },
    {
      id: 'birthday-bash',
      name: 'Birthday Bash',
      icon: <Cake size={20} className="text-purple-500" />,
      description: 'Celebrate in style',
      duration: '5-6 hours',
      groupSize: '8-12 people',
      stops: ['Pre-drinks', 'Dinner', 'Dancing', 'Late night'],
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
    },
    {
      id: 'bar-crawl',
      name: 'Bar Crawl',
      icon: <Music size={20} className="text-blue-500" />,
      description: 'Epic night out with friends',
      duration: '6+ hours',
      groupSize: '4-8 people',
      stops: ['Sports bar', 'Cocktail lounge', 'Dance club', 'Late night eats'],
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
    },
    {
      id: 'chill-night',
      name: 'Chill Vibes',
      icon: <Coffee size={20} className="text-green-500" />,
      description: 'Relaxed evening',
      duration: '2-3 hours',
      groupSize: '3-5 people',
      stops: ['Cafe', 'Wine bar', 'Live music'],
      color: 'bg-green-50 border-green-200 hover:border-green-300'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quick Start Templates</h3>
      <p className="text-sm text-muted-foreground">
        Choose a template to get started quickly
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${template.color}`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{template.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{template.groupSize}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.stops.map((stop, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="text-xs px-2 py-0"
                      >
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanTemplates;
