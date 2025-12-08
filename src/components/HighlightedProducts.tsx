import { ProductCard } from './ProductCard';
import goldCoinEagle from '@/assets/mocks/coin.png';
import oneOz from '@/assets/mocks/1-oz.png';
import tenOz from '@/assets/mocks/10-oz.png';
import oneKilo from '@/assets/mocks/1-kg.png';

const products = [
  {
    name: '1 oz Gold Bar',
    weight: '1 oz',
    price: '$2,689',
    purity: '99.99% Pure',
    image: oneOz,
  },
  {
    name: '10 oz Gold Bar',
    weight: '10 oz',
    price: '$26,450',
    purity: '99.99% Pure',
    image: tenOz,
  },
  {
    name: '1 kg Gold Bar',
    weight: '32.15 oz',
    price: '$84,750',
    purity: '99.99% Pure',
    image: oneKilo,
  },
  {
    name: 'Gold Eagle Coin',
    weight: '1 oz',
    price: '$2,795',
    purity: '91.67% Pure',
    image: goldCoinEagle,
  },
];

export const HighlightedProducts = () => {
  return (
    <section id="marketplace" className="bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <h2 className="mb-4 font-serif text-3xl font-medium text-foreground sm:text-4xl md:text-5xl">
            Featured Gold&nbsp;Products
          </h2>
          <p className="mx-auto max-w-xl font-sans text-muted-foreground">
            Investment-grade gold available for instant purchase.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};
