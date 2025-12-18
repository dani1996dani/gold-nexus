'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CountryDropdown, Country } from '@/components/ui/country-dropdown';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form'; // Import Controller for custom components
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { countries } from 'country-data-list';
import { countrySchema } from '@/lib/zod-schemas/countrySchema';

// Define the form validation schema using Zod
const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  country: countrySchema,
  phoneNumber: z.string().min(5, { message: 'Please enter a valid phone number' }),
});

// Infer the TypeScript type from the Zod schema
type RegisterFormValues = z.infer<typeof registerSchema>;

import { useAuthStore } from '@/lib/store/auth';

// ... (other imports)

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // Set up the useForm hook with the Zod resolver
  const {
    register,
    getValues,
    handleSubmit,
    control, // 'control' is necessary for the Controller component
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // Set default empty values
      fullName: '',
      email: '',
      password: '',
      country: countries.all.find((x) => x.alpha3 === 'USA') || countries.all[0],
      phoneNumber: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, country: data.country.name }),
      });

      if (res.status === 201) {
        const responseData = await res.json();
        login(responseData.user); // Pass the user object to login
        router.push('/profile');
      } else {
        const responseData = await res.json();
        setError('root', {
          type: 'manual',
          message: responseData.error || responseData.message || 'Failed to create account',
        });
      }
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F9] px-4 py-12 md:px-0">
      <Card className="w-full max-w-sm rounded-sm border-neutral-300 bg-white shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl font-medium tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="pt-2">
            Join Gold Nexus to buy and sell gold assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="John Smith"
                {...register('fullName')}
                className="rounded-md border-neutral-300"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className="rounded-md border-neutral-300"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="rounded-md border-neutral-300"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CountryDropdown
                    // The component's onChange gives us the full Country object.
                    onChange={(country: Country) => field.onChange(country)}
                    value={getValues('country')}
                  />
                )}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                placeholder="(555) 000-0000"
                {...register('phoneNumber')}
                className="rounded-md border-neutral-300"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
            {errors.root && (
              <p className="text-center text-sm text-red-500">{errors.root.message}</p>
            )}
            <Button
              type="submit"
              className="w-full rounded-md bg-black font-semibold text-white hover:bg-neutral-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-black hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
