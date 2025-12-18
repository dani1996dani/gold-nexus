// app/(auth)/login/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'; // 1. Import from React Hook Form
import { zodResolver } from '@hookform/resolvers/zod'; // 2. Import the Zod resolver
import * as z from 'zod'; // 3. Import Zod
import { useAuthStore } from '@/lib/store/auth';

// 4. Define the form schema and validation rules with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// 5. Infer the TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // 6. Set up the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 7. Create the submission handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json(); // Get response data here

      if (res.ok) {
        // Pass the user object to login
        login(responseData.user); 
        router.push('/profile');
      } else {
        setError('root', {
          type: 'manual',
          message: responseData.error || responseData.message || 'Failed to login',
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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F9] px-4 md:px-0">
      <Card className="w-full max-w-sm rounded-sm border-neutral-300 bg-white shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl font-medium tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="pt-2">
            Sign in to access your Gold Nexus account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 8. Connect handleSubmit to the form */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="rounded-md border-neutral-300"
                {...register('email')} // 9. Register the input
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-neutral-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-md border-neutral-300"
                {...register('password')} // 9. Register the input
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
            <Button
              type="submit"
              className="w-full rounded-md bg-black font-semibold text-white hover:bg-neutral-800"
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-neutral-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-black hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
