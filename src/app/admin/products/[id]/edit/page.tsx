'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// This schema can be slightly more lenient than creation, or identical
const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  weight: z.string().min(1, 'Weight is required'),
  karat: z.string().min(1, 'Karat is required'),
  category: z.enum(['BAR', 'COIN', 'JEWELRY']),
  imageUrl: z.string().url('Must be a valid URL'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK']),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset, // Use reset to populate form
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product data');
        }
        const product = await res.json();
        reset(product); // Populate the form with fetched data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load product data.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to update product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading product...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update the details for this product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Form fields are identical to NewProductPage, react-hook-form handles population */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register('sku')} />
                {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
               <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (e.g., "1 oz", "10 g")</Label>
                <Input id="weight" {...register('weight')} />
                {errors.weight && <p className="text-xs text-red-500">{errors.weight.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="karat">Karat (e.g., "24K")</Label>
                <Input id="karat" {...register('karat')} />
                {errors.karat && <p className="text-xs text-red-500">{errors.karat.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" {...register('imageUrl')} />
                {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input id="vendorName" {...register('vendorName')} />
                {errors.vendorName && <p className="text-xs text-red-500">{errors.vendorName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BAR">Bar</SelectItem>
                        <SelectItem value="COIN">Coin</SelectItem>
                        <SelectItem value="JEWELRY">Jewelry</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="stockStatus"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Stock Status</Label>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select stock status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN_STOCK">In Stock</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.stockStatus && <p className="text-xs text-red-500">{errors.stockStatus.message}</p>}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                        <Label htmlFor="isActive">Product is Active</Label>
                    </div>
                )}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
