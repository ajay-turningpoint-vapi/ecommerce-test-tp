// Deterministic pseudo-stock based on product+variant id so it's stable across renders
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export interface StockInfo {
  level: number; // 0 = out, 1-5 = low, 6+ = in stock
  status: 'out' | 'low' | 'in';
  label: string;
}

export function getStockInfo(productId: string, variantId?: string): StockInfo {
  const seed = hash(`${productId}:${variantId || ''}`);
  const bucket = seed % 100;

  // 5% out of stock, 20% low stock, 75% in stock
  if (bucket < 5) return { level: 0, status: 'out', label: 'Out of stock' };
  if (bucket < 25) {
    const left = (seed % 5) + 1; // 1-5
    return { level: left, status: 'low', label: `Only ${left} left` };
  }
  return { level: 50, status: 'in', label: 'In stock' };
}
