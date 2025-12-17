import { StatusBadge } from '@/components/admin/status-badge';
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
import { getLeads } from '@/lib/data/leads';
import { formatDate } from '@/lib/utils';

interface LeadsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const page = parseInt((await searchParams)?.page || '1', 10);
  const limit = parseInt((await searchParams)?.limit || '15', 10);

  const { data: leads, pagination } = await getLeads(page, limit);
  const { total, totalPages } = pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Second-Hand Gold Leads</CardTitle>
        <CardDescription>
          Review and manage all incoming inquiries from users wanting to sell their gold.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell className="font-medium">{lead.fullName}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell>
                  <Link href={`/admin/leads/${lead.id}`}>
                    <Button variant="outline" size="sm">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {leads.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No leads found.</div>
        )}

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of{' '}
            {total} leads.
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/leads?page=${Math.max(1, page - 1)}`}>
              <Button variant="outline" disabled={page <= 1}>
                Previous
              </Button>
            </Link>
            <Link href={`/admin/leads?page=${Math.min(totalPages, page + 1)}`}>
              <Button variant="outline" disabled={page >= totalPages}>
                Next
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
