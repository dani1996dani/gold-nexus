'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Lock, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { CountryDropdown, Country } from '@/components/ui/country-dropdown';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skeleton } from '@/components/ui/skeleton';
import { shippingSchema, ShippingFormValues } from '@/lib/zod-schemas/shippingSchema';
import { toast } from 'sonner';

import { useAuthStore } from '@/lib/store/auth';
import { authFetch } from '@/lib/auth-fetch';

import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/utils/stripe-client';
import { CheckoutPaymentForm } from '@/components/cart/CheckoutPaymentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function CheckoutPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<{ orderId: string; clientSecret: string } | null>(
    null
  );
  const { items } = useCartStore();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (isAuthLoading || !isHydrated || orderPlaced) {
    return <CheckoutSkeleton />;
  }

  // Only show EmptyCart if no items AND we aren't currently in the payment step
  if (isHydrated && items.length === 0 && !orderData) {
    return <EmptyCart />;
  }

  if (!isLoggedIn) {
    return <PleaseLogin />;
  }

  return (
    <CheckoutForm
      orderData={orderData}
      setOrderData={setOrderData}
      onOrderPlaced={() => setOrderPlaced(true)}
    />
  );
}

// --- SUB-COMPONENTS ---

const CheckoutForm = ({
  onOrderPlaced,
  orderData,
  setOrderData,
}: {
  onOrderPlaced: () => void;
  orderData: { orderId: string; clientSecret: string } | null;
  setOrderData: (data: { orderId: string; clientSecret: string } | null) => void;
}) => {
  const { items } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
  });

  const subtotal = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const total = subtotal;

  const onCreateOrder = async (data: ShippingFormValues) => {
    setIsProcessing(true);
    try {
      const payload = {
        shippingAddress: {
          ...data,
        },
        cartItems: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      };

      const res = await authFetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to initialize order');
      }

      const { orderId, clientSecret } = await res.json();
      setOrderData({ orderId, clientSecret });
    } catch (error: any) {
      toast.error(error.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-6xl">
        <h1 className="mb-8 font-serif text-4xl font-medium text-black sm:text-5xl">Checkout</h1>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* 1. SHIPPING INFO (Order 2 on mobile, Order 1 on desktop) */}
          <div className="order-2 space-y-8 lg:order-1">
            <Card className="border-neutral-200 bg-white shadow-none">
              <CardHeader>
                <CardTitle className="font-sans text-xl font-semibold">
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  id="shipping-form"
                  onSubmit={handleSubmit(onCreateOrder)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      placeholder="John Smith"
                      {...register('fullName')}
                      className="rounded-md border-neutral-300"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      {...register('address')}
                      className="rounded-md border-neutral-300"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment / Suite (optional)</Label>
                    <Input
                      id="apartment"
                      placeholder="Apt 4B"
                      {...register('apartment')}
                      className="rounded-md border-neutral-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        {...register('city')}
                        className="rounded-md border-neutral-300"
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <CountryDropdown
                            onChange={(country: Country) => field.onChange(country)}
                            value={field.value || undefined}
                          />
                        )}
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500">
                          {typeof errors.country.message === 'string'
                            ? errors.country.message
                            : 'Please select a country'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        {...register('state')}
                        className="rounded-md border-neutral-300"
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500">{errors.state.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input
                        id="postal-code"
                        placeholder="10001"
                        {...register('postalCode')}
                        className="rounded-md border-neutral-300"
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black py-6 text-lg font-semibold text-white hover:bg-neutral-800"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 2. ORDER SUMMARY (Order 1 on mobile, Order 2 on desktop) */}
          <div className="order-1 lg:order-2">
            <Card className="border-neutral-200 bg-white shadow-none">
              <CardHeader>
                <CardTitle className="font-sans text-xl font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-start justify-between gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold sm:text-right">
                          {formatCurrency(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-neutral-500">
                      Items ready for secure checkout.
                    </p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 3. PAYMENT DIALOG (POPUP) */}
      <Dialog open={!!orderData} onOpenChange={(open) => !open && setOrderData(null)}>
        <DialogContent className="max-w-md overflow-hidden border-none bg-white p-0 shadow-2xl outline-none sm:rounded-lg">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-serif text-2xl">Complete Your Order</DialogTitle>
            <DialogDescription>
              Complete your order for{' '}
              <span className="font-semibold text-black">{formatCurrency(total)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            {orderData && (
              <Elements
                stripe={getStripe()}
                options={{
                  clientSecret: orderData.clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#000000',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutPaymentForm orderId={orderData.orderId} />
              </Elements>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PleaseLogin = () => {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/checkout';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <Lock className="h-20 w-20 text-gray-300" />
      <div>
        <h2 className="font-serif text-3xl font-medium">Please Log In to Continue</h2>
        <p className="mt-2 text-muted-foreground">You need an account to complete your purchase.</p>
      </div>
      <div className="flex gap-4">
        <Link href={`/login?redirect=${returnUrl}`}>
          <Button className="rounded-md bg-black font-semibold text-white hover:bg-neutral-800">
            Login
          </Button>
        </Link>
        <Link href={`/register?redirect=${returnUrl}`}>
          <Button variant="outline" className="rounded-md">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

const EmptyCart = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
    <ShoppingCart className="h-20 w-20 text-gray-300" />
    <div>
      <h2 className="font-serif text-3xl font-medium">Your Cart is Empty</h2>
      <p className="mt-2 text-muted-foreground">
        You can&#39;t proceed to checkout without any items.
      </p>
    </div>
    <Link href="/marketplace">
      <Button className="rounded-md bg-black font-semibold text-white hover:bg-neutral-800">
        Return to Marketplace
      </Button>
    </Link>
  </div>
);

const CheckoutSkeleton = () => (
  <div className="min-h-screen w-full animate-pulse bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
    <main className="mx-auto max-w-6xl">
      <Skeleton className="mb-8 h-12 w-1/3" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Separator />
            <Skeleton className="h-10 w-full" />
            <Separator />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
);
