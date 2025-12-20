import * as z from 'zod';

export const leadSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z.string().min(5, { message: 'Please enter a valid phone number.' }),
  country: z.string().min(2, { message: 'Please select a country.' }),
  city: z.string().min(2, { message: 'Please enter a city.' }),
  itemType: z
    .string()
    .min(2, { message: 'Please describe the item type (e.g., "Gold Bar", "Necklace").' }),
  estimatedWeight: z.string().min(1, { message: 'Please provide an estimated weight.' }),
  estimatedKarat: z.string().min(1, { message: 'Please provide an estimated karat.' }),
  photoUrls: z.array(z.string()).min(1, { message: 'At least one photo is required.' }),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
