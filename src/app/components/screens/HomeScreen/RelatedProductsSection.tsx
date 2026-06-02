import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { Product } from "../../../../api/useProducts";
import { getProductImageSrc } from "../../../../lib/imageUtils";

const LoadingBall = ({ size = 16 }: { size?: number }) => (
  <span
    className="inline-block rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"
    style={{ width: size, height: size }}
  />
);

interface RelatedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
  onViewAll: () => void;
}

export function RelatedProductsSection({ products, isLoading, onViewAll }: RelatedProductsSectionProps) {
  return (
    <div className="mb-4">
      <div className="px-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h3 className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Relacionados com os favoritos</h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1"
          style={{ fontSize: 13, color: "var(--brand)", fontWeight: 600 }}
        >
          Ver tudo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-3 px-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {isLoading && (
          <div className="w-full rounded-3xl bg-white px-4 py-6 flex items-center justify-center">
            <LoadingBall size={20} />
          </div>
        )}

        {!isLoading && products.map((product) => {
          const imgSrc = getProductImageSrc(product);
          return (
            <motion.div
              key={product.id}
              className="rounded-3xl p-4 flex-shrink-0 w-44 relative overflow-hidden"
              style={{ backgroundColor: "var(--brand-light)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/80 mb-2 overflow-hidden flex items-center justify-center">
                {imgSrc ? (
                  <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-3xl">{product.emoji || "📦"}</span>
                )}
              </div>
              <p
                className="text-gray-800"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 38,
                }}
              >
                {product.name}
              </p>
            </motion.div>
          );
        })}

        {!isLoading && !products.length && (
          <div className="w-full rounded-3xl bg-white px-4 py-6 text-center text-gray-500" style={{ fontSize: 14 }}>
            Sem produtos relacionados para mostrar.
          </div>
        )}
      </div>
    </div>
  );
}
