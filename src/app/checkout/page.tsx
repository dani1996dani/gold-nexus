import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Lock } from 'lucide-react';

// Mock data to replicate the Order Summary
import oneOz from '@/assets/mocks/1-oz.png';
import goldCoinEagle from '@/assets/mocks/coin.png';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { countries } from 'country-data-list';

const cartItems = [
  {
    id: 1,
    name: '1 oz PAMP Suisse Gold Bar',
    price: 2689.5,
    quantity: 1,
    image: oneOz,
  },
  {
    id: 2,
    name: 'American Gold Eagle 1 oz',
    price: 2745.0,
    quantity: 2,
    image: goldCoinEagle,
  },
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shipping = 0; // Shipping is free as per the design
const total = subtotal + shipping;

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-6xl">
        <h1 className="mb-8 font-serif text-4xl font-medium text-black sm:text-5xl">Checkout</h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left Column: Shipping Information */}
          <Card className="border-neutral-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="font-sans text-xl font-semibold">
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="John Smith"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment / Suite (optional)</Label>
                  <Input
                    id="apartment"
                    placeholder="Apt 4B"
                    className="rounded-md border-neutral-300"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      className="rounded-md border-neutral-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <CountryDropdown value={countries.all[0]}/>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                        id="state"
                        placeholder="NY"
                        className="rounded-md border-neutral-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal Code</Label>
                    <Input
                      id="postal-code"
                      placeholder="10001"
                      className="rounded-md border-neutral-300"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right Column: Order Summary */}
          <Card className="border-neutral-200 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="font-sans text-xl font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button
                size="lg"
                className="w-full rounded-md bg-black font-semibold text-white hover:bg-neutral-800"
              >
                <Lock className="mr-2 h-4 w-4" />
                Confirm and Pay
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
