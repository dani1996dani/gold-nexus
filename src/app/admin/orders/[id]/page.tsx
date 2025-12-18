'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatDate, formatStatus } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmActionModal } from '@/components/admin/confirm-action-modal';

const ORDER_STATUSES = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'FAILED',
] as const;

type OrderDetail = {
  id: string;
  displayId: number;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddressJson: any;
  stripePaymentIntentId: string | null;
  user: {
    fullName: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: string;
    product: {
      name: string;
      sku: string;
      imageUrl: string;
    };
  }[];
};


interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedNewStatus, setSelectedNewStatus] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const [selectValue, setSelectValue] = useState<string | undefined>();

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = await params;
        const res = await fetch(`/api/admin/orders/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          } else {
            throw new Error('Failed to load order details');
          }
          return;
        }

        const fetchedOrder = await res.json();
        setOrder(fetchedOrder);
      } catch (err) {
        setError('Failed to load order details.');
        console.error('Error fetching order details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params]);
  
  useEffect(() => {
    setSelectValue(order?.status);
  }, [order]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!order) {
    // Already handled by notFound() in useEffect, but good practice for clarity
    return null;
  }

  const shippingAddress: Record<string, any> = order.shippingAddressJson
    ? (order.shippingAddressJson as Record<string, any>)
    : {};

  const handleStatusChange = (newStatus: string) => {
    setSelectValue(newStatus);
    if (newStatus !== order.status) {
      setSelectedNewStatus(newStatus);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!selectedNewStatus) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedNewStatus }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to update status');
      }
      
      const updatedOrder = await res.json();
      setOrder(updatedOrder);

      console.log(`[STUB] Order status changed to ${selectedNewStatus}. Triggering email to customer.`);
      
      setIsConfirmModalOpen(false);
      setSelectedNewStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsConfirmModalOpen(false);
    setSelectedNewStatus(null);
    setSelectValue(order?.status);
  };


  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Orders
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order #{order.displayId}</CardTitle>
              <CardDescription>Details for order placed by {order.user.fullName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Select
                    value={selectValue}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue asChild>
                        {selectValue ? <StatusBadge status={selectValue} /> : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          <StatusBadge status={s} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-base font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Payment ID</p>
                  <p>{order.stripePaymentIntentId || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Ordered At</p>
                  <p>{formatDate(order.createdAt, { showTime: true })}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Last Updated</p>
                  <p>{formatDate(order.updatedAt, { showTime: true })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Customer & Shipping</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
                    <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">Name</p>
                        <p>{order.user.fullName}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">Email</p>
                        <p>{order.user.email}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">Shipping Name</p>
                        <p>{shippingAddress.fullName || '-'}</p>
                    </div>
                     <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">Shipping Address</p>
                        <p>{`${shippingAddress.address || ''}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}`}</p>
                        <p>{`${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}`}</p>
                        <p>{shippingAddress.country || ''}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="rounded-md"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-muted-foreground">{item.product.sku}</div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.priceAtPurchase)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
        title="Confirm Status Change"
        message={
          <>
            Are you sure you want to change the order status to{' '}
            <span className="font-bold">{selectedNewStatus ? formatStatus(selectedNewStatus) : 'N/A'}</span>?
            <br />
            This action will trigger an email notification to the customer.
          </>
        }
        confirmText={isUpdatingStatus ? 'Updating...' : 'Confirm'}
        isConfirming={isUpdatingStatus}
      />
    </div>
  );
}


