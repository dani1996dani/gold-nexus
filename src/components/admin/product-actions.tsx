'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmActionModal } from '@/components/admin/confirm-action-modal';

import { toast } from 'sonner';

interface ProductActionsProps {
  productId: string;
  productName: string;
}

export function ProductActions({ productId, productName }: ProductActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      router.refresh(); // Refresh the server component to update the list
      setShowDeleteModal(false);
      // inside handleDelete
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmActionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete the product "${productName}"? This action cannot be undone.`}
        confirmText="Delete"
        isConfirming={isDeleting}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${productId}/edit`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
