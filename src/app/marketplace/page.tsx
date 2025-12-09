'use client';

import React, { useState, useMemo } from 'react';
import { useQueryStates, parseAsArrayOf, parseAsString } from 'nuqs';
import { Footer } from '@/components/Footer';
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
import { mockProducts, Product } from '@/data/mockProducts';

export default function MarketplacePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempCategories, setTempCategories] = useState<string[]>([]);

  const [query, setQuery] = useQueryStates({
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    sortBy: parseAsString.withDefault('price-asc'),
  });

  const filteredProducts = useMemo(() => {
    let products: Product[] = [...mockProducts];
    if (query.categories.length > 0) {
      products = products.filter((p) => query.categories.includes(p.category));
    }
    products.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
      if (query.sortBy === 'price-desc') return priceB - priceA;
      return priceA - priceB;
    });
    return products;
  }, [query.categories, query.sortBy]);

  const handleCategoryChange = (category: string) => {
    setTempCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyFilters = () => {
    setQuery({ categories: tempCategories });
    setIsSheetOpen(false); // Close sheet on apply
  };

  const clearFilters = () => {
    setTempCategories([]);
    setQuery({ categories: [] });
    setIsSheetOpen(false); // Close sheet on clear
  };

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
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  weight={product.weight}
                  purity={product.purity}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
