import { motion } from "motion/react";
import { ChevronRight, MapPin, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FavoriteDeal } from "./types";
import type { ListResponse } from "../../../../api/useLists";

const LoadingBall = ({ size = 16 }: { size?: number }) => (
  <span
    className="inline-block rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"
    style={{ width: size, height: size }}
  />
);

interface FavoriteDealsSectionProps {
  deals: FavoriteDeal[];
  isLoading: boolean;
  latestList: ListResponse | null;
  addPendingProductId: string | null;
  onViewAll: () => void;
  onAddToList: (deal: FavoriteDeal) => void;
}

export function FavoriteDealsSection({
  deals,
  isLoading,
  latestList,
  addPendingProductId,
  onViewAll,
  onAddToList,
}: FavoriteDealsSectionProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-4">
      <div className="px-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h3 className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Favoritos em desconto</h3>
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

        {deals.map((deal) => (
          <motion.div
            key={deal.id}
            className="rounded-3xl p-4 flex-shrink-0 w-40 sm:w-44 relative overflow-hidden cursor-pointer"
            style={{ backgroundColor: deal.color, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(`/prices/${deal.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(`/prices/${deal.id}`); }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/80 mb-2 overflow-hidden flex items-center justify-center">
              {deal.imageSrc ? (
                <img src={deal.imageSrc} alt={deal.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <span className="text-3xl">{deal.emoji}</span>
              )}
            </div>

            <p className="text-gray-800" style={{ fontSize: 13, fontWeight: 700 }}>{deal.name}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--success)" }}>€{deal.price.toFixed(2)}</span>
              <span className="line-through" style={{ fontSize: 11, color: "#9CA3AF" }}>€{deal.original.toFixed(2)}</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onAddToList(deal); }}
              disabled={!latestList || addPendingProductId === deal.id}
              className="mt-2 w-full rounded-xl py-1.5 flex items-center justify-center gap-1.5 transition-all"
              style={{
                backgroundColor: !latestList ? "#E5E7EB" : "var(--brand)",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                opacity: addPendingProductId === deal.id ? 0.8 : 1,
              }}
            >
              {addPendingProductId === deal.id ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />A adicionar...</>
              ) : (
                <><Plus className="w-3.5 h-3.5" />Adicionar a lista</>
              )}
            </button>

            <div className="flex items-center gap-1 mt-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400" style={{ fontSize: 11 }}>{deal.store}</span>
            </div>

            <div
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--success)", fontSize: 10, fontWeight: 700, color: "white" }}
            >
              -{deal.discountPercent}%
            </div>
          </motion.div>
        ))}

        {!isLoading && !deals.length && (
          <div className="w-full rounded-3xl bg-white px-4 py-6 text-center text-gray-500" style={{ fontSize: 14 }}>
            Sem favoritos com desconto de momento.
          </div>
        )}
      </div>
    </div>
  );
}
