'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface GoldPriceData {
  currentPrice: string;
  previousPrice: string;
}

export const GoldTicker = () => {
  const [data, setData] = useState<GoldPriceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const res = await fetch('/api/gold-price');
        if (!res.ok) {
          throw new Error('Failed to load market data');
        }
        const priceData = await res.json();
        setData(priceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchGoldPrice();
    // Re-fetch every 60 seconds to keep the ticker fresh
    const interval = setInterval(fetchGoldPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (error) {
      return <span className="text-xs text-red-500">{error}</span>;
    }

    if (!data) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      );
    }

    const current = parseFloat(data.currentPrice);
    const previous = parseFloat(data.previousPrice);
    const change = current - previous;
    const percentageChange = previous === 0 ? 0 : (change / previous) * 100;

    const isUp = change > 0;
    const isDown = change < 0;
    const color = isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-500';
    const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

    return (
      <div className="flex items-center gap-2">
        <span className="font-medium text-[#1a202c]">Gold</span>
        <span className="font-semibold text-[#1a202c]">
          $
          {new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(current)}
        </span>
        <Icon className={`h-4 w-4 ${color}`} />
        <span className={`font-medium ${color}`}>{percentageChange.toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <div className="border-b border-gray-200 bg-[#F9FAFB] py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 text-sm">{renderContent()}</div>
      </div>
    </div>
  );
};
