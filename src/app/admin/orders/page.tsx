import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOrders } from '@/lib/data/orders';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils';
import { SortableColumn } from '@/components/admin/sortable-column';

import { ClickableTableRow } from '@/components/admin/clickable-table-row';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '15', 10);
  const sortBy = resolvedParams.sortBy || 'createdAt';
  const sortOrder = resolvedParams.sortOrder || 'desc';

  const { data: orders, pagination } = await getOrders(page, limit, sortBy, sortOrder);
  const { total, totalPages } = pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">Review and manage all customer orders.</p>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  <SortableColumn column="displayId" label="Order ID" />
                </TableHead>
                <TableHead className="w-[300px]">
                  <SortableColumn column="customer" label="Customer" />
                </TableHead>
                <TableHead className="w-[150px]">
                  <SortableColumn column="totalAmount" label="Total" />
                </TableHead>
                <TableHead className="w-[180px]">
                  <SortableColumn column="status" label="Status" />
                </TableHead>
                <TableHead className="w-[180px]">
                  <SortableColumn column="createdAt" label="Date" />
                </TableHead>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <ClickableTableRow key={order.id} href={`/admin/orders/${order.id}`}>
                  <TableCell className="font-medium">#{order.displayId}</TableCell>
                  <TableCell>{order.user.fullName}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No orders found.</div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex flex-row items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link
              href={
                page > 1
                  ? `/admin/orders?page=${page - 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`
                  : '#'
              }
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link
              href={
                page < totalPages
                  ? `/admin/orders?page=${page + 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`
                  : '#'
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
