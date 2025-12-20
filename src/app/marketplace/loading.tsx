import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';

export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto animate-pulse px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar Skeleton */}
          <aside className="hidden w-3/12 lg:block">
            <div className="space-y-8">
              <Skeleton className="h-8 w-1/2" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <section className="w-full lg:w-9/12">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="w-full">
                <Skeleton className="mb-2 h-10 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex w-full items-center gap-4 md:w-auto">
                <Skeleton className="h-10 w-10 lg:hidden" />
                <Skeleton className="h-10 w-full md:w-[200px]" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
