import type { PriceResponse } from "../api/usePrices";
import { calculateDiscountPercentage } from "../api/usePrices";

export interface BestPriceResult {
  unitPrice: number;
  originalUnitPrice?: number;
  discountPercent?: number;
}

/** Selects the cheapest price entry from a list and returns pricing info. */
export const getBestPrice = (prices: PriceResponse[]): BestPriceResult => {
  if (!prices.length) return { unitPrice: 0 };

  const best = prices.reduce((acc, curr) => {
    const accEffective = typeof acc.sale === "number" && acc.sale > 0 ? acc.sale : acc.price;
    const currEffective = typeof curr.sale === "number" && curr.sale > 0 ? curr.sale : curr.price;
    return currEffective < accEffective ? curr : acc;
  }, prices[0]);

  const hasSale = typeof best.sale === "number" && best.sale > 0 && best.sale < best.price;
  return {
    unitPrice: hasSale ? (best.sale as number) : best.price,
    originalUnitPrice: hasSale ? best.price : undefined,
    discountPercent: hasSale ? calculateDiscountPercentage(best.price, best.sale as number) : undefined,
  };
};

export interface SavingsItem {
  productId: string;
  storeId: string;
  quantity: number;
}

/**
 * Fetches prices for each unique product/store pair and sums savings
 * from promotional prices across all items.
 */
export const calculateListSavings = async (
  items: SavingsItem[],
  getPrices: (productId: string, storeId: string) => Promise<PriceResponse[]>,
): Promise<number> => {
  const uniquePairs = new Map<string, { productId: string; storeId: string }>();
  for (const item of items) {
    const key = `${item.productId}:${item.storeId}`;
    if (!uniquePairs.has(key)) {
      uniquePairs.set(key, { productId: item.productId, storeId: item.storeId });
    }
  }

  const priceMap = new Map<string, { price: number; sale?: number }>();
  await Promise.all(
    Array.from(uniquePairs.values()).map(async ({ productId, storeId }) => {
      try {
        const prices = await getPrices(productId, storeId);
        if (prices.length > 0) {
          priceMap.set(`${productId}:${storeId}`, { price: prices[0].price, sale: prices[0].sale });
        }
      } catch {}
    }),
  );

  let total = 0;
  for (const item of items) {
    const p = priceMap.get(`${item.productId}:${item.storeId}`);
    if (p?.sale != null && p.sale > 0 && p.sale < p.price) {
      total += (p.price - p.sale) * item.quantity;
    }
  }
  return total;
};
