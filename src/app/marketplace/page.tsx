'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryStates, parseAsArrayOf, parseAsString } from 'nuqs';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/config/categories';
import { Product, ProductCategory } from '@/generated/prisma/client';
import MarketplaceLoading from '@/app/marketplace/loading';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { toast } from 'sonner';

export default function MarketplacePage() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Initial load
  const [loadingMore, setLoadingMore] = useState(false); // Pagination load
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempCategories, setTempCategories] = useState<ProductCategory[]>([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const [query, setQuery] = useQueryStates({
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    sortBy: parseAsString.withDefault('price-asc'),
  });

  // --- DATA FETCHING ---
  const fetchProducts = useCallback(
    async (pageNum: number, isReset: boolean) => {
      // Prevent duplicate requests
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setHasFetchError(false);

      try {
        if (isReset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams();
        params.set('page', pageNum.toString());
        params.set('limit', '50');
        params.set('sortBy', query.sortBy);
        if (query.categories.length > 0) {
          params.set('categories', query.categories.join(','));
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await res.json();

        if (isReset) {
          setProducts(data.products);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = data.products.filter((p: Product) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
        }

        setTotalCount(data.metadata.total);
        setHasMore(data.metadata.hasMore);
      } catch (err: any) {
        toast.error('Failed to fetch products');
        setHasFetchError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [query.categories, query.sortBy]
  );

  // Initial Fetch & Filter Changes (Reset)
  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Sync URL query state with temp state for the filter sidebar
  useEffect(() => {
    const validCategories = query.categories.filter((cat): cat is ProductCategory =>
      CATEGORIES.some((c) => c.value === cat)
    );
    setTempCategories(validCategories);
  }, [query.categories]);

  // --- INFINITE SCROLL OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && !hasFetchError) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchProducts(nextPage, false);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    const currentTarget = observerTarget.current;

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, fetchProducts]);

  const handleCategoryChange = (category: ProductCategory) => {
    setTempCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };
  const applyFilters = () => {
    setQuery({ categories: tempCategories });
    setIsSheetOpen(false);
  };
  const clearFilters = () => {
    setTempCategories([]);
    setQuery({ categories: [] });
    setIsSheetOpen(false);
  };

  if (loading && page === 1) {
    return <MarketplaceLoading />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-3/12 lg:block">
            <FilterSidebar
              categories={tempCategories}
              onCategoryChange={handleCategoryChange}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </aside>
          <section className="w-full lg:w-9/12">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="mb-2 font-serif text-4xl font-medium">Live Market</h1>
                <p className="text-sm text-muted-foreground">
                  {products.length > 0
                    ? `Showing ${products.length} of ${totalCount} assets`
                    : 'No assets found'}
                </p>
              </div>
              <div className="flex w-full items-center gap-4 md:w-auto">
                <div className="lg:hidden">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex w-[300px] flex-col">
                      <SheetHeader className="mb-4">
                        <SheetTitle className="font-serif text-2xl">Filter Products</SheetTitle>
                      </SheetHeader>
                      <FilterSidebar
                        categories={tempCategories}
                        onCategoryChange={handleCategoryChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select
                    value={query.sortBy}
                    onValueChange={(value) => setQuery({ sortBy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {products.length > 0
                ? products.map((product) => <ProductCard product={product} key={product.id} />)
                : !loading && <NoResultsFound onClear={clearFilters} />}
              {loadingMore && (
                <>
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </>
              )}
            </div>

            {/* Sentinel for Intersection Observer or Retry Button */}
            {!hasFetchError ? (
              <div ref={observerTarget} className="h-4 w-full" />
            ) : (
              <div className="flex justify-center py-4">
                <Button variant="outline" onClick={() => fetchProducts(page, false)}>
                  Retry Loading More
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

const NoResultsFound = ({ onClear }: { onClear: () => void }) => (
  <div className="col-span-full mt-12 flex flex-col items-center justify-center text-center">
    <h2 className="font-serif text-2xl font-medium">No Assets Found</h2>
    <p className="mt-2 text-muted-foreground">Try adjusting your filters.</p>
    <Button onClick={onClear} className="mt-6">
      Clear Filters
    </Button>
  </div>
);
