import { prisma } from '@/lib/db';

/**
 * Fetches a paginated list of second-hand gold leads.
 * This function centralizes the data access logic so it can be reused
 * by both Server Components and API Routes.
 */
export async function getLeads(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [leads, total] = await prisma.$transaction([
    prisma.secondHandLead.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.secondHandLead.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: leads,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
