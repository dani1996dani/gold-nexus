export function formatCurrency(amount: number | string | null | undefined) {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericAmount);
}
