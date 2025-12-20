'use client';

import { useRouter } from 'next/navigation';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ClickableTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ClickableTableRow({ href, children, className, ...props }: ClickableTableRowProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // If the click target is a button or a link (or inside one), don't navigate via row click
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="menuitem"]') ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
      router.push(href);
    }
  };

  return (
    <TableRow
      onClick={handleClick}
      className={cn('cursor-pointer hover:bg-muted/50', className)}
      {...props}
    >
      {children}
    </TableRow>
  );
}
