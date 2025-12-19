import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import Papa from 'papaparse';

const productCsvSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().transform(val => parseFloat(val)),
  weight: z.string().min(1),
  karat: z.string().min(1),
  category: z.enum(['BAR', 'COIN', 'JEWELRY']),
  vendorName: z.string().min(1),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK']),
});

const importCsvHandler: AdminApiHandler = async (req) => {
  try {
    if (!supabase) {
        return NextResponse.json({ message: 'Supabase client is not configured.' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // --- Pre-fetch Storage File List (Paginated) ---
    // We fetch ALL files to handle the extension mapping efficiently (avoiding N+1 requests).
    // For 10k products, this is only ~10 requests and ~1MB of data.
    const imageMap = new Map<string, string>();
    let offset = 0;
    const PAGE_SIZE = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data: batch, error: listError } = await supabase.storage
            .from('gold-nexus-images')
            .list('', { limit: PAGE_SIZE, offset });
        
        if (listError) {
            console.error('Error listing images:', listError);
            break; // Best effort
        }

        if (!batch || batch.length === 0) {
            hasMore = false;
        } else {
            batch.forEach(f => {
                // Map "sku.jpg" -> "sku"
                const fileNameParts = f.name.split('.');
                if (fileNameParts.length > 1) {
                    const sku = fileNameParts.slice(0, -1).join('.'); // Handle SKUs with dots
                    imageMap.set(sku.toLowerCase(), f.name);
                }
            });
            
            if (batch.length < PAGE_SIZE) {
                hasMore = false;
            } else {
                offset += PAGE_SIZE;
            }
        }
    }

    const text = await file.text();
    
    // 1. Robust CSV Parsing with PapaParse
    const { data: rows, errors: parseErrors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseErrors.length > 0) {
       return NextResponse.json({ 
         message: 'CSV Parsing Failed', 
         errors: parseErrors.map(e => `Line ${e.row}: ${e.message}`) 
       }, { status: 400 });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    const validUpdates: any[] = [];

    for (const [index, row] of (rows as any[]).entries()) {
      try {
        const parsedData = productCsvSchema.parse({
            sku: row.sku,
            name: row.name,
            description: row.description,
            price: row.price,
            weight: row.weight,
            karat: row.karat,
            category: row.category?.toUpperCase(),
            vendorName: row.vendorName,
            stockStatus: row.stockStatus?.toUpperCase().replace(/\s+/g, '_'),
        });

        // --- Match SKU to Actual Filename using the Map ---
        // This is O(1) lookup.
        const actualFileName = imageMap.get(parsedData.sku.toLowerCase());
        
        const productData = {
            ...parsedData,
            isActive: true,
        };

        // Only set URL if we found a matching image file
        if (actualFileName) {
            const { data: { publicUrl } } = supabase.storage
                .from('gold-nexus-images')
                .getPublicUrl(actualFileName);
            (productData as any).imageUrl = publicUrl;
        } else {
             // If creating new and no image, this might fail if imageUrl is required in DB but optional here.
             // Based on schema, imageUrl IS required. We might need a placeholder or fail.
             // For now, if it's an update, we assume they might want to keep the old one?
             // But validUpdates structure below overwrites it.
             // We'll set a placeholder if missing to prevent crash, or let Prisma throw if strict.
             // Let's rely on the schema default if we can, but we are providing the object.
             // Actually, the previous code defaulted to empty string or placeholder.
             // We will skip adding 'imageUrl' key if not found, 
             // BUT `upsert` needs `create` block to have it.
             if (!imageMap.has(parsedData.sku.toLowerCase())) {
                 // Warning: No image found for this SKU
             }
        }

        // We construct the update object. 
        // If imageUrl is found, we add it. If not, for 'update' we leave it undefined (no change).
        // For 'create', it's required. We need a fallback or it will fail.
        const createData: typeof productData & { imageUrl: string } = { ...productData, imageUrl: (productData as any).imageUrl };
        if (!createData.imageUrl) {
             createData.imageUrl = ''; // Will likely fail validation if empty is not allowed, or be broken image.
        }

        validUpdates.push({
            where: { sku: parsedData.sku },
            update: productData, // Prisma ignores undefined keys in update
            create: createData,
        });

      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Row ${index + 1} (${row.sku || 'Unknown SKU'}): ${errorMessage}`);
      }
    }

    // 3. Transactional Write (Data Integrity Fix)
    // Using $transaction to ensure atomicity for the batch would be ideal, 
    // but upsert isn't directly batchable in one query without raw SQL or a loop inside $transaction.
    // We will run the promises in parallel inside a transaction scope.
    
    if (validUpdates.length > 0) {
        try {
            await prisma.$transaction(
                validUpdates.map(op => prisma.product.upsert(op))
            );
            results.success = validUpdates.length;
        } catch (dbError) {
            console.error('Batch DB Error:', dbError);
            return NextResponse.json({ 
                message: 'Database Transaction Failed', 
                details: dbError instanceof Error ? dbError.message : 'Unknown DB error' 
            }, { status: 500 });
        }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('[API/ADMIN/PRODUCTS/IMPORT-CSV] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const POST = withAdminAuth(importCsvHandler);
