// src/config/categories.ts

// This file is the single source of truth for product categories on the FRONTEND.
// It is completely decoupled from Prisma.
// NOTE: This must be manually kept in sync with the `ProductCategory` enum in `prisma/schema.prisma`.
export const CATEGORIES = [
  {
    label: 'Gold Bars',
    value: 'BAR',
  },
  {
    label: 'Gold Coins',
    value: 'COIN',
  },
  {
    label: 'Jewelry',
    value: 'JEWELRY',
  },
] as const;

// Create a TypeScript type from the values of our frontend constant.
// e.g., 'BAR' | 'COIN' | 'JEWELRY'
export type ProductCategory = (typeof CATEGORIES)[number]['value'];
