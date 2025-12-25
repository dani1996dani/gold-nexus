'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <Card className="w-full max-w-md border-red-100 bg-red-50 shadow-none">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="mt-4 text-red-900">Invalid Link</CardTitle>
          <p className="mt-2 text-red-700">This password reset link is invalid or has expired.</p>
          <Button
            onClick={() => router.push('/forgot-password')}
            className="mt-6 bg-red-600 hover:bg-red-700"
          >
            Request New Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Password updated successfully.');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md border-neutral-200 bg-white shadow-sm">
        <CardContent className="pt-10 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="mt-4 font-serif text-2xl">Password Reset</CardTitle>
          <CardDescription className="mt-2 text-neutral-600">
            Your password has been successfully updated. You can now log in with your new
            credentials.
          </CardDescription>
          <Button
            onClick={() => router.push('/login')}
            className="mt-8 w-full bg-black text-white hover:bg-neutral-800"
          >
            Log In Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
          Create New Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">Please enter your new secure password below.</p>
      </div>

      <Card className="border-neutral-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="rounded-md border-neutral-300 pr-10 focus:border-black focus:ring-black"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="rounded-md border-neutral-300 pr-10 focus:border-black focus:ring-black"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400" />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-black py-6 text-base font-semibold text-white hover:bg-neutral-800"
            >
              {isLoading ? 'Updating Password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
