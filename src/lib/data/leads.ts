import { prisma } from '@/lib/db';

/**
 * Fetches a paginated list of second-hand gold leads.
 * This function centralizes the data access logic so it can be reused
 * by both Server Components and API Routes.
 */
export async function getLeads(
  page: number,
  limit: number,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit;

  const [leads, total] = await prisma.$transaction([
    prisma.secondHandLead.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.secondHandLead.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Safely parse photoUrls for each lead and serialize Decimal
  const leadsWithParsedPhotos = leads.map((lead) => {
    const photoUrls: string[] =
      lead.photoUrls && Array.isArray(lead.photoUrls)
        ? lead.photoUrls.filter((item): item is string => typeof item === 'string')
        : [];
    return {
      ...lead,
      photoUrls,
      estimatedValue: lead.estimatedValue ? lead.estimatedValue.toString() : null,
    };
  });

  return {
    data: leadsWithParsedPhotos,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/**
 * Fetches a single lead by its ID.
 * @param id The ID of the lead to fetch.
 */
export async function getLeadById(id: string) {
  const lead = await prisma.secondHandLead.findUnique({
    where: { id },
  });

  if (!lead) {
    return null;
  }

  const photoUrls: string[] =
    lead.photoUrls && Array.isArray(lead.photoUrls)
      ? lead.photoUrls.filter((item): item is string => typeof item === 'string')
      : [];

  return {
    ...lead,
    photoUrls,
    estimatedValue: lead.estimatedValue ? lead.estimatedValue.toString() : null,
  };
}
