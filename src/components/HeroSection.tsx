import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const heroImage = '/hero-image.webp';
  return (
    <section className="relative flex h-[80vh] min-h-[600px] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1
          className="mb-6 drop-shadow-gray-900 drop-shadow-2xl animate-fade-in font-serif text-4xl font-medium leading-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '0.2s' }}
        >Direct Market&nbsp;Access to Physical&nbsp;Gold</h1>

        <p
          className="mx-auto mb-10 max-w-2xl animate-fade-in font-sans text-lg text-white/80 opacity-0 sm:text-xl"
          style={{ animationDelay: '0.4s' }}
        >
            Buy, sell, and secure investment-grade assets with instant global liquidity.
        </p>

        <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
          <Button variant="gold" size="xl" className="rounded-sm">View Live Market</Button>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      {/*<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />*/}
    </section>
  );
};

export default HeroSection;
