import { TableSkeleton } from '@/components/admin/table-skeleton';

export default function ProductsLoading() {
  return <TableSkeleton columnCount={5} showImageColumn={true} />;
}
