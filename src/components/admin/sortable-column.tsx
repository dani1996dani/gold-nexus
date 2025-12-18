'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableColumnProps {
  column: string;
  label: string;
  className?: string;
}

export function SortableColumn({ column, label, className }: SortableColumnProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sortBy');
  const currentSortOrder = searchParams.get('sortOrder');

  const isSorted = currentSortBy === column;
  const isAsc = isSorted && currentSortOrder === 'asc';

  const toggleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (isSorted) {
      // Toggle order
      params.set('sortOrder', isAsc ? 'desc' : 'asc');
    } else {
      // New sort column, default to asc
      params.set('sortBy', column);
      params.set('sortOrder', 'asc');
    }
    
    // Reset page to 1 when sorting changes
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleSort}
      className={cn("-ml-4 h-8 data-[state=open]:bg-accent", className)}
    >
      <span>{label}</span>
      {isSorted ? (
        isAsc ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
      )}
    </Button>
  );
}
