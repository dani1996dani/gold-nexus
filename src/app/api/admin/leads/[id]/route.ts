import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { LeadStatus } from '@/generated/prisma/client';
import { getLeadById } from '@/lib/data/leads';
import { prisma } from '@/lib/db';

const getLeadByIdHandler: AdminApiHandler = async (req, context) => {
  try {
    const { params: paramsPromise } = context;
    const { id } = await paramsPromise;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Invalid lead ID' }, { status: 400 });
    }

    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error(`[API/ADMIN/LEADS/[id]] Error fetching lead:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

const updateLeadHandler: AdminApiHandler = async (req, context) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Invalid lead ID' }, { status: 400 });
    }

    // Validate the status
    const isValidStatus = Object.values(LeadStatus).includes(status);
    if (!status || !isValidStatus) {
      return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
    }

    const updatedLead = await prisma.secondHandLead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(`[API/ADMIN/LEADS/[id]] Error updating lead:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = withAdminAuth(getLeadByIdHandler);
export const PUT = withAdminAuth(updateLeadHandler);
