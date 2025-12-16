import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CATEGORIES, ProductCategory } from '@/config/categories';

interface FilterSidebarProps {
  categories: ProductCategory[];
  onCategoryChange: (category: ProductCategory) => void;
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
    <div className="flex h-full flex-col rounded-lg border border-border/50 bg-secondary/30 p-6 lg:h-auto">
      <div className="flex-grow">
        <h3 className="mb-6 font-serif text-xl font-medium">Asset Class</h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.value} className="flex items-center space-x-2">
              <Checkbox
                id={cat.value}
                checked={categories.includes(cat.value)}
                onCheckedChange={() => onCategoryChange(cat.value)}
              />
              <label htmlFor={cat.value} className="cursor-pointer text-sm font-medium">
                {cat.label}
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
