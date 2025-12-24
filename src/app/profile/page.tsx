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
import { CountryDropdown, Country } from '@/components/ui/country-dropdown';
import { countries } from 'country-data-list';
import { Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { UserProfile, OrderWithItems } from '@/lib/types';
import { getOrderStatusVariant } from '@/lib/statusUtils';
import ProfilePageLoading from '@/app/profile/loading';
import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { authFetch } from '@/lib/auth-fetch';

export default function MyAccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    country: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authFetch('/api/users/me');
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data: UserProfile = await res.json();
        setUser(data);
        setFormData({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          country: data.country,
        });
      } catch (err: unknown) {
        // @ts-expect-error an error bro.
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel edit: reset form data
      if (user) {
        setFormData({
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          country: user.country,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await authFetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await res.json();
      setUser({ ...user, ...updatedUser }); // Update local user state
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCountryObject = countries.all.find((c) => c.name === formData.country);

  const hasChanges =
    user &&
    (formData.fullName !== user.fullName ||
      formData.phoneNumber !== user.phoneNumber ||
      formData.country !== user.country);

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
          <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4">
            <CardTitle className="font-sans text-xl font-semibold">Profile Details</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleEdit}
              className="h-8 w-8 rounded-full p-0"
              title={isEditing ? 'Cancel' : 'Edit Profile'}
            >
              {isEditing ? (
                <X className="h-4 w-4 text-neutral-500" />
              ) : (
                <Pencil className="h-4 w-4 text-neutral-500" />
              )}
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSaveChanges} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-neutral-500">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="full-name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="rounded-md border-neutral-300"
                      required
                    />
                  ) : (
                    <p className="py-2 font-medium text-black">{user.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-500">
                    Email Address
                  </Label>
                  <p className="py-2 text-neutral-400">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-neutral-500">
                    Country
                  </Label>
                  {isEditing ? (
                    <CountryDropdown
                      value={selectedCountryObject}
                      onChange={(country: Country) =>
                        setFormData({ ...formData, country: country.name })
                      }
                    />
                  ) : (
                    <p className="py-2 font-medium text-black">{user.country}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number" className="text-neutral-500">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone-number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="rounded-md border-neutral-300"
                      required
                    />
                  ) : (
                    <p className="py-2 font-medium text-black">{user.phoneNumber}</p>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex w-full flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleToggleEdit}
                    className="rounded-md border-neutral-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                    className="rounded-md bg-black px-6 font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
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
                      <TableHead className="text-xs uppercase text-neutral-500">Status</TableHead>
                      <TableHead className="text-xs uppercase text-neutral-500">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.orders.map((order: OrderWithItems) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer border-neutral-200 hover:bg-neutral-50"
                        onClick={() => router.push(`/profile/orders/${order.id}`)}
                      >
                        <TableCell className="font-medium">#{order.displayId}</TableCell>
                        <TableCell className="text-neutral-600">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getOrderStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(Number(order.totalAmount))}
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
