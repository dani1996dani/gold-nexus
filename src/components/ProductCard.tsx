// components/ProductCard.tsx
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/generated/prisma/client';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useCartStore } from '@/lib/store/cart';
interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, weight, price, karat, imageUrl, sku } = product;
  const { addItem } = useCartStore();

  return (
    <div className="group overflow-hidden rounded-lg border border-border/50 bg-card shadow-subtle transition-all duration-300 hover:shadow-card">
      <Link href={`/product/${sku}`} passHref>
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-secondary/50 p-6">
          <Image
            src={imageUrl}
            width={200}
            height={200}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-3">
          <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
            {karat}
          </span>
          <span className="font-sans text-xs font-medium text-muted-foreground">
            Weight: <span className="font-semibold text-foreground">{weight}</span>
          </span>
        </div>
        <h3 className="mb-4 font-serif text-lg font-medium text-foreground">{name}</h3>
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase text-muted-foreground">
              Live Ask
            </span>
            <span className="font-sans text-xl font-bold text-foreground">
              {formatCurrency(Number(price))}
            </span>
          </div>
          <Button
            variant="dark"
            size="sm"
            className="shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => addItem(product)}
          >
            Add to Order
          </Button>
        </div>
      </div>
    </div>
  );
};
