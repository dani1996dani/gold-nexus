import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProfilePageLoading() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl animate-pulse">
        <Skeleton className="mb-8 h-10 w-1/3" />

        {/* Profile Details Skeleton */}
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader>
            <Skeleton className="h-7 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex w-full flex-row justify-end pt-2">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History Skeleton */}
        <div className="mt-10">
          <Card className="border-neutral-200 bg-white shadow-none">
            <CardHeader>
              <Skeleton className="h-7 w-1/4" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>
                      <Skeleton className="h-5 w-1/2" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-1/2" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-1/2" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-5 w-1/2" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-neutral-200">
                      <TableCell>
                        <Skeleton className="h-5 w-3/4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-3/4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-3/4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-3/4" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
