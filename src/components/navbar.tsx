import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { GoldTicker } from '@/components/GoldTicker';

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-50">
      <GoldTicker />
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="font-serif text-2xl font-bold text-[#1a202c]">Gold Nexus</div>
            <div className="flex items-center gap-8">
              <a
                href="#buy-gold"
                className="hidden font-medium text-[#1a202c] transition-colors hover:text-[#D4AF37] md:block"
              >
                Buy Gold
              </a>
              <a
                href="#sell-gold"
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
              <Button
                variant="outline"
                className="border-gray-900 bg-transparent text-[#1a202c] hover:bg-gray-900 hover:text-white"
              >
                Login
              </Button>
              <button className="relative rounded-full p-2 transition-colors hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5 text-[#1a202c]" />
                <span className="bg-gold-shimmer absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-gray-800">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
