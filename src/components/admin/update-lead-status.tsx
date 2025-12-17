'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './status-badge';

interface UpdateLeadStatusProps {
  leadId: string;
  currentStatus: string;
  statuses: string[];
}

export function UpdateLeadStatus({ leadId, currentStatus, statuses }: UpdateLeadStatusProps) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to update status');
      }

      // Refresh the page to show the updated status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={(value: string) => setStatus(value)} defaultValue={status}>
            <SelectTrigger>
              <SelectValue asChild>
                <StatusBadge status={status as any} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  <StatusBadge status={s as any} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleUpdate} disabled={isLoading || status === currentStatus}>
            {isLoading ? 'Saving...' : 'Save Status'}
          </Button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
