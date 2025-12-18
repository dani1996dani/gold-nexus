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
import { ArrowLeft, Save, Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmActionModal } from '@/components/admin/confirm-action-modal';

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
  
  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Watch imageUrl for preview
  const imageUrlValue = watch('imageUrl');

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
        reset(product);
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

  const handleDelete = async () => {
      setIsDeleting(true);
      try {
          const res = await fetch(`/api/admin/products/${id}`, {
              method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to delete');
          router.push('/admin/products');
          router.refresh();
      } catch (err) {
           setError('Failed to delete product');
           setShowDeleteModal(false);
      } finally {
          setIsDeleting(false);
      }
  }

  if (isLoading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
       <ConfirmActionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        isConfirming={isDeleting}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/admin/products">
            <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Edit Product</h1>
        </div>
        <div className="flex gap-2">
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </div>
      
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left Column: Main Info */}
            <div className="space-y-6 md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>Basic details about the product.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" {...register('name')} placeholder="e.g. 1kg Gold Bar" />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input id="sku" {...register('sku')} placeholder="Unique identifier" />
                                {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vendorName">Vendor / Mint</Label>
                                <Input id="vendorName" {...register('vendorName')} placeholder="e.g. PAMP Suisse" />
                                {errors.vendorName && <p className="text-xs text-red-500">{errors.vendorName.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register('description')} className="min-h-[120px]" placeholder="Detailed product description..." />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>Pricing & Attributes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (USD)</Label>
                                <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight</Label>
                                <Input id="weight" {...register('weight')} placeholder="e.g. 1 oz" />
                                {errors.weight && <p className="text-xs text-red-500">{errors.weight.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="karat">Karat / Purity</Label>
                                <Input id="karat" {...register('karat')} placeholder="e.g. 24K" />
                                {errors.karat && <p className="text-xs text-red-500">{errors.karat.message}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Status & Media */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Status & Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>Visibility</Label>
                            <div className="flex h-10 items-center space-x-2 rounded-md border px-3">
                                <Controller
                                    control={control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                                <Label htmlFor="isActive" className="cursor-pointer text-sm font-normal">Active Product</Label>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label>Stock Status</Label>
                             <Controller
                                control={control}
                                name="stockStatus"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                    </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="BAR">Bar</SelectItem>
                                      <SelectItem value="COIN">Coin</SelectItem>
                                      <SelectItem value="JEWELRY">Jewelry</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                            />
                             {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
                            {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl.message}</p>}
                        </div>
                         {/* Simple Preview */}
                         <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted">
                            {imageUrlValue ? (
                                <img src={imageUrlValue} alt="Preview" className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = '')} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No Image Preview</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </div>
  );
}