export interface FavoriteDeal {
  id: string;
  name: string;
  discountPercent: number;
  price: number;
  original: number;
  storeId: string;
  store: string;
  color: string;
  emoji: string;
  imageSrc?: string;
}

export interface HomeListItem {
  id: number;
  productId: string;
  storeId: string;
  quantity: number;
  checked: boolean;
  name: string;
  emoji: string;
  imageSrc?: string;
  store: string;
  color: string;
  qty: string;
  unitPrice: number;
  originalUnitPrice?: number;
  discountPercent?: number;
}
