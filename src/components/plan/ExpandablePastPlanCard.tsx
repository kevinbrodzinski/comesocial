import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Upload, 
  Calendar, 
  Clock, 
  MapPin,
  Users,
  DollarSign,
  Repeat,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { Plan } from '@/data/plansData';

interface ExpandablePastPlanCardProps {
  plan: Plan;
  onRecreatePlan: (plan: Plan) => void;
  onConnectWithAttendee: (attendeeName: string) => void;
  onUpdatePlan: (planId: number, updates: Partial<Plan>) => void;
}

const ExpandablePastPlanCard = ({ 
  plan, 
  onRecreatePlan, 
  onConnectWithAttendee,
  onUpdatePlan 
}: ExpandablePastPlanCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(plan.userRating || 0);
  const [reviewText, setReviewText] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onUpdatePlan(plan.id, { userRating: newRating });
  };

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;

    const newReview = {
      id: Date.now(),
      text: reviewText,
      rating: rating,
      date: new Date().toISOString()
    };

    const updatedReviews = [...(plan.reviews || []), newReview];
    onUpdatePlan(plan.id, { reviews: updatedReviews });
    setReviewText('');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to a cloud service
    const fakeUrl = URL.createObjectURL(file);
    const newPhoto = {
      id: Date.now(),
      url: fakeUrl,
      caption: '',
      uploadedAt: new Date().toISOString()
    };

    const updatedPhotos = [...(plan.photos || []), newPhoto];
    onUpdatePlan(plan.id, { photos: updatedPhotos });
    setShowPhotoUpload(false);
  };

  const attendanceStatusColors = {
    attended: 'bg-green-100 text-green-800 border-green-200',
    missed: 'bg-red-100 text-red-800 border-red-200',
    partial: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const attendanceStatusLabels = {
    attended: 'Attended',
    missed: 'Missed',
    partial: 'Partially Attended'
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        {/* Main Card Header */}
        <div 
          className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                {plan.attendanceStatus && (
                  <Badge 
                    variant="outline" 
                    className={attendanceStatusColors[plan.attendanceStatus]}
                  >
                    {attendanceStatusLabels[plan.attendanceStatus]}
                  </Badge>
                )}
                {plan.userRating && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{plan.userRating}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{plan.completedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{plan.attendees} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{plan.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>{plan.actualCost || plan.estimatedCost}</span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {plan.stops.map((stop, index) => (
                  <Badge key={stop.id} variant="secondary" className="text-xs">
                    <MapPin size={12} className="mr-1" />
                    {stop.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRecreatePlan(plan);
                }}
                className="hover-scale"
              >
                <Repeat size={16} className="mr-1" />
                Recreate
              </Button>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t bg-muted/20 p-4 space-y-6 animate-fade-in">
            {/* Plan Details */}
            <div>
              <h4 className="font-medium mb-2">Plan Details</h4>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              {plan.notes && (
                <div className="mt-2 p-3 bg-background rounded-lg border">
                  <p className="text-sm">{plan.notes}</p>
                </div>
              )}
            </div>

            {/* Memories & Connections */}
            {(plan.memories?.length || plan.connections?.length) && (
              <div>
                <h4 className="font-medium mb-3">Highlights</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.memories?.length && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">Memories</h5>
                      <ul className="space-y-1">
                        {plan.memories.map((memory, index) => (
                          <li key={index} className="text-sm bg-background p-2 rounded border">
                            {memory}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {plan.connections?.length && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-muted-foreground">New Connections</h5>
                      <div className="space-y-1">
                        {plan.connections.map((person, index) => (
                          <div key={index} className="flex items-center justify-between bg-background p-2 rounded border">
                            <span className="text-sm">{person}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onConnectWithAttendee(person)}
                              className="text-xs"
                            >
                              Connect
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photos Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Photos</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPhotoUpload(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Photo
                </Button>
              </div>
              
              {plan.photos?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {plan.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Plan memory'}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg">
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-background rounded-lg border border-dashed">
                  <ImageIcon size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No photos yet</p>
                </div>
              )}

              {showPhotoUpload && (
                <div className="mt-3 p-3 bg-background rounded-lg border">
                  <label className="block">
                    <span className="text-sm font-medium mb-2 block">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </label>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => setShowPhotoUpload(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h4 className="font-medium mb-3">Your Review</h4>
              
              {/* Existing Reviews */}
              {plan.reviews?.length && (
                <div className="space-y-3 mb-4">
                  {plan.reviews.map((review) => (
                    <div key={review.id} className="bg-background p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= review.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-muted-foreground'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Review */}
              <div className="bg-background p-4 rounded-lg border space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          size={20}
                          className={star <= rating 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-muted-foreground hover:text-yellow-400'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Write a review</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How was your night out? Share your thoughts..."
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  onClick={handleReviewSubmit}
                  disabled={!reviewText.trim() || rating === 0}
                  size="sm"
                >
                  Add Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpandablePastPlanCard;
