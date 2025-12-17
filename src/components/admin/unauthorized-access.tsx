import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function UnauthorizedAccess() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Access Denied</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            You do not have the necessary permissions to view this page. This area is restricted to
            administrators.
          </p>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full">Return to Homepage</Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Login as Different User
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
