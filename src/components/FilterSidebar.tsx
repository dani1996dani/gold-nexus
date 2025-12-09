import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export const FilterSidebar = ({
  categories,
  onCategoryChange,
  onApply,
  onClear,
}: FilterSidebarProps) => {
  return (
    <div className="flex h-full lg:h-auto flex-col rounded-lg border border-border/50 bg-secondary/30 p-6">
      <div className="flex-grow">
        <h3 className="mb-6 font-serif text-xl font-medium">Asset Class</h3>
        <div className="space-y-3">
          {['Gold Bars', 'Gold Coins', 'Investment Jewelry'].map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={cat}
                checked={categories.includes(cat)}
                onCheckedChange={() => onCategoryChange(cat)}
              />
              <label htmlFor={cat} className="cursor-pointer text-sm font-medium">
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Button onClick={onApply}>Apply Filters</Button>
        <Button variant="ghost" onClick={onClear}>
          Clear All
        </Button>
      </div>
    </div>
  );
};
