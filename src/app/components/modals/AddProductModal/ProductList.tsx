import { motion } from "motion/react";
import { ChevronRight, Loader } from "lucide-react";
import type { Product } from "../../../../api/useProducts";
import { ImageWithFallback } from "../../fallback/ImageWithFallback";
import { getProductImageSrc } from "../../../../lib/imageUtils";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  emptyMessage?: string;
  onSelect: (product: Product) => void;
  onLoadMore: () => void;
}

export function ProductList({
  products,
  isLoading,
  isLoadingMore,
  hasMore,
  emptyMessage = "Nenhum produto encontrado.",
  onSelect,
  onLoadMore,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!products.length) {
    return <p className="text-center text-gray-400 py-4" style={{ fontSize: 13 }}>{emptyMessage}</p>;
  }

  return (
    <div className="space-y-2">
      {products.map(product => {
        const imgSrc = getProductImageSrc(product);
        return (
          <motion.button
            key={product.id}
            onClick={() => onSelect(product)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm overflow-hidden">
              {imgSrc ? (
                <ImageWithFallback src={imgSrc} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" fetchPriority="low" />
              ) : (
                product.emoji || "📦"
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>{product.name}</p>
              {product.brand && <p className="text-gray-500 truncate" style={{ fontSize: 12 }}>{product.brand}</p>}
              <p className="text-gray-500" style={{ fontSize: 12 }}>Clica para escolher loja</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </motion.button>
        );
      })}

      {(hasMore || isLoadingMore) && (
        <motion.button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="w-full rounded-2xl border-2 px-4 py-3 bg-white"
          animate={{ borderColor: "#E5E7EB", backgroundColor: isLoadingMore ? "#F9FAFB" : "white" }}
          style={{ fontSize: 13, fontWeight: 800 }}
          whileTap={{ scale: 0.985 }}
        >
          <span className="inline-flex items-center justify-center gap-2 text-gray-700">
            {isLoadingMore ? <><Loader className="w-4 h-4 animate-spin text-gray-400" />A carregar...</> : <>Carregar mais</>}
          </span>
        </motion.button>
      )}
    </div>
  );
}
