import { TableSkeleton } from '@/components/admin/table-skeleton';

export default function OrdersLoading() {
  return <TableSkeleton columnCount={6} showImageColumn={false} />;
}
