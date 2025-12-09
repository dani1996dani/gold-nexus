
import HeroSection from '@/components/HeroSection';
import { HighlightedProducts } from '@/components/HighlightedProducts';
import { TrustIndicators } from '@/components/TrustIndicators';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      <HeroSection />
      <HighlightedProducts />
      <TrustIndicators />
    </div>
  );
}
