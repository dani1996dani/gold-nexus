import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { getProducts } from '@/lib/data/products';
import { ProductActions } from '@/components/admin/product-actions';
import { SortableColumn } from '@/components/admin/sortable-column';
import { ProductSearch } from '@/components/admin/product-search';

import { ClickableTableRow } from '@/components/admin/clickable-table-row';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const limit = parseInt(resolvedParams.limit || '10', 10);
  const search = resolvedParams.search || '';
  const sortBy = resolvedParams.sortBy || 'createdAt';
  const sortOrder = resolvedParams.sortOrder || 'desc';

  const { data: products, pagination } = await getProducts(page, limit, search, sortBy, sortOrder);
  const { total, totalPages } = pagination;

  return (
    <div className="space-y-6">
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
        <ProductSearch />
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead className="w-[150px]">
                  <SortableColumn column="sku" label="SKU" />
                </TableHead>
                <TableHead>
                  <SortableColumn column="name" label="Name" />
                </TableHead>
                <TableHead className="w-[250px]">
                  <SortableColumn column="stockStatus" label="Stock Status" />
                </TableHead>
                <TableHead className="w-[200px]">
                  <SortableColumn column="isActive" label="Active" />
                </TableHead>
                <TableHead className="w-[200px]">
                  <SortableColumn column="isFeatured" label="Featured" />
                </TableHead>
                <TableHead className="w-[200px] text-right">
                  <SortableColumn column="price" label="Price" />
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <ClickableTableRow key={product.id} href={`/admin/products/${product.id}/edit`}>
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
                    <TableCell className="max-w-[150px] truncate font-medium">
                      {product.sku}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={product.name}>
                      {product.name}
                    </TableCell>
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
                    <TableCell>
                      {product.isFeatured ? (
                        <Badge
                          variant="outline"
                          className="border-yellow-500 bg-yellow-50 text-yellow-600"
                        >
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(product.price))}
                    </TableCell>
                    <TableCell>
                      <ProductActions productId={product.id} productName={product.name} />
                    </TableCell>
                  </ClickableTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex flex-row items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link
              href={
                page > 1
                  ? `/admin/products?page=${page - 1}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
                  : '#'
              }
            >
              <ChevronLeft className="h-2 w-2" /> Previous
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
            <Link
              href={
                page < totalPages
                  ? `/admin/products?page=${page + 1}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
                  : '#'
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
