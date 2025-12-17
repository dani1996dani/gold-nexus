import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { getLeads } from '@/lib/data/leads';

const getLeadsHandler: AdminApiHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const leadsData = await getLeads(page, limit);

    return NextResponse.json(leadsData);
  } catch (error) {
    console.error('[API/ADMIN/LEADS] Error fetching leads:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = withAdminAuth(getLeadsHandler);
