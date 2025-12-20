'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { countries } from 'country-data-list';

import { UserProfile, OrderWithItems } from '@/lib/types';
import { getOrderStatusVariant } from '@/lib/statusUtils';
import ProfilePageLoading from '@/app/profile/loading';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function MyAccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/users/me');
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data: UserProfile = await res.json();
        setUser(data);
      } catch (err: unknown) {
        // @ts-expect-error an error bro.
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const selectedCountryObject = user
    ? countries.all.find((c) => c.name === user.country)
    : undefined;

  if (loading) {
    return <ProfilePageLoading />;
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">Error: {error}</div>;
  }
  if (!user) {
    return <div className="p-12 text-center">No user data found.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-serif text-4xl font-bold text-black">My Account</h1>
        <Card className="border-neutral-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="font-sans text-xl font-semibold">Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={user.fullName}
                    readOnly
                    className="rounded-md border-neutral-300 bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="rounded-md border-neutral-300 bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {selectedCountryObject && (
                    <CountryDropdown value={selectedCountryObject} disabled />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    value={user.phoneNumber}
                    readOnly
                    className="rounded-md border-neutral-300 bg-gray-100"
                  />
                </div>
              </div>
              <div className="flex w-full flex-row justify-end pt-2">
                <Button
                  type="submit"
                  disabled
                  className="rounded-md bg-black px-6 font-semibold text-white hover:bg-neutral-800"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10">
          <Card className="border-neutral-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="font-sans text-xl font-semibold">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase text-neutral-500">Order ID</TableHead>
                      <TableHead className="text-xs uppercase text-neutral-500">Date</TableHead>
                      <TableHead className="text-xs uppercase text-neutral-500">Total</TableHead>
                      <TableHead className="text-xs uppercase text-neutral-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.orders.map((order: OrderWithItems) => (
                      <TableRow key={order.id} className="border-neutral-200">
                        <TableCell className="font-medium">#{order.displayId}</TableCell>
                        <TableCell className="text-neutral-600">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(Number(order.totalAmount))}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getOrderStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  You have not placed any orders yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
