'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutPaymentFormProps {
  orderId: string;
}

export function CheckoutPaymentForm({ orderId }: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const baseUrl = window.location.origin;

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/order-confirmation/${orderId}`,
        },
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          toast.error(error.message || 'Payment failed');
        } else {
          toast.error('An unexpected error occurred during payment.');
        }
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      toast.error('Could not complete payment process.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-md bg-black py-6 text-lg font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
        disabled={isProcessing || !stripe || !elements}
      >
        <Lock className="mr-2 h-5 w-5" />
        {isProcessing ? 'Processing Payment...' : 'Confirm Order'}
      </Button>

      <p className="text-center text-xs text-neutral-500">
        You’ll receive an order confirmation immediately.
      </p>
    </form>
  );
}
