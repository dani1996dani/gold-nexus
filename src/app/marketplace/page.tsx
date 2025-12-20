'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

export default function MarketplacePage() {
  // --- STATE MANAGEMENT ---
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempCategories, setTempCategories] = useState<ProductCategory[]>([]);

  const [query, setQuery] = useQueryStates({
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    sortBy: parseAsString.withDefault('price-asc'),
  });

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const data: Product[] = await res.json();
        setAllProducts(data);
      } catch (err: unknown) {
        // @ts-expect-error an error bro.
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync URL query state with temp state for the filter sidebar
  useEffect(() => {
    const validCategories = query.categories.filter((cat): cat is ProductCategory =>
      CATEGORIES.some((c) => c.value === cat)
    );
    setTempCategories(validCategories);
  }, [query.categories]);

  // --- FILTERING AND SORTING LOGIC ---
  const filteredProducts = useMemo(() => {
    let products: Product[] = [...allProducts];

    if (query.categories.length > 0) {
      products = products.filter((p) => query.categories.includes(p.category));
    }
    products.sort((a, b) => {
      const priceA = a.price as unknown as number;
      const priceB = b.price as unknown as number;
      if (query.sortBy === 'price-desc') return priceB - priceA;
      return priceA - priceB;
    });
    return products;
  }, [query.categories, query.sortBy, allProducts]);

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

  if (loading) {
    return <MarketplaceLoading />;
  }
  if (error) {
    return <div className="p-12 text-center text-red-500">Error: {error}</div>;
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
                  Showing {filteredProducts.length} assets
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))
              ) : (
                <NoResultsFound onClear={clearFilters} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const NoResultsFound = ({ onClear }: { onClear: () => void }) => (
  <div className="col-span-full mt-12 flex flex-col items-center justify-center text-center">
    <h2 className="font-serif text-2xl font-medium">No Assets Found</h2>
    <p className="mt-2 text-muted-foreground">Try adjusting your filters or view all products.</p>
    <Button onClick={onClear} className="mt-6">
      Clear Filters
    </Button>
  </div>
);
