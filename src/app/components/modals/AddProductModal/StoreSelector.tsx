import { motion } from "motion/react";
import { Search, Loader, Store } from "lucide-react";
import type { Product } from "../../../../api/useProducts";
import type { StoreResponse } from "../../../../api/useStores";
import type { PriceResponse } from "../../../../api/usePrices";
import { ImageWithFallback } from "../../fallback/ImageWithFallback";
import { getProductImageSrc } from "../../../../lib/imageUtils";

interface StoreSelectorProps {
  product: Product;
  stores: StoreResponse[];
  prices: PriceResponse[];
  storeSearch: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onSelect: (store: StoreResponse) => void;
}

export function StoreSelector({
  product,
  stores,
  prices,
  storeSearch,
  isLoading,
  onSearchChange,
  onSelect,
}: StoreSelectorProps) {
  const imgSrc = getProductImageSrc(product);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-sm overflow-hidden">
          {imgSrc ? (
            <ImageWithFallback src={imgSrc} alt={product.name} className="w-16 h-16 object-cover rounded-2xl" loading="lazy" decoding="async" fetchPriority="low" />
          ) : (
            product.emoji || "📦"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-bold text-lg truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm">Onde vais comprar?</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-4">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          value={storeSearch}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Pesquisar loja..."
          autoFocus
          className="flex-1 bg-transparent outline-none text-gray-900"
          style={{ fontSize: 13 }}
        />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : stores.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma loja disponível no sistema.</p>
        ) : (
          stores.map(store => {
            const priceMatch = prices.find(p => p.storeId === store.id);
            const hasSale = typeof priceMatch?.sale === "number" && priceMatch.sale > 0;
            const displayPrice = hasSale ? (priceMatch?.sale ?? 0) : (priceMatch?.price ?? 0);
            return (
              <motion.button
                key={store.id}
                onClick={() => onSelect(store)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Store className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{store.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-gray-900">
                    {priceMatch ? `${displayPrice.toFixed(2)} €` : "Indefinido"}
                  </span>
                  {hasSale && priceMatch && (
                    <span className="block text-gray-400" style={{ fontSize: 12, textDecoration: "line-through" }}>
                      {priceMatch.price.toFixed(2)} €
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
