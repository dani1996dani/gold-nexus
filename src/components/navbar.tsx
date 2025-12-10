import { Button } from '@/components/ui/button';
import { GoldTicker } from '@/components/GoldTicker';
import Link from 'next/link';
import {ShoppingCartSheet} from "@/components/cart/shopping-cart-sheet";

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-50">
      <GoldTicker />
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <div className="font-serif text-2xl font-bold text-[#1a202c]">Gold Nexus</div>
            </Link>
            <div className="flex items-center gap-8">
              <a
                href="/marketplace"
                className="hidden font-medium text-[#1a202c] transition-colors hover:text-[#D4AF37] md:block"
              >
                Buy Gold
              </a>
              <a
                href="/sell-gold"
                className="hidden font-medium text-[#1a202c] transition-colors hover:text-[#D4AF37] md:block"
              >
                Sell Gold
              </a>
              <a
                href="#learn-more"
                className="hidden font-medium text-[#1a202c] transition-colors hover:text-[#D4AF37] md:block"
              >
                Learn More
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-gray-900 bg-transparent text-[#1a202c] hover:bg-gray-900 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <ShoppingCartSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
