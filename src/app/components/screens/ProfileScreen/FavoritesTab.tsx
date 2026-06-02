import { Star, Loader, RotateCcw } from "lucide-react";
import type { Product } from "../../../../api/useProducts";
import { ImageWithFallback } from "../../fallback/ImageWithFallback";
import { getProductImageSrc } from "../../../../lib/imageUtils";

interface FavoritesTabProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pendingId: string | null;
  onReload: () => void;
  onToggle: (product: Product) => void;
}

export function FavoritesTab({ products, isLoading, error, pendingId, onReload, onToggle }: FavoritesTabProps) {
  return (
    <div className="bg-white rounded-3xl p-4 mb-6" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" fill="#F59E0B" />
          <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Produtos favoritos</p>
        </div>
        <button
          type="button"
          onClick={onReload}
          className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 flex items-center gap-1.5"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400 py-4">
          <Loader className="w-4 h-4 animate-spin" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>A carregar favoritos...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 py-2" style={{ fontSize: 12, fontWeight: 600 }}>{error}</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400 py-4" style={{ fontSize: 13, fontWeight: 600 }}>
          Ainda não tens produtos favoritos.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product) => {
            const imageSrc = getProductImageSrc(product);
            return (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                <div className="w-11 h-11 rounded-xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                  {imageSrc ? (
                    <ImageWithFallback src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{product.emoji || "📦"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate" style={{ fontSize: 13, fontWeight: 700 }}>{product.name}</p>
                  {product.brand && (
                    <p className="text-gray-500 truncate" style={{ fontSize: 12 }}>{product.brand}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onToggle(product)}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center disabled:opacity-60"
                  disabled={pendingId === product.id}
                  aria-label="Remover dos favoritos"
                >
                  {pendingId === product.id ? (
                    <Loader className="w-4 h-4 text-amber-500 animate-spin" />
                  ) : (
                    <Star className="w-4 h-4 text-amber-500" fill="#F59E0B" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
