import { TableSkeleton } from '@/components/admin/table-skeleton';

export default function LeadsLoading() {
  return <TableSkeleton columnCount={5} showImageColumn={false} />;
}
