import { StatusBadge } from '@/components/admin/status-badge';
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
import { getLeads } from '@/lib/data/leads';
import { formatDate } from '@/lib/utils';
import { SortableColumn } from '@/components/admin/sortable-column';

import { ClickableTableRow } from '@/components/admin/clickable-table-row';

interface LeadsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '15', 10);
  const sortBy = resolvedParams.sortBy || 'createdAt';
  const sortOrder = resolvedParams.sortOrder || 'desc';

  const { data: leads, pagination } = await getLeads(page, limit, sortBy, sortOrder);
  const { total, totalPages } = pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage all incoming inquiries from users wanting to sell their gold.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <SortableColumn column="createdAt" label="Date" />
                </TableHead>
                <TableHead className="w-[200px]">
                  <SortableColumn column="fullName" label="Name" />
                </TableHead>
                <TableHead className="w-[400px]">
                  <SortableColumn column="email" label="Email" />
                </TableHead>
                <TableHead className="w-[180px]">
                  <SortableColumn column="status" label="Status" />
                </TableHead>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <ClickableTableRow key={lead.id} href={`/admin/leads/${lead.id}`}>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  <TableCell className="font-medium">{lead.fullName}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </ClickableTableRow>
              ))}
            </TableBody>
          </Table>

          {leads.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No leads found.</div>
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
                  ? `/admin/leads?page=${page - 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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
                  ? `/admin/leads?page=${page + 1}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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
