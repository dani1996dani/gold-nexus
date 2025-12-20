import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showImageColumn?: boolean;
}

export function TableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showImageColumn = false,
}: TableSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {showImageColumn && (
                  <TableHead className="w-[80px]">
                    <Skeleton className="h-4 w-10" />
                  </TableHead>
                )}
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
                <TableHead className="w-[50px]">
                  <Skeleton className="h-4 w-8" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i}>
                  {showImageColumn && (
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </TableCell>
                  )}
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
