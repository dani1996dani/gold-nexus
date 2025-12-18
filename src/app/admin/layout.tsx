import Link from 'next/link';
import { Package2 } from 'lucide-react';
import { UnauthorizedAccess } from '@/components/admin/unauthorized-access';
import { getAuthenticatedAdmin } from '@/lib/data/auth';
import { AdminSidebarNav } from '@/components/admin/admin-sidebar-nav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <AdminSidebarNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* We can add a mobile nav toggle and user dropdown here later */}
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
