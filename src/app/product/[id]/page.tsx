'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import oneOz from '@/assets/mocks/1-oz.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data based on params.id
  const productData = {
    sku: 'GNB-PS-1OZ',
    name: '1 oz PAMP Suisse Gold Bar',
    description:
      'The PAMP Suisse 1 oz gold bar represents the pinnacle of Swiss craftsmanship. Each bar is individually assayed and comes sealed in its original CertiPAMP™ packaging, featuring the iconic Lady Fortuna design that has become synonymous with excellence in precious metals.',
    price: '$2,689.50',
    weight: '1 oz t (31.1g)',
    karat: '24k',
    category: 'Gold Bar',
    vendorName: 'PAMP Suisse',
    purity: '99.99%',
    dimensions: '41mm x 24mm x 2mm',
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT COLUMN: IMAGE */}
        <div className="flex items-start justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-border/50 bg-card p-4 shadow-subtle">
            <Image
              src={oneOz}
              alt={productData.name}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div>
          <h1 className="font-serif text-4xl font-medium text-foreground">{productData.name}</h1>
          <p className="mt-4 text-muted-foreground">{productData.description}</p>

          {/* SPECIFICATIONS BOX */}
          <div className="mt-8 rounded-lg bg-secondary/30 p-6">
            <h3 className="font-serif text-lg font-medium">Specifications</h3>
            <dl className="mt-4 text-sm">
              <div className="flex justify-between border-b border-border/30 py-3">
                <dt className="text-muted-foreground">Purity</dt>
                <dd className="font-semibold text-foreground">
                  {productData.purity} ({productData.karat})
                </dd>
              </div>
              <div className="flex justify-between border-b border-border/30 py-3">
                <dt className="text-muted-foreground">Weight</dt>
                <dd className="font-semibold text-foreground">{productData.weight}</dd>
              </div>
              <div className="flex justify-between border-b border-border/30 py-3">
                <dt className="text-muted-foreground">Mint / Vendor</dt>
                <dd className="font-semibold text-foreground">{productData.vendorName}</dd>
              </div>
              <div className="flex justify-between pt-3">
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-semibold text-foreground">{productData.sku}</dd>
              </div>
            </dl>
          </div>

          {/* PRICE & CTA */}
          <div className="mt-8">
            <p className="text-xs uppercase text-muted-foreground">Live Ask Price</p>
            <p className="font-sans text-5xl font-bold text-foreground">{productData.price}</p>
            <Button size="lg" className="mt-6 w-full font-bold">
              Add to Order
            </Button>
          </div>
        </div>
      </div>

      {/* ACCORDION SECTION (Replaces Tabs) */}
      <div className="mt-16 border-t border-border/50 pt-12">
        <Accordion type="single" collapsible defaultValue="description" className="w-full max-w-2xl">

          <AccordionItem value="description">
            <AccordionTrigger className="font-serif text-lg">Full Product Description</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              <p>{productData.description}</p>
              <p className="mt-4">This investment-grade gold bar is manufactured to the highest standards of the London Bullion Market Association (LBMA). Each bar undergoes rigorous quality control to ensure it meets the exacting specifications required for international trade and investment portfolios.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="specs">
            <AccordionTrigger className="font-serif text-lg">Technical Specifications</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-4">
              <div className="rounded-lg border border-border/30 p-6 bg-secondary/50">
                <h4 className="font-serif font-medium">Physical Properties</h4>
                <dl className="mt-4 text-sm">
                  <div className="flex justify-between py-2"><dt>Gross Weight</dt><dd>{productData.weight}</dd></div>
                  <div className="flex justify-between py-2"><dt>Fineness</dt><dd>{productData.purity}</dd></div>
                  <div className="flex justify-between py-2"><dt>Dimensions</dt><dd>{productData.dimensions}</dd></div>
                </dl>
              </div>
              <div className="rounded-lg border border-border/50 p-6 bg-secondary/50">
                <h4 className="font-serif font-medium">Certification</h4>
                <dl className="mt-4 text-sm">
                  <div className="flex justify-between py-2"><dt>Manufacturer</dt><dd>{productData.vendorName}</dd></div>
                  <div className="flex justify-between py-2"><dt>LBMA Approved</dt><dd>Yes</dd></div>
                  <div className="flex justify-between py-2"><dt>Serial Number</dt><dd>Included</dd></div>
                </dl>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </main>
  );
}
