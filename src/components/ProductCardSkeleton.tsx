import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-lg border-border/50 bg-card shadow-subtle">
      <Skeleton className="h-56 w-full" />
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="mb-4 h-6 w-3/4" />
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-1/5" />
            <Skeleton className="h-6 w-2/5" />
          </div>
          <Skeleton className="h-10 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
};
