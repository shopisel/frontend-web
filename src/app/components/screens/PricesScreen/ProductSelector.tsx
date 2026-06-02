import { motion } from "motion/react";
import { Star, Loader } from "lucide-react";
import type { Product } from "../../../../api/useProducts";
import { ImageWithFallback } from "../../fallback/ImageWithFallback";
import { getProductImageSrc } from "../../../../lib/imageUtils";

interface ProductSelectorProps {
  products: Product[];
  selectedProduct: Product | null;
  favoriteProductIds: string[];
  isLoadingProducts: boolean;
  isLoadingMoreProducts: boolean;
  hasMoreProducts: boolean;
  searchQuery: string;
  selectedMainCat: { name: string } | null;
  selectedSubCat: { name: string } | null;
  onSelectProduct: (product: Product) => void;
  onLoadMore: () => void;
}

export function ProductSelector({
  products,
  selectedProduct,
  favoriteProductIds,
  isLoadingProducts,
  isLoadingMoreProducts,
  hasMoreProducts,
  searchQuery,
  selectedMainCat,
  selectedSubCat,
  onSelectProduct,
  onLoadMore,
}: ProductSelectorProps) {
  return (
    <div className="px-5 py-4">
      <p
        className="text-gray-500 mb-3"
        style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        SELECIONAR PRODUTO
      </p>

      {isLoadingProducts ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader className="w-4 h-4 animate-spin" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>A carregar produtos</span>
        </div>
      ) : products.length > 0 ? (
        <div className="rounded-2xl bg-white p-3" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
            {products.map((p) => {
              const imgSrc = getProductImageSrc(p);
              const isSelected = selectedProduct?.id === p.id;
              const isFavorite = favoriteProductIds.includes(p.id);

              return (
                <motion.button
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  aria-pressed={isSelected}
                  className="text-left rounded-2xl border-2 px-3 py-2 bg-white"
                  animate={{
                    borderColor: isSelected ? "var(--brand)" : "#F3F4F6",
                    backgroundColor: isSelected ? "var(--brand-light)" : "white",
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {imgSrc ? (
                        <ImageWithFallback src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{p.emoji || "📦"}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-gray-900"
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: "18px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.name}
                      </p>
                      {p.brand && (
                        <p className="text-gray-500 truncate" style={{ fontSize: 12 }}>
                          {p.brand}
                        </p>
                      )}
                    </div>
                    {isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="#F59E0B" />}
                  </div>
                </motion.button>
              );
            })}

            {(hasMoreProducts || isLoadingMoreProducts) && (
              <div className="col-span-full pt-1">
                <motion.button
                  onClick={onLoadMore}
                  whileTap={{ scale: 0.985 }}
                  disabled={isLoadingMoreProducts}
                  className="w-full rounded-2xl border-2 px-4 py-3 bg-white"
                  animate={{
                    borderColor: "#E5E7EB",
                    backgroundColor: isLoadingMoreProducts ? "#F9FAFB" : "white",
                  }}
                  transition={{ duration: 0.15 }}
                  style={{ fontSize: 13, fontWeight: 800 }}
                >
                  <span className="inline-flex items-center justify-center gap-2 text-gray-700">
                    {isLoadingMoreProducts ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin text-gray-400" />
                        A carregar...
                      </>
                    ) : (
                      <>Carregar mais</>
                    )}
                  </span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-400" style={{ fontSize: 13, fontWeight: 600 }}>
          {searchQuery.trim()
            ? "Nenhum produto encontrado"
            : selectedMainCat && !selectedSubCat
              ? "Seleciona uma subcategoria para ver produtos"
              : "Nenhum produto para mostrar"}
        </div>
      )}
    </div>
  );
}
