// app/(auth)/login/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F9] px-4 md:px-0">
      <Card className="w-full max-w-sm rounded-sm border-neutral-300 bg-white shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl tracking-tight font-medium">Welcome Back</CardTitle>
          <CardDescription className="pt-2">
            Sign in to access your Gold Nexus account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              className="rounded-md border-neutral-300"
            />
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
              required
              placeholder="••••••••"
              className="rounded-md border-neutral-300"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-md bg-black font-semibold text-white hover:bg-neutral-800"
          >
            Sign In
          </Button>
          <div className="text-center text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-black hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
