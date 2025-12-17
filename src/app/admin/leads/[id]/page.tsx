import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/admin/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadStatus } from '@/generated/prisma/client';
import { UpdateLeadStatus } from '@/components/admin/update-lead-status';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getLeadById } from '@/lib/data/leads';
import { formatDate } from '@/lib/utils';

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const photoUrls: string[] = Array.isArray(lead.photoUrls) ? lead.photoUrls : [];

  const leadDetails = {
    'Full Name': lead.fullName,
    'Email Address': lead.email,
    'Phone Number': lead.phoneNumber,
    Country: lead.country,
    City: lead.city,
    'Item Type': lead.itemType,
    'Estimated Karat': lead.estimatedKarat,
    'Estimated Weight': lead.estimatedWeight,
    'Submitted At': formatDate(lead.createdAt, {showTime: true}),
    'Last Updated': formatDate(lead.updatedAt, {showTime: true}),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/leads">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Leads
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
              <CardDescription>Inquiry from {lead.fullName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                {Object.entries(leadDetails).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="font-medium text-muted-foreground">{key}</h3>
                    <p>{value || '-'}</p>
                  </div>
                ))}
                <div>
                  <h3 className="font-medium text-muted-foreground">Status</h3>
                  <StatusBadge status={lead.status} />
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Initial Estimated Value</h3>
                  <p className="text-lg font-semibold">
                    {lead.estimatedValue ? `$${lead.estimatedValue.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Submitted Photos</CardTitle>
            </CardHeader>
            <CardContent>
              {photoUrls.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {photoUrls.map((url, index) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                      <img
                        src={url}
                        alt={`Lead photo ${index + 1}`}
                        className="aspect-square w-full rounded-md object-cover transition-transform hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No photos were submitted with this lead.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <UpdateLeadStatus
            leadId={lead.id}
            currentStatus={lead.status}
            statuses={Object.values(LeadStatus)}
          />
        </div>
      </div>
    </div>
  );
}
