'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ConfirmActionModal } from '@/components/admin/confirm-action-modal';
import { cn } from '@/lib/utils';

type ProductForTable = {
  id: string;
  sku: string;
  name: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  isActive: boolean;
  price: string;
  imageUrl: string;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} | null;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductForTable[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductForTable | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const { data, pagination: pag } = await res.json();
      setProducts(data);
      setPagination(pag);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
        const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error('Failed to delete product');
        }
        // Refresh the list
        fetchProducts();
        setProductToDelete(null);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsDeleting(false);
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortButton = ({ column, label }: { column: string, label: string }) => {
      const isSorted = sortBy === column;
      const isAsc = isSorted && sortOrder === 'asc';
      return (
        <Button
            variant="ghost"
            onClick={() => handleSort(column)}
            className={cn("-ml-4 h-8 data-[state=open]:bg-accent")}
        >
            <span>{label}</span>
            {isSorted ? (
                isAsc ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
            )}
        </Button>
      )
  }

  return (
    <div className="space-y-6">
       <ConfirmActionModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete the product "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isConfirming={isDeleting}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h1 className="text-2xl font-semibold">Products</h1>
           <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
            <Link href="/admin/products/import">
                <Button variant="outline">Import Products</Button>
            </Link>
            <Link href="/admin/products/new">
                <Button>Add Product</Button>
            </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>
                    <SortButton column="sku" label="SKU" />
                </TableHead>
                <TableHead>
                    <SortButton column="name" label="Name" />
                </TableHead>
                <TableHead>
                    <SortButton column="stockStatus" label="Stock Status" />
                </TableHead>
                <TableHead>
                    <SortButton column="isActive" label="Active" />
                </TableHead>
                <TableHead className="text-right">
                    <SortButton column="price" label="Price" />
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                  </TableRow>
              ) : error ? (
                   <TableRow>
                      <TableCell colSpan={7} className="text-center text-red-500 py-10">{error}</TableCell>
                  </TableRow>
              ) : products.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">No products found.</TableCell>
                  </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={product.name}>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.stockStatus === 'IN_STOCK' ? 'default' : 'outline'}>
                        {product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductToDelete(product)} className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page === pagination.totalPages || isLoading}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}