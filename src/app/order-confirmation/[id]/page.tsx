'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error('Failed to load order');
        }
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not load order details.');
        router.push('/'); // Redirect to home on failure
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] px-4 py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="mx-auto h-12 w-1/2" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-4 py-20">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h1 className="font-serif text-4xl font-medium text-gray-900">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order{' '}
            <span className="font-semibold text-black">#{order.displayId}</span> has been received.
          </p>
        </div>

        <Card className="border-gray-200 bg-white text-left shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-sans text-lg">Order Details</CardTitle>
              <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(Number(item.priceAtPurchase) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/marketplace">
            <Button variant="outline" className="h-12 px-8">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="h-12 bg-black px-8 text-white hover:bg-gray-800">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
