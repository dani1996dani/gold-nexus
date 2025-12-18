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
    if (!supabase) {
        return NextResponse.json({ message: 'Supabase client is not configured.' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // --- Pre-fetch Storage File List ---
    // We list files to find the correct extensions for each SKU
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('gold-nexus-images')
      .list('', { limit: 1000 }); // Adjust limit if inventory is huge

    const imageMap = new Map<string, string>();
    if (!storageError && storageFiles) {
        storageFiles.forEach(f => {
            const fileNameParts = f.name.split('.');
            if (fileNameParts.length > 1) {
                const sku = fileNameParts.slice(0, -1).join('.'); // Handle SKUs with dots
                imageMap.set(sku.toLowerCase(), f.name);
            }
        });
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
        const parsedData = productCsvSchema.parse({
            sku: row.sku,
            name: row.name,
            description: row.description,
            price: row.price,
            weight: row.weight,
            karat: row.karat,
            category: row.category?.toUpperCase(),
            vendorName: row.vendorName,
            stockStatus: row.stockStatus?.toUpperCase().replace(' ', '_'),
        });

        // --- Match SKU to Actual Filename ---
        const actualFileName = imageMap.get(parsedData.sku.toLowerCase()) || `${parsedData.sku}.jpg`;
        
        const { data: { publicUrl } } = supabase.storage
            .from('gold-nexus-images')
            .getPublicUrl(actualFileName);
        
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
