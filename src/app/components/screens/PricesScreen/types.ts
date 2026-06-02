export type StoreRow = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  sale?: number;
  quantityText?: string | null;
  unitPriceText?: string | null;
  dist?: string;
  distKm?: number;
  rating?: number;
  promo?: string | null;
};
