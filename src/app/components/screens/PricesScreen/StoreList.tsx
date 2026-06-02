import { motion, AnimatePresence } from "motion/react";
import { MapPin, ArrowUpDown, Tag, Navigation, Loader } from "lucide-react";
import type { Product } from "../../../../api/useProducts";
import type { StoreRow } from "./types";

interface StoreListProps {
  sortedStores: StoreRow[];
  selectedProduct: Product | null;
  isLoadingStores: boolean;
  sortBy: "price" | "distance";
  mapView: boolean;
  onChangeSortBy: (value: "price" | "distance") => void;
  onToggleMapView: () => void;
}

function MapView({ sortedStores }: { sortedStores: StoreRow[] }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 160, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mx-5 mb-4 rounded-2xl overflow-hidden"
    >
      <div
        className="w-full h-full relative"
        style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {sortedStores.map((store, i) => (
          <div
            key={store.id}
            className="absolute"
            style={{ left: `${20 + i * 22}%`, top: `${25 + (i % 2) * 35}%` }}
          >
            <div
              className="px-2 py-1 rounded-xl shadow-md flex items-center gap-1"
              style={{ backgroundColor: i === 0 ? "var(--brand)" : "white" }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "white" : "#111827" }}>
                €{store.price.toFixed(2)}
              </span>
              {typeof store.sale === "number" && store.sale > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    textDecoration: "line-through",
                    color: i === 0 ? "var(--brand-muted)" : "#6B7280",
                  }}
                >
                  €{store.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="w-1 h-2 bg-gray-400 mx-auto" />
          </div>
        ))}
        <div className="absolute bottom-5 right-5">
          <div className="w-8 h-8 rounded-full bg-blue-500 border-3 border-white shadow-md flex items-center justify-center">
            <Navigation className="w-4 h-4 text-white" fill="white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function StoreList({
  sortedStores,
  selectedProduct,
  isLoadingStores,
  sortBy,
  mapView,
  onChangeSortBy,
  onToggleMapView,
}: StoreListProps) {
  return (
    <>
      <div className="px-5 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-gray-700" style={{ fontSize: 14, fontWeight: 700 }}>
            Lojas ({sortedStores.length})
          </p>
          {isLoadingStores && <Loader className="w-4 h-4 text-gray-400 animate-spin" />}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onChangeSortBy(sortBy === "price" ? "distance" : "price")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>
              {sortBy === "price" ? "Preço" : "Distância"}
            </span>
          </button>
          <button
            onClick={onToggleMapView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: mapView ? "var(--brand)" : "#F3F4F6" }}
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: mapView ? "white" : "#6B7280" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: mapView ? "white" : "#6B7280" }}>Mapa</span>
          </button>
        </div>
      </div>

      <AnimatePresence>{mapView && <MapView sortedStores={sortedStores} />}</AnimatePresence>

      <div className="px-5 pb-6 flex flex-col gap-3">
        {sortedStores.length === 0 && (
          <div className="text-gray-400" style={{ fontSize: 13, fontWeight: 600 }}>
            {selectedProduct
              ? "Nenhum preço encontrado para este produto"
              : "Seleciona um produto para ver preços"}
          </div>
        )}
        <AnimatePresence>
          {sortedStores.map((store, i) => (
            <motion.div
              key={`${selectedProduct?.id ?? "none"}-${store.id}`}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: i === 0 ? "var(--brand)" : "#F3F4F6",
                      color: i === 0 ? "white" : "#6B7280",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{store.name}</p>
                    {(store.quantityText || store.unitPriceText) && (
                      <p className="text-gray-400 truncate" style={{ fontSize: 12 }}>
                        {[store.quantityText, store.unitPriceText].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {(store.dist || typeof store.rating === "number") && (
                      <div className="flex items-center gap-1.5">
                        {store.dist && (
                          <>
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400" style={{ fontSize: 12 }}>{store.dist}</span>
                          </>
                        )}
                        {typeof store.rating === "number" && (
                          <span className="text-yellow-400" style={{ fontSize: 11 }}>★ {store.rating}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? "var(--success)" : "#111827" }}>
                    €{store.price.toFixed(2)}
                  </p>
                  {typeof store.sale === "number" && store.sale > 0 && (
                    <p className="text-gray-400" style={{ fontSize: 12, textDecoration: "line-through" }}>
                      €{store.originalPrice.toFixed(2)}
                    </p>
                  )}
                  {i > 0 && sortedStores[0] && (
                    <p className="text-red-400" style={{ fontSize: 11 }}>
                      +€{(store.price - sortedStores[0].price).toFixed(2)} a mais
                    </p>
                  )}
                </div>
              </div>

              {store.promo && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--success-light)" }}>
                  <Tag className="w-3 h-3 text-green-600" />
                  <span className="text-green-700" style={{ fontSize: 11, fontWeight: 600 }}>{store.promo}</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
