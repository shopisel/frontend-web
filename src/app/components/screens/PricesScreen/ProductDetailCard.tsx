import { motion } from "motion/react";
import { Star, Tag, Loader } from "lucide-react";
import type { Product, Category } from "../../../../api/useProducts";
import type { StoreRow } from "./types";
import { ImageWithFallback } from "../../fallback/ImageWithFallback";
import { getProductImageSrc } from "../../../../lib/imageUtils";

interface ProductDetailCardProps {
  selectedProduct: Product | null;
  selectedMainCat: Category | null;
  selectedSubCat: Category | null;
  sortedStores: StoreRow[];
  selectedUnitPriceText: string;
  maxPromoSaving: number;
  relatedProducts: Product[];
  isLoadingRelatedProducts: boolean;
  selectedProductFavorite: boolean;
  favoritePendingId: string | null;
  onToggleFavorite: (product: Product) => void;
  onSelectRelatedProduct: (product: Product) => void;
}

export function ProductDetailCard({
  selectedProduct,
  selectedMainCat,
  selectedSubCat,
  sortedStores,
  selectedUnitPriceText,
  maxPromoSaving,
  relatedProducts,
  isLoadingRelatedProducts,
  selectedProductFavorite,
  favoritePendingId,
  onToggleFavorite,
  onSelectRelatedProduct,
}: ProductDetailCardProps) {
  if (!selectedProduct) {
    return (
      <div className="px-5 mb-4">
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p className="text-gray-700" style={{ fontSize: 14, fontWeight: 700 }}>Nenhum produto selecionado</p>
          <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>Escolhe um produto para comparar preços.</p>
        </div>
      </div>
    );
  }

  const imgSrc = getProductImageSrc(selectedProduct);

  return (
    <div className="px-5 mb-4">
      <motion.div
        key={selectedProduct.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-5"
        style={{ boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 overflow-hidden flex items-center justify-center">
            {imgSrc ? (
              <ImageWithFallback src={imgSrc} alt={selectedProduct.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl">{selectedProduct.emoji || "📦"}</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-indigo-200" style={{ fontSize: 12 }}>
              {selectedSubCat?.name || selectedMainCat?.name || "All products"}
            </p>
            <p className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>{selectedProduct.name}</p>
            {(selectedProduct.brand || selectedUnitPriceText) && (
              <p className="text-indigo-100 truncate" style={{ fontSize: 12, fontWeight: 600 }}>
                {[selectedProduct.brand, selectedUnitPriceText].filter(Boolean).join(" | ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(selectedProduct)}
            disabled={favoritePendingId === selectedProduct.id}
            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center disabled:opacity-50"
            aria-label={selectedProductFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {favoritePendingId === selectedProduct.id ? (
              <Loader className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Star
                className="w-5 h-5"
                style={{ color: selectedProductFavorite ? "#FCD34D" : "var(--brand-muted)" }}
                fill={selectedProductFavorite ? "#FCD34D" : "transparent"}
              />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-indigo-200" style={{ fontSize: 11 }}>Melhor preço</p>
            <p className="text-white" style={{ fontSize: 26, fontWeight: 800 }}>
              {sortedStores[0] ? `€${sortedStores[0].price.toFixed(2)}` : "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-indigo-200" style={{ fontSize: 11 }}>Poupança máxima</p>
            <div className="flex items-center gap-1 justify-end">
              <Tag className="w-4 h-4 text-green-300" />
              <p className="text-green-300" style={{ fontSize: 18, fontWeight: 700 }}>
                {maxPromoSaving > 0 ? `€${maxPromoSaving.toFixed(2)} de desconto` : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p
            className="mb-2"
            style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Produtos Relacionados
          </p>
          {isLoadingRelatedProducts ? (
            <div className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" style={{ color: "var(--brand-muted)" }} />
              <span style={{ fontSize: 12, color: "var(--brand-muted)" }}>A carregar...</span>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {relatedProducts.map((rp) => {
                const rpImgSrc = getProductImageSrc(rp);
                return (
                  <button
                    key={rp.id}
                    type="button"
                    onClick={() => onSelectRelatedProduct(rp)}
                    className="flex-shrink-0 rounded-xl p-2.5 text-left"
                    style={{ width: 108, backgroundColor: "rgba(255,255,255,0.12)" }}
                  >
                    <div
                      className="h-16 rounded-lg overflow-hidden flex items-center justify-center mb-2"
                      style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                    >
                      {rpImgSrc ? (
                        <ImageWithFallback src={rpImgSrc} alt={rp.name} className="w-full h-full object-cover" />
                      ) : (
                        <span style={{ fontSize: 20 }}>{rp.emoji || "📦"}</span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "white",
                        lineHeight: "16px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {rp.name}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "var(--brand-muted)" }}>Sem produtos relacionados</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
