import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

const uploadImagesHandler: AdminApiHandler = async (req) => {
  try {
    if (!supabase) {
        return NextResponse.json({ message: 'Supabase client is not configured on the server.' }, { status: 500 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      // We rely on the filename matching the SKU (e.g., "SKU123.jpg")
      // We will upload it directly. 'upsert: true' allows overwriting existing images.
      
      const buffer = await file.arrayBuffer();
      
      const { data, error } = await supabase.storage
        .from('gold-nexus-images')
        .upload(file.name, buffer, {
          contentType: file.type,
          upsert: true,
        });

       if (error) {
         console.error(`Error uploading ${file.name}:`, error);
         results.push({ name: file.name, status: 'error', message: error.message });
       } else {
         // Construct public URL
         const { data: { publicUrl } } = supabase.storage
           .from('gold-nexus-images')
           .getPublicUrl(data.path);
           
         results.push({ name: file.name, status: 'success', url: publicUrl });
       }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[API/ADMIN/PRODUCTS/UPLOAD-IMAGES] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = withAdminAuth(uploadImagesHandler);
