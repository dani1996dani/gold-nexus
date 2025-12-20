import { notFound } from 'next/navigation';
import { Product } from '@/generated/prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ProductPageActions } from '@/components/ProductPageActions';

async function getProduct(sku: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/products/${sku}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

interface ProductDetailPageProps {
  params: Promise<{ sku: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { sku } = await params;
  const product = await getProduct(sku);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT COLUMN: IMAGE */}
        <div className="flex items-start justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-border/50 bg-card p-4 shadow-subtle">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground">{product.name}</h1>
          {/* Use the description from the database */}
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {/* SPECIFICATIONS BOX */}
          <div className="mt-8 rounded-lg bg-secondary/30 p-6">
            <h3 className="font-serif text-lg font-medium">Specifications</h3>
            <dl className="mt-4 text-sm">
              <div className="flex justify-between border-b border-border/30 py-3">
                <dt className="text-muted-foreground">Purity</dt>
                <dd className="font-semibold text-foreground">{product.karat}</dd>
              </div>
              <div className="flex justify-between border-b border-border/30 py-3">
                <dt className="text-muted-foreground">Weight</dt>
                <dd className="font-semibold text-foreground">{product.weight}</dd>
              </div>
              <div className="flex justify-between border-b border-border/30 py-3">
                <dt className="text-muted-foreground">Mint / Vendor</dt>
                <dd className="font-semibold text-foreground">{product.vendorName}</dd>
              </div>
              <div className="flex justify-between pt-3">
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-semibold text-foreground">{product.sku}</dd>
              </div>
            </dl>
          </div>

          {/* PRICE & CTA */}
          <ProductPageActions product={product} />
        </div>
      </div>

      {/* ACCORDION SECTION */}
      <div className="mt-16 border-t border-border/50 pt-12">
        <Accordion
          type="single"
          collapsible
          defaultValue="description"
          className="w-full max-w-2xl"
        >
          <AccordionItem value="description">
            <AccordionTrigger className="font-serif text-lg">
              Full Product Description
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {/* Use the database description here as well */}
              <p>{product.description}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="specs">
            <AccordionTrigger className="font-serif text-lg">
              Technical Specifications
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
              <div className="rounded-lg border border-border/30 bg-secondary/50 p-6">
                <h4 className="font-serif font-medium">Physical Properties</h4>
                <dl className="mt-4 text-sm">
                  <div className="flex justify-between py-2">
                    <dt>Gross Weight</dt>
                    <dd>{product.weight || '-'}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt>Fineness</dt>
                    <dd>{product.karat || '-'}</dd>
                  </div>
                  {/* Removed the 'Dimensions' row */}
                </dl>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/50 p-6">
                <h4 className="font-serif font-medium">Certification</h4>
                <dl className="mt-4 text-sm">
                  <div className="flex justify-between py-2">
                    <dt>Manufacturer</dt>
                    <dd>{product.vendorName || '-'}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt>Serial Number</dt>
                    <dd>Included</dd>
                  </div>
                </dl>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
