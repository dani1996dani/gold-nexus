import { OrderStatus } from '@/generated/prisma/client';

// Define a type for the possible Badge variants from your component
type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'processing'
  | 'shipped'
  | 'delivered';

export const getOrderStatusVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case 'PROCESSING':
      return 'processing';
    case 'SHIPPED':
      return 'shipped';
    case 'COMPLETED':
      return 'delivered'; // Map 'COMPLETED' data status to 'delivered' UI variant
    case 'FAILED':
      return 'destructive'; // Map 'FAILED' to 'destructive'
    case 'PENDING':
    default:
      return 'secondary'; // Use 'secondary' for PENDING and any other case
  }
};
