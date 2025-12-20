// lib/zod-schemas/shippingSchema.ts
import * as z from 'zod';
import { countrySchema } from './countrySchema';

export const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'A valid address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  country: z
    .union([countrySchema, z.null(), z.undefined()])
    .refine((c) => c && typeof c === 'object' && 'name' in c, {
      message: 'Please select a valid country',
    }),
  state: z.string().min(2, 'State / Province is required'),
  postalCode: z.string().min(4, 'A valid postal code is required'),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;
