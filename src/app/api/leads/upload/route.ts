import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // --- Robustness check: Ensure supabase client is initialized ---
    if (!supabase) {
      return NextResponse.json(
        { message: 'Supabase client is not configured on the server.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // --- Validate File ---
    if (file.size === 0) {
      return NextResponse.json({ message: 'File is empty' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filePath = `${uuidv4()}.${fileExtension}`; // Simpler path, directly in the bucket root or folder

    console.log(`[API/LEADS/UPLOAD] Attempting to upload ${file.name} to gold-nexus-leads...`);

    const { data, error } = await supabase.storage
      .from('gold-nexus-leads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('[API/LEADS/UPLOAD] Supabase Storage Error:', error);
      return NextResponse.json({ message: `Storage error: ${error.message}` }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('gold-nexus-leads').getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('[API/LEADS/UPLOAD] Catch-all Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
