
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Users, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PaymentSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCost: number;
  attendees: any[];
  planName: string;
  onSetupPayment: (paymentData: any) => void;
}

const PaymentSplitModal = ({ isOpen, onClose, totalCost, attendees, planName, onSetupPayment }: PaymentSplitModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'apple-pay' | 'venmo'>('stripe');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: number }>({});
  const [organizer, setOrganizer] = useState('me');
  const { toast } = useToast();

  const totalAttendees = attendees.length + 1; // +1 for organizer
  const equalSplit = Math.round(totalCost / totalAttendees);

  const handleCustomAmountChange = (personId: string, amount: number) => {
    setCustomAmounts(prev => ({
      ...prev,
      [personId]: amount
    }));
  };

  const getTotalCustomAmounts = () => {
    return Object.values(customAmounts).reduce((sum, amount) => sum + amount, 0);
  };

  const handleSetupPayment = () => {
    const paymentData = {
      method: paymentMethod,
      splitType,
      totalCost,
      attendees: attendees.map(attendee => ({
        ...attendee,
        amount: splitType === 'equal' ? equalSplit : customAmounts[attendee.id] || 0
      })),
      organizerAmount: splitType === 'equal' ? equalSplit : customAmounts['organizer'] || 0,
      planName
    };

    // Simulate Stripe/Apple Pay setup
    if (paymentMethod === 'stripe') {
      // This would integrate with Stripe API
      toast({
        title: "Payment Setup Complete",
        description: "Secure payment links sent to all attendees"
      });
    } else if (paymentMethod === 'apple-pay') {
      // This would integrate with Apple Pay
      toast({
        title: "Apple Pay Configured",
        description: "Payment requests will be sent via Apple Pay"
      });
    }

    onSetupPayment(paymentData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setup Payment Splitting</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3 rounded-lg border transition-all ${
                  paymentMethod === 'stripe' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
              >
                <CreditCard size={20} className="mx-auto mb-1" />
                <span className="text-xs">Stripe</span>
              </button>
              <button
                onClick={() => setPaymentMethod('apple-pay')}
                className={`p-3 rounded-lg border transition-all ${
                  paymentMethod === 'apple-pay' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
              >
                <Smartphone size={20} className="mx-auto mb-1" />
                <span className="text-xs">Apple Pay</span>
              </button>
              <button
                onClick={() => setPaymentMethod('venmo')}
                className={`p-3 rounded-lg border transition-all ${
                  paymentMethod === 'venmo' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
              >
                <Users size={20} className="mx-auto mb-1" />
                <span className="text-xs">Venmo</span>
              </button>
            </div>
          </div>

          <div>
            <Label>Split Method</Label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSplitType('equal')}
                className={`flex-1 p-2 rounded-lg border text-sm transition-all ${
                  splitType === 'equal'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
              >
                Equal Split
              </button>
              <button
                onClick={() => setSplitType('custom')}
                className={`flex-1 p-2 rounded-lg border text-sm transition-all ${
                  splitType === 'custom'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
              >
                Custom Amounts
              </button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Total: ${totalCost}</span>
                <Badge variant="outline">{totalAttendees} people</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>You (Organizer)</span>
                  {splitType === 'equal' ? (
                    <Badge variant="secondary">${equalSplit}</Badge>
                  ) : (
                    <Input
                      type="number"
                      value={customAmounts['organizer'] || ''}
                      onChange={(e) => handleCustomAmountChange('organizer', Number(e.target.value))}
                      className="w-20 h-8"
                      placeholder="$0"
                    />
                  )}
                </div>

                {attendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center justify-between text-sm">
                    <span>{attendee.name}</span>
                    {splitType === 'equal' ? (
                      <Badge variant="secondary">${equalSplit}</Badge>
                    ) : (
                      <Input
                        type="number"
                        value={customAmounts[attendee.id] || ''}
                        onChange={(e) => handleCustomAmountChange(attendee.id, Number(e.target.value))}
                        className="w-20 h-8"
                        placeholder="$0"
                      />
                    )}
                  </div>
                ))}

                {splitType === 'custom' && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Remaining:</span>
                      <span className={getTotalCustomAmounts() === totalCost ? 'text-green-600' : 'text-orange-600'}>
                        ${totalCost - getTotalCustomAmounts()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <div className="flex items-center mb-1">
              <Check size={14} className="text-green-600 mr-2" />
              <span className="font-medium">Secure Payment Processing</span>
            </div>
            <p className="text-muted-foreground">
              Payment links will be sent securely. No one pays until everyone confirms.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSetupPayment} 
            className="flex-1"
            disabled={splitType === 'custom' && getTotalCustomAmounts() !== totalCost}
          >
            <DollarSign size={16} className="mr-2" />
            Setup Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSplitModal;
