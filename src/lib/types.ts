// lib/types.ts

import { Prisma } from '@/generated/prisma/client';

// 1. Define the shape of a single Order with its nested relations.
// This is the new, direct way to create types from includes.
export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true; // Include the full Product object in each OrderItem
      };
    };
  };
}>;

// 2. Define the complete UserProfile interface that your frontend page will use.
// It remains the same, but now it will use our new, strongly-typed Order type.
export interface UserProfile {
  fullName: string;
  email: string;
  country: string;
  phoneNumber: string;
  orders: OrderWithItems[]; // Use the new, correctly typed Order array
}
