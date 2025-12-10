'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Minus, Plus, Trash2, X } from 'lucide-react';
import goldCoinEagle from '@/assets/mocks/coin.png';
import oneOz from '@/assets/mocks/1-oz.png';

// Mock data to replicate the design. In a real app, this would come from state management.
const initialItems = [
  {
    id: 1,
    name: '1 oz PAMP Suisse Gold Bar',
    price: 2689.5,
    quantity: 1,
    image: oneOz, // Replace with your actual image path
  },
  {
    id: 2,
    name: 'American Gold Eagle 1 oz',
    price: 2745.0,
    quantity: 2,
    image: goldCoinEagle, // Replace with your actual image path
  },
];

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function ShoppingCartSheet() {
  // We use state here to simulate adding/removing items for the demo
  const [items, setItems] = useState(initialItems);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative rounded-full p-2 transition-colors hover:bg-gray-100">
          <ShoppingCart className="h-5 w-5 text-[#1a202c]" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FDE68A] text-xs font-bold text-black">
            {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col bg-white p-2 sm:max-w-md">
        <SheetHeader className="pr-10">
          <SheetTitle className="font-serif text-2xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            {/* ITEMS LIST */}
            <ScrollArea className="flex-grow pr-4">
              <div className="my-6 flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                      <Image src={item.image} alt="product image" fill />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center rounded-md border border-gray-300">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-r-none">
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-l-none">
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <SheetFooter className="mt-auto flex-col space-y-4 border-t pt-6">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <SheetClose asChild>
                <Link href="/checkout" className="w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-md bg-black font-semibold text-white hover:bg-neutral-800"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          // EMPTY STATE
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-sm text-gray-500">Add items to your cart to get started.</p>
            </div>
            <SheetClose asChild>
              <Link href="/marketplace">
                <Button className="rounded-md bg-black font-semibold text-white hover:bg-neutral-800">
                  Start Shopping
                </Button>
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
