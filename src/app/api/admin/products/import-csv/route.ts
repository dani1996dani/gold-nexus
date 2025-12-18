import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Simple CSV Parser
function parseCSV(text: string) {
  const lines = text.split(/\r?\n/);
  const headers = lines[0]?.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted values containing commas
    const values: string[] = [];
    let current = '';
    let inQuote = false;
    
    for (let char of line) {
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            values.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  return rows;
}

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
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const [index, row] of rows.entries()) {
      try {
        // Map CSV headers to schema keys if necessary, or assume they match
        // Expected headers: sku, name, description, price, weight, karat, category, vendorName, stockStatus
        
        const parsedData = productCsvSchema.parse({
            sku: row.sku,
            name: row.name,
            description: row.description,
            price: row.price,
            weight: row.weight,
            karat: row.karat,
            category: row.category?.toUpperCase(), // Ensure enum match
            vendorName: row.vendorName,
            stockStatus: row.stockStatus?.toUpperCase().replace(' ', '_'), // Try to normalize
        });

        // Construct Image URL
        // We assume the image is uploaded with the name matching the SKU (and probably extension)
        // Since we don't know the extension, we might have to guess or check.
        // Or simpler: We just assume .jpg or .png or rely on what's in the bucket.
        // Actually, 'getPublicUrl' just constructs a string, it doesn't check existence.
        // For now, we will assume the user uploaded SKU.jpg or SKU.png. 
        // A better convention might be to just point to the SKU name and let the frontend/browser handle it?
        // No, `imageUrl` in DB is a full URL.
        // Let's assume .jpg for now as a default, or checking the file extension is impossible here without checking storage.
        // Alternative: The CSV *could* have an imageUrl column, but the plan says "automatically construct the imageUrl from the sku".
        // Let's use `[sku].jpg` as a default convention.
        
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`${parsedData.sku}.jpg`); // Defaulting to jpg
        
        // Upsert Product
        await prisma.product.upsert({
            where: { sku: parsedData.sku },
            update: {
                ...parsedData,
                imageUrl: publicUrl,
                isActive: true,
            },
            create: {
                ...parsedData,
                imageUrl: publicUrl,
                isActive: true,
            },
        });

        results.success++;
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Row ${index + 1} (${row.sku || 'Unknown SKU'}): ${errorMessage}`);
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('[API/ADMIN/PRODUCTS/IMPORT-CSV] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const POST = withAdminAuth(importCsvHandler);
