'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/admin/status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import LeadDetailLoading from '@/app/admin/leads/[id]/loading';
import { formatWeight } from '@/lib/utils/formatWeight';
import { authFetch } from '@/lib/auth-fetch';

const LEAD_STATUSES = ['SUBMITTED', 'CONTACTED', 'CLOSED'] as const;

type LeadDetail = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  itemType: string;
  estimatedKarat: string;
  estimatedWeight: number;
  estimatedValue: string | null;
  status: string;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
};

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectValue, setSelectValue] = useState<string | undefined>();

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = await params;
        const res = await authFetch(`/api/admin/leads/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          } else {
            throw new Error('Failed to load lead details');
          }
          return;
        }
        const fetchedLead = await res.json();
        setLead(fetchedLead);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params]);

  useEffect(() => {
    setSelectValue(lead?.status);
  }, [lead]);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === lead?.status) return;

    setIsUpdatingStatus(true);
    setError(null);
    setSelectValue(newStatus);

    try {
      const res = await authFetch(`/api/admin/leads/${lead!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to update status');
      }

      const updatedLead = await res.json();
      setLead(updatedLead);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSelectValue(lead?.status); // Revert on error
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <LeadDetailLoading />;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!lead) {
    notFound();
  }

  const leadDetails = {
    'Full Name': lead.fullName,
    'Email Address': lead.email,
    'Phone Number': lead.phoneNumber,
    Country: lead.country,
    City: lead.city,
    'Item Type': lead.itemType,
    'Estimated Karat': lead.estimatedKarat,
    'Estimated Weight': formatWeight(lead.estimatedWeight),
    'Submitted At': formatDate(lead.createdAt, { showTime: true }),
    'Last Updated': formatDate(lead.updatedAt, { showTime: true }),
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
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
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
                    <p>{String(value) || '-'}</p>
                  </div>
                ))}
                <div>
                  <h3 className="font-medium text-muted-foreground">Status</h3>
                  <Select
                    value={selectValue}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue asChild>
                        {selectValue ? <StatusBadge status={selectValue} /> : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          <StatusBadge status={s} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">Initial Estimated Value</h3>
                  <p className="text-lg font-semibold">
                    {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : 'N/A'}
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
              {lead.photoUrls.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {lead.photoUrls.map((url, index) => (
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
      </div>
    </div>
  );
}
