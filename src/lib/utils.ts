import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStatus(status: string): string {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function formatDate(
  date: string | Date,
  options: { showTime?: boolean } = { showTime: false }
): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  if (options.showTime) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = 'numeric';
    dateOptions.hour12 = true;
  }

  return new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(date));
}

export function formatPriceNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) {
    return String(value);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

