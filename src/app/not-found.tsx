import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F9F9F9] px-4 text-center">
      <div className="space-y-6">
        <h1 className="font-serif text-8xl font-light text-neutral-300 md:text-9xl">404</h1>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-medium text-black md:text-4xl">Page Not Found</h2>
          <p className="mx-auto max-w-md text-neutral-500">
            The page you are looking for has been moved, removed, or does not exist in our current
            registry.
          </p>
        </div>
        <div className="pt-6">
          <Link href="/">
            <Button className="h-12 rounded-md bg-black px-8 font-semibold text-white hover:bg-neutral-800">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>

      {/* Subtle branding element */}
      <div className="mt-20 flex items-center gap-2 opacity-20">
        <div className="h-px w-8 bg-black" />
        <span className="font-serif text-xs uppercase tracking-widest text-black">
          Gold Nexus LLC
        </span>
        <div className="h-px w-8 bg-black" />
      </div>
    </div>
  );
}
