import { z } from 'zod';

export const countrySchema = z.object({
  alpha2: z.string(),
  alpha3: z.string(),
  countryCallingCodes: z.array(z.string()),
  currencies: z.array(z.string()),
  emoji: z.string().optional(),
  ioc: z.string(),
  languages: z.array(z.string()),
  name: z.string(),
  status: z.string(),
});

export type Country = z.infer<typeof countrySchema>;
