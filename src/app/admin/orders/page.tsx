import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getOrders } from '@/lib/data/orders';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const page = parseInt((await searchParams)?.page || '1', 10);
  const limit = parseInt((await searchParams)?.limit || '15', 10);

  const { data: orders, pagination } = await getOrders(page, limit);
  const { total, totalPages } = pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Review and manage all customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.displayId}</TableCell>
                <TableCell>{order.user.fullName}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {orders.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No orders found.
            </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of{' '}
            {total} orders.
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/orders?page=${Math.max(1, page - 1)}`}>
              <Button variant="outline" disabled={page <= 1}>Previous</Button>
            </Link>
            <Link href={`/admin/orders?page=${Math.min(totalPages, page + 1)}`}>
              <Button variant="outline" disabled={page >= totalPages}>Next</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
