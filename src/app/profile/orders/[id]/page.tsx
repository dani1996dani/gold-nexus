'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { OrderStatus } from '@/generated/prisma/client';
import { OrderWithItems } from '@/lib/types';
import { authFetch } from '@/lib/auth-fetch';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

interface DetailedOrder extends Omit<OrderWithItems, 'shippingAddressJson'> {
  shippingAddressJson: ShippingAddress;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await authFetch(`/api/orders/${id}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error('Access denied');
          throw new Error('Failed to load order');
        }
        const data = await res.json();
        setOrder(data);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Could not load order details.');
        router.push('/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] px-4 py-12 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F9F9F9] px-4 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-neutral-300" />
        <h2 className="font-serif text-2xl font-medium text-black">Order Not Found</h2>
        <p className="mt-2 text-neutral-500">
          We couldn&#39;t locate the order you&#39;re looking for.
        </p>
        <Link href="/profile" className="mt-6">
          <Button variant="outline">Back to My Account</Button>
        </Link>
      </div>
    );
  }

  if (!order) return null; // Safety for TS despite logic above

  const shippingAddress = order.shippingAddressJson;

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-medium text-black">
                Order #{order.displayId}
              </h1>
              <p className="text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardContent className="pt-6">
            {order.status === 'FAILED' ? (
              <div className="flex items-center gap-3 rounded-md bg-red-50 p-4 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  There was an issue with this order. Please contact our support desk.
                </p>
              </div>
            ) : (
              <OrderStatusTracker status={order.status} />
            )}
          </CardContent>
        </Card>

        {/* Shipping Address - Full Width */}
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader className="border-b border-neutral-100" style={{ paddingBottom: '0.5em' }}>
            <CardTitle className="font-sans text-lg font-semibold">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm leading-relaxed text-neutral-600">
              <p className="font-semibold text-black">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p>{shippingAddress.address}</p>
              {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
              <p>
                {shippingAddress.city}
                {shippingAddress.state ? `, ${shippingAddress.state}` : ''}
                {` ${shippingAddress.postalCode}`}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Line Items - Full Width */}
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader className="border-b border-neutral-100" style={{ paddingBottom: '0.5em' }}>
            <CardTitle className="font-sans text-lg font-semibold">Line Items</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-neutral-100 p-0">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-100 bg-neutral-50">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-grow flex-col">
                  <h4 className="font-medium text-black">{item.product.name}</h4>
                  <p className="text-xs text-neutral-400">SKU: {item.product.sku}</p>
                  <p className="mt-1 text-sm text-neutral-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-black">
                    {formatCurrency(Number(item.priceAtPurchase) * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-neutral-400">
                      {formatCurrency(Number(item.priceAtPurchase))} each
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div className="flex items-center justify-between p-6">
              <span className="font-sans text-lg font-semibold text-neutral-500">Total Sum</span>
              <span className="font-sans text-lg font-bold text-black">
                {formatCurrency(Number(order.totalAmount))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const steps = [
    { id: 'PAID', label: 'Payment Received', icon: CreditCard },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
  ];

  const getStatusIndex = (s: string) => {
    if (s === 'UNPAID' || s === 'PAID') return 0;
    if (s === 'PROCESSING') return 1;
    if (s === 'SHIPPED' || s === 'COMPLETED') return 2;
    return -1;
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="relative flex w-full items-start justify-between">
      {/* Background Line */}
      <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-neutral-100" />

      {/* Progress Line */}
      <div
        className="absolute left-[10%] top-5 h-0.5 bg-black transition-all duration-500"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 80}%` }}
      />

      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="relative z-10 flex w-1/3 flex-col items-center">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500',
                isCompleted
                  ? 'border-black bg-black text-white'
                  : 'border-neutral-200 bg-white text-neutral-300',
                isCurrent && 'ring-4 ring-neutral-100'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p
              className={cn(
                'mt-3 text-xs font-semibold uppercase tracking-tight',
                isCompleted ? 'text-black' : 'text-neutral-400'
              )}
            >
              {step.label}
            </p>
            {isCurrent && (
              <p className="mt-0.5 animate-pulse font-sans text-[10px] text-neutral-400">
                Current Status
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
