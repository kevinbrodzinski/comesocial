
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const usePlanFormLogic = (editingPlan?: any, isOpen?: boolean) => {
  const [planData, setPlanData] = useState({
    name: '',
    date: '',
    time: '',
    meetupLocation: '',
    stops: [],
    invitedFriends: [],
    notes: '',
    estimatedCost: 0,
    splitPayment: false,
    paymentSetup: null,
    isPublic: false,
    estimatedDuration: 0
  });

  const [step, setStep] = useState(1);
  const [dateValidation, setDateValidation] = useState({ isValid: true, message: '' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize form with editing plan data or Nova prefill data
  useEffect(() => {
    if (editingPlan) {
      setPlanData({
        name: editingPlan.name || '',
        date: editingPlan.date || '',
        time: editingPlan.time || '',
        meetupLocation: editingPlan.meetupLocation || '',
        stops: editingPlan.stops?.map(stop => typeof stop === 'string' ? { id: Date.now() + Math.random(), name: stop, type: 'venue', estimatedTime: 90, cost: 25 } : stop) || [],
        invitedFriends: editingPlan.invitedFriends || [],
        notes: editingPlan.notes || '',
        estimatedCost: editingPlan.estimatedCost || 0,
        splitPayment: editingPlan.splitPayment || false,
        paymentSetup: editingPlan.paymentSetup || null,
        isPublic: editingPlan.isPublic || false,
        estimatedDuration: editingPlan.estimatedDuration || 0
      });
      setStep(1);
      
      // If this is Nova prefill data (has stops but no ID), show toast
      if (editingPlan.stops && editingPlan.stops.length > 0 && !editingPlan.id) {
        toast({
          title: "Nova suggestion added!",
          description: "Your plan has been pre-filled with Nova's recommendation",
        });
      }
    } else {
      // Reset form for new plan
      setPlanData({
        name: '',
        date: '',
        time: '',
        meetupLocation: '',
        stops: [],
        invitedFriends: [],
        notes: '',
        estimatedCost: 0,
        splitPayment: false,
        paymentSetup: null,
        isPublic: false,
        estimatedDuration: 0
      });
      setStep(1);
    }
  }, [editingPlan, isOpen, toast]);

  const trackPlanEvent = (eventType: string, data: any) => {
    console.log(`Analytics: ${eventType}`, data);
  };

  const handleInputChange = (field: string, value: any) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
    
    trackPlanEvent('plan_field_updated', {
      field,
      value,
      step,
      timestamp: new Date().toISOString()
    });
  };

  const nextStep = () => setStep(Math.min(4, step + 1));
  const prevStep = () => setStep(Math.max(1, step - 1));

  const getStepTitle = () => {
    const isNovaPrefill = editingPlan && editingPlan.stops?.length > 0 && !editingPlan.id;
    const prefix = isNovaPrefill ? 'Nova Plan' : (editingPlan?.id ? 'Edit' : 'Create');
    
    switch (step) {
      case 1: return `${prefix} Plan Details`;
      case 2: return 'Add Stops';
      case 3: return 'Invite Friends';
      case 4: return 'Review & Save';
      default: return `${prefix} Plan`;
    }
  };

  const canProceedToNext = () => {
    switch (step) {
      case 1: return planData.name && planData.date;
      case 2: return planData.stops.length > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  return {
    planData,
    setPlanData,
    step,
    setStep,
    dateValidation,
    setDateValidation,
    draggedIndex,
    setDraggedIndex,
    handleInputChange,
    nextStep,
    prevStep,
    getStepTitle,
    canProceedToNext,
    trackPlanEvent,
    toast
  };
};
