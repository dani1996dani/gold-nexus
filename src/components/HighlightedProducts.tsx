// components/HighlightedProducts.tsx

import { ProductCard } from './ProductCard';
import { Product } from '@/generated/prisma/client';

// This is our server-side data fetching function
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // We must use an absolute URL for fetches within Server Components
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/products?limit=4&featured=true`, {
      cache: 'no-store', // Ensures we get fresh data on every request
    });

    if (!res.ok) {
      console.error('Failed to fetch featured products');
      return []; // Return an empty array on error to prevent the page from crashing
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

// 1. Make the component an 'async' function
export const HighlightedProducts = async () => {
  // 2. Await the data directly inside the component
  const products = await getFeaturedProducts();

  // If there are no products, we can choose to render nothing for this section
  if (products.length === 0) {
    return null;
  }

  return (
    <section id="marketplace" className="bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-4 font-serif text-3xl font-medium text-foreground sm:text-4xl md:text-5xl">
            Featured Gold&nbsp;Products
          </h2>
          <p className="mx-auto max-w-xl font-sans text-muted-foreground">
            Investment-grade gold available for instant purchase.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* 3. Map over the real, fetched products */}
          {products.map((product) => (
            // Use the unique product.id for the key, which is more reliable than the name
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
