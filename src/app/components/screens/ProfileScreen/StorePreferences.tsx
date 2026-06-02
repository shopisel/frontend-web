import { motion } from "motion/react";
import { Store } from "lucide-react";
import type { StoreResponse } from "../../../../api/useStores";

type ActiveStore = StoreResponse & { active: boolean };

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ backgroundColor: value ? "var(--brand)" : "#D1D5DB" }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        animate={{ left: value ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </button>
  );
}

interface StorePreferencesProps {
  stores: ActiveStore[];
  onToggle: (idx: number) => void;
}

export function StorePreferences({ stores, onToggle }: StorePreferencesProps) {
  return (
    <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Store className="w-4 h-4 text-indigo-600" />
        <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Lojas Preferidas</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {stores.length === 0 ? (
          <p className="text-gray-400" style={{ fontSize: 13 }}>Nenhuma loja online disponível.</p>
        ) : (
          stores.map((store, i) => (
            <div key={store.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: store.active ? "var(--brand-light)" : "#F9FAFB" }}
                >
                  <Store className="w-4 h-4" style={{ color: store.active ? "var(--brand)" : "#D1D5DB" }} />
                </div>
                <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{store.name}</p>
              </div>
              <Toggle value={store.active} onChange={() => onToggle(i)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
