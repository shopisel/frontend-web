import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { HomeListItem } from "./types";

const LoadingBall = ({ size = 16 }: { size?: number }) => (
  <span
    className="inline-block rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"
    style={{ width: size, height: size }}
  />
);

interface ListPreviewProps {
  listName: string | null;
  items: HomeListItem[];
  isLoading: boolean;
  onViewAll: () => void;
  onToggleItem: (id: number) => void;
}

export function ListPreview({ listName, items, isLoading, onViewAll, onToggleItem }: ListPreviewProps) {
  return (
    <div className="px-5 mb-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h3 className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>
          {listName ?? "A minha lista"}
        </h3>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1"
          style={{ fontSize: 13, color: "var(--brand)", fontWeight: 600 }}
        >
          Ver tudo <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        {isLoading ? (
          <div className="px-4 py-8 flex items-center justify-center">
            <LoadingBall size={20} />
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => (
            <motion.div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: idx < items.length - 1 ? "1px solid #F3F4F6" : "none" }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg overflow-hidden"
                style={{ backgroundColor: item.imageSrc ? "transparent" : item.color }}
              >
                {item.imageSrc ? (
                  <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  item.emoji
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-gray-900"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: item.checked ? "line-through" : "none",
                    color: item.checked ? "#9CA3AF" : "#111827",
                  }}
                >
                  {item.name}
                </p>
                <p className="text-gray-400" style={{ fontSize: 12 }}>
                  {item.qty} · {item.store}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="flex flex-col items-end leading-tight">
                  <span style={{ fontSize: 14, fontWeight: 700, color: item.checked ? "#9CA3AF" : "var(--success)" }}>
                    €{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                  {typeof item.originalUnitPrice === "number" && item.originalUnitPrice > item.unitPrice && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400" style={{ fontSize: 11, textDecoration: "line-through" }}>
                        €{(item.originalUnitPrice * item.quantity).toFixed(2)}
                      </span>
                      {typeof item.discountPercent === "number" && (
                        <span className="text-green-600" style={{ fontSize: 10, fontWeight: 700 }}>
                          -{item.discountPercent}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onToggleItem(item.id)}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: item.checked ? "var(--success)" : "#D1D5DB",
                    backgroundColor: item.checked ? "var(--success)" : "transparent",
                  }}
                >
                  {item.checked && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500" style={{ fontSize: 14 }}>
            A sua lista está vazia.
          </div>
        )}
      </div>
    </div>
  );
}
