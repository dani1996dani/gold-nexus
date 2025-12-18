'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

// This type should be defined based on what getOrderById returns
// to avoid importing server-only types
type OrderPayload = {
    id: string;
    displayId: number;
    status: string;
    totalAmount: string;
    currency: string;
    stripePaymentIntentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        fullName: string;
        email: string;
    };
    shippingAddressJson: any;
    items: {
        id: string;
        quantity: number;
        priceAtPurchase: string;
        product: {
            name: string;
            sku: string;
        };
    }[];
};

interface OrderDetailClientProps {
    order: OrderPayload;
    statuses: string[];
}

export function OrderDetailClient({ order, statuses }: OrderDetailClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [selectedNewStatus, setSelectedNewStatus] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const shippingAddress: Record<string, any> = order.shippingAddressJson
    ? (order.shippingAddressJson as Record<string, any>)
    : {};

  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== order.status) {
      setSelectedNewStatus(newStatus);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!selectedNewStatus) return;

    setIsUpdatingStatus(true);
    setError(null);
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
      
      console.log(`[ACTION] Order status changed to ${selectedNewStatus}. Triggering email to customer.`);
      
      // Refresh the entire page to get the latest data from the server
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUpdatingStatus(false);
      setIsConfirmModalOpen(false);
      setSelectedNewStatus(null);
    }
  };
  
    const handleCancelUpdate = () => {
        setIsConfirmModalOpen(false);
        setSelectedNewStatus(null);
    };

  return (
    <div className="space-y-6">
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

      <div>
        <Link href="/admin/orders">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Orders
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order #{order.displayId}</CardTitle>
              <CardDescription>Details for order placed by {order.user.fullName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 text-sm sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Select
                    onValueChange={handleStatusChange}
                    defaultValue={order.status}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue asChild>
                        <StatusBadge status={order.status} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
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
                  <p className="text-lg font-semibold">
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
        </div>

        <div className="space-y-6 lg:col-span-1">
             <Card>
                <CardHeader><CardTitle>Customer & Shipping</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Customer</p>
                        <p>{order.user.fullName}</p>
                        <p className="text-muted-foreground">{order.user.email}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Shipping Address</p>
                        <p>{shippingAddress.fullName}</p>
                        <p>{`${shippingAddress.address || ''}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}`}</p>
                        <p>{`${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}`}</p>
                        <p>{shippingAddress.country || ''}</p>
                    </div>
                </CardContent>
             </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {order.items.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.product.sku}</TableCell>
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
  );
}
