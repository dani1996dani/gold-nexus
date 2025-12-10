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

// Mock data to populate the order history table, matching the image
const orders = [
  {
    orderId: 'GN-2024-001234',
    date: 'Dec 5, 2024',
    total: '$5,378.00',
    status: 'Processing',
  },
  {
    orderId: 'GN-2024-001198',
    date: 'Nov 28, 2024',
    total: '$2,689.50',
    status: 'Shipped',
  },
  {
    orderId: 'GN-2024-001156',
    date: 'Nov 15, 2024',
    total: '$8,125.00',
    status: 'Delivered',
  },
];

export default function MyAccountPage() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-serif text-4xl font-bold text-black">My Account</h1>

        {/* Profile Details Card */}
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
                    defaultValue="John Smith"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="name@example.com"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <CountryDropdown defaultValue="USA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    defaultValue="(555) 000-0000"
                    className="rounded-md border-neutral-300"
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

        {/* Order History Card */}
        <div className="mt-10">
          <Card className="border-neutral-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="font-sans text-xl font-semibold">Order History</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {orders.map((order) => (
                    <TableRow key={order.orderId} className="border-neutral-200">
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell className="text-neutral-600">{order.date}</TableCell>
                      <TableCell className="font-bold">{order.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'Processing'
                              ? 'processing'
                              : order.status === 'Shipped'
                                ? 'shipped'
                                : 'delivered'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
