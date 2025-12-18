'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package2, Users, ShoppingCart, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin/leads',
      icon: Gem,
      label: 'Leads',
    },
    {
      href: '/admin/orders',
      icon: ShoppingCart,
      label: 'Orders',
    },
    {
      href: '/admin/products',
      icon: Package2,
      label: 'Products',
    },
  ];

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
              isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
