import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getOrderById } from '@/lib/data/orders';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatCurrency'; // Import formatCurrency
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Safely parse shipping address JSON
  const shippingAddress: Record<string, any> = order.shippingAddressJson
    ? (order.shippingAddressJson as Record<string, any>)
    : {};

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Orders
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order #{order.displayId}</CardTitle>
          <CardDescription>Details for order placed by {order.user.fullName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Information</h3>
              <div className="grid gap-2 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Payment ID</p>
                  <p>{order.stripePaymentIntentId || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Ordered At</p>
                  <p>{formatDate(order.createdAt, { showTime: true })}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Last Updated</p>
                  <p>{formatDate(order.updatedAt, { showTime: true })}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid gap-2 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Name</p>
                  <p>{order.user.fullName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email</p>
                  <p>{order.user.email}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              <div className="grid gap-2 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Full Name</p>
                  <p>{shippingAddress.fullName || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Address</p>
                  <p>
                    {shippingAddress.address || '-'}
                    {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">City, State, Postal</p>
                  <p>
                    {shippingAddress.city || '-'},
                    {shippingAddress.state || '-'}{' '}
                    {shippingAddress.postalCode || '-'}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Country</p>
                  <p>{shippingAddress.country || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Items</h3>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

