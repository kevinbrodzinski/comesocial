import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Clock, Users, ArrowRight, Eye, Trash2, Calendar, Timer } from 'lucide-react';
import RSVPSwitch from './RSVPSwitch';
import RSVPModal from './RSVPModal';
import { getCurrentUserId } from '@/utils/userUtils';
import { getFeatureFlag } from '@/utils/featureFlags';

interface PlanCardPreviewProps {
  plan: any;
  onView: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  userRSVP?: 'going' | 'maybe' | 'cantGo' | null;
  onRSVP?: (response: 'going' | 'maybe' | 'cantGo') => void;
}

const PlanCardPreview = ({ 
  plan, 
  onView, 
  onEdit, 
  onShare, 
  onDelete,
  isOwner = true, 
  userRSVP, 
  onRSVP 
}: PlanCardPreviewProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const planIdentifiersEnabled = getFeatureFlag('plan_identifiers_v1');
  const currentUserId = getCurrentUserId();

  // Determine ownership and plan type
  const getOwnershipInfo = () => {
    if (!planIdentifiersEnabled) return null;
    
    // Mock logic for ownership detection
    if (plan.organizer === 'Current User' || isOwner) {
      return { type: 'owner', label: 'Created by you', color: 'border-[#7B5BFF] text-[#7B5BFF]' };
    } else if (plan.status === 'invited' || (!isOwner && plan.organizer)) {
      return { type: 'invited', label: 'Invited', color: 'border-[#22C55E] text-[#22C55E]' };
    } else {
      return { type: 'coplan', label: 'Co-planning', color: 'border-[#4A8CFF] text-[#4A8CFF]' };
    }
  };

  const ownershipInfo = getOwnershipInfo();
  const isInvitedPlan = ownershipInfo?.type === 'invited';
  const hasUserRSVP = userRSVP && userRSVP !== null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'planned': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'invited': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'maybe': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
  };

  const handleCardClick = () => {
    // If invited plan and no RSVP, show modal first
    if (planIdentifiersEnabled && isInvitedPlan && !hasUserRSVP) {
      setShowRSVPModal(true);
    } else {
      onView();
    }
  };

  const handleRSVPChange = (status: 'going' | 'maybe' | 'cant_go') => {
    // Convert status format for compatibility
    const convertedStatus = status === 'cant_go' ? 'cantGo' : status;
    onRSVP?.(convertedStatus as 'going' | 'maybe' | 'cantGo');
  };

  const renderActionButtons = () => {
    if (!planIdentifiersEnabled) {
      return isOwner ? (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="flex-1 h-8 text-xs"
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
            className="flex-1 h-8 text-xs"
          >
            Share
          </Button>
          {onDelete && (
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                >
                  <Trash2 size={12} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Plan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      ) : (
        <div className="flex gap-2 w-full">
          <Button
            variant={userRSVP === 'going' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRSVP?.('going')}
            className="flex-1 h-8 text-xs"
          >
            Going
          </Button>
          <Button
            variant={userRSVP === 'maybe' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRSVP?.('maybe')}
            className="flex-1 h-8 text-xs"
          >
            Maybe
          </Button>
          <Button
            variant={userRSVP === 'cantGo' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRSVP?.('cantGo')}
            className="flex-1 h-8 text-xs"
          >
            Can't Go
          </Button>
        </div>
      );
    }

    // New behavior with plan identifiers
    if (ownershipInfo?.type === 'owner') {
      return (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="flex-1 h-8 text-xs"
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
            className="flex-1 h-8 text-xs"
          >
            Share
          </Button>
          {onDelete && (
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                >
                  <Trash2 size={12} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{plan.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Plan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </>
      );
    } else if (ownershipInfo?.type === 'coplan') {
      return (
        <>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onView}
            className="flex-1 h-8 text-xs"
          >
            Open Draft
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
            className="flex-1 h-8 text-xs"
          >
            Share
          </Button>
        </>
      );
    } else if (ownershipInfo?.type === 'invited') {
      if (!hasUserRSVP) {
        return (
          <RSVPSwitch
            planId={plan.id}
            currentRsvp={userRSVP === 'cantGo' ? 'cant_go' : userRSVP}
            onRsvpChange={handleRSVPChange}
            layout="inline"
            size="sm"
          />
        );
      } else {
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onView}
            className="w-full h-8 text-xs"
          >
            View Plan
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/30 group bg-card border-border/50 hover:bg-card/80">
        <CardContent className="p-0">
          {/* Mini Map Preview */}
          <div className="h-20 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden border-b border-border/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
            
            {/* Mock route visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {plan.stops?.slice(0, 3).map((_: any, index: number) => (
                  <div key={index} className="flex items-center space-x-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      index === 0 ? 'bg-green-500' : 
                      index === plan.stops.length - 1 ? 'bg-red-500' : 
                      'bg-primary'
                    }`}></div>
                    {index < 2 && <ArrowRight size={10} className="text-primary/50" />}
                  </div>
                ))}
                {plan.stops?.length > 3 && (
                  <span className="text-xs text-primary/60 ml-1">+{plan.stops.length - 3}</span>
                )}
              </div>
            </div>

            {/* View button overlay */}
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs px-2"
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
          </div>

          {/* Plan Content */}
          <div className="p-4" onClick={handleCardClick}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base mb-1 leading-tight truncate">{plan.name}</h3>
                {!isOwner && plan.organizer && (
                  <p className="text-sm text-muted-foreground mb-2 truncate">by {plan.organizer}</p>
                )}
              </div>
              <div className="ml-2 flex flex-col items-end space-y-1">
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </Badge>
                {/* Ownership Badge */}
                {planIdentifiersEnabled && ownershipInfo && (
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] font-medium uppercase px-2 py-1 rounded-full ${ownershipInfo.color}`}
                  >
                    {ownershipInfo.label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={12} className="mr-2 flex-shrink-0" />
                <span className="truncate">{plan.date}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={12} className="mr-2 flex-shrink-0" />
                <span className="truncate">{plan.time}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin size={12} className="mr-2 flex-shrink-0" />
                <span className="truncate">{plan.stops?.[0]?.name || plan.stops?.[0]} {plan.stops?.length > 1 && `+ ${plan.stops.length - 1} more`}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users size={12} className="mr-2 flex-shrink-0" />
                <span className="truncate">{plan.attendees} attending</span>
              </div>
            </div>

            {plan.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {plan.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {renderActionButtons()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RSVP Modal */}
      {planIdentifiersEnabled && (
        <RSVPModal
          isOpen={showRSVPModal}
          onClose={() => setShowRSVPModal(false)}
          plan={plan}
          currentRsvp={userRSVP === 'cantGo' ? 'cant_go' : userRSVP}
          onRsvpChange={handleRSVPChange}
          onViewPlan={onView}
        />
      )}
    </>
  );
};

export default PlanCardPreview;
