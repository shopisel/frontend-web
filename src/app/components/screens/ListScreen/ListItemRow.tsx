import { motion, AnimatePresence } from "motion/react";
import { Trash2, Check } from "lucide-react";
import type { ListItemResponse } from "../../../../api/useLists";

export interface EnrichedItem extends ListItemResponse {
  name: string;
  brand?: string | null;
  emoji: string;
  storeName: string;
  imageSrc?: string;
  unitPrice: number;
  originalUnitPrice?: number;
  discountPercent?: number;
}

interface ListItemRowProps {
  item: EnrichedItem;
  animated: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onChangeQuantity: (id: number, delta: number) => void;
}

export function ListItemRow({ item, animated, onToggle, onDelete, onChangeQuantity }: ListItemRowProps) {
  const CheckButton = animated ? (
    <motion.button
      onClick={() => onToggle(item.id)}
      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
      animate={{
        borderColor: item.checked ? "var(--success)" : "#D1D5DB",
        backgroundColor: item.checked ? "var(--success)" : "white",
      }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {item.checked && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  ) : (
    <button
      onClick={() => onToggle(item.id)}
      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
      style={{
        borderColor: item.checked ? "var(--success)" : "#D1D5DB",
        backgroundColor: item.checked ? "var(--success)" : "white",
      }}
    >
      {item.checked && <Check className="w-3 h-3 text-white" />}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 relative">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ) : (
          <span className="text-xl">{item.emoji || "📦"}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: item.checked ? "#9CA3AF" : "#111827",
            textDecoration: item.checked ? "line-through" : "none",
          }}
        >
          {item.name}
        </p>
        {item.brand && (
          <p className="text-gray-400 truncate" style={{ fontSize: 12 }}>{item.brand}</p>
        )}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-1 py-0.5">
            <button
              onClick={() => onChangeQuantity(item.id, -1)}
              className="w-5 h-5 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-40"
              disabled={item.quantity <= 1}
              aria-label="Diminuir quantidade"
              type="button"
            >
              -
            </button>
            <span className="text-gray-500 min-w-[22px] text-center" style={{ fontSize: 12 }}>
              {item.quantity}
            </span>
            <button
              onClick={() => onChangeQuantity(item.id, 1)}
              className="w-5 h-5 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200"
              aria-label="Aumentar quantidade"
              type="button"
            >
              +
            </button>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-gray-400 truncate" style={{ fontSize: 12 }}>{item.storeName}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <div className="flex flex-col items-end leading-tight">
          <span style={{ fontSize: 14, fontWeight: 700, color: item.checked ? "#9CA3AF" : "var(--success)" }}>
            €{(item.unitPrice * item.quantity).toFixed(2)}
          </span>
          {typeof item.originalUnitPrice === "number" && item.originalUnitPrice > item.unitPrice && (
            <>
              <span className="text-gray-400" style={{ fontSize: 11, textDecoration: "line-through" }}>
                €{(item.originalUnitPrice * item.quantity).toFixed(2)}
              </span>
              {typeof item.discountPercent === "number" && (
                <span className="text-green-600" style={{ fontSize: 11, fontWeight: 700 }}>
                  -{item.discountPercent}%
                </span>
              )}
            </>
          )}
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
        {CheckButton}
      </div>
    </div>
  );
}
