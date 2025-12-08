import { Button } from '@/components/ui/button';
import Image, {StaticImageData} from "next/image";

interface ProductCardProps {
  name: string;
  weight: string;
  price: string;
  purity: string;
  image: string | StaticImageData;
}

export const ProductCard = ({ name, weight, price, purity, image }: ProductCardProps) => {
  return (
      <div className="group overflow-hidden rounded-lg border border-border/50 bg-card shadow-subtle transition-all duration-300 hover:shadow-card">
        {/* Image Container */}
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-secondary/50 p-6">
          <Image
              src={image}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Metadata Row (Purity & Weight) */}
          <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-3">
          <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
            {purity}
          </span>
            {/* THE WEIGHT LABEL FIX */}
            <span className="font-sans text-xs font-medium text-muted-foreground">
            Weight: <span className="text-foreground font-semibold">{weight}</span>
          </span>
          </div>

          <h3 className="mb-4 font-serif text-lg font-medium text-foreground">{name}</h3>

          {/* Price & Action Row */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-muted-foreground font-medium">Live Ask</span>
              <span className="font-sans text-xl font-bold text-foreground">{price}</span>
            </div>
            <Button variant="dark" size="sm" className="hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
              Add to Order
            </Button>
          </div>
        </div>
      </div>
  );
};
