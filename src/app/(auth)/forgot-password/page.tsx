'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Reset link sent if account exists.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-neutral-200 bg-white shadow-sm">
          <CardContent className="pt-10 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="mt-4 font-serif text-2xl">Check your email</CardTitle>
            <CardDescription className="mt-2 text-neutral-600">
              We have sent a password recovery link to your email address if an account exists.
            </CardDescription>
            <Link href="/login">
              <Button className="mt-8 w-full bg-black text-white hover:bg-neutral-800">
                Return to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
          <h2 className="mt-6 font-serif text-3xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No problem. Enter your email and we&#39;ll send you a secure link to reset it.
          </p>
        </div>

        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register('email')}
                  className="rounded-md border-neutral-300 focus:border-black focus:ring-black"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-black py-6 text-base font-semibold text-white hover:bg-neutral-800"
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
