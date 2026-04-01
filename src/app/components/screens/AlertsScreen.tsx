import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingDown, Bell, ChevronDown, X, Filter, Store } from "lucide-react";

const alertsData = [
  {
    id: 1,
    product: "Salmon Fillet",
    emoji: "🐟",
    dropPct: 22,
    from: 12.99,
    to: 10.10,
    store: "FreshMart",
    category: "Protein",
    time: "2 min ago",
    expanded: false,
    stores: [
      { name: "FreshMart", price: 10.10, dist: "0.3 mi" },
      { name: "NatureMart", price: 11.49, dist: "0.7 mi" },
      { name: "CostPlus", price: 12.20, dist: "1.1 mi" },
    ],
  },
  {
    id: 2,
    product: "Almond Milk 1L",
    emoji: "🥛",
    dropPct: 15,
    from: 3.49,
    to: 2.99,
    store: "NatureMart",
    category: "Dairy",
    time: "18 min ago",
    expanded: false,
    stores: [
      { name: "NatureMart", price: 2.99, dist: "0.7 mi" },
      { name: "FreshMart", price: 3.20, dist: "0.3 mi" },
    ],
  },
  {
    id: 3,
    product: "Avocado x4",
    emoji: "🥑",
    dropPct: 30,
    from: 4.99,
    to: 3.49,
    store: "FreshMart",
    category: "Produce",
    time: "1 hr ago",
    expanded: false,
    stores: [
      { name: "FreshMart", price: 3.49, dist: "0.3 mi" },
      { name: "BioShop", price: 4.10, dist: "1.8 mi" },
    ],
  },
  {
    id: 4,
    product: "Greek Yogurt",
    emoji: "🥣",
    dropPct: 25,
    from: 2.49,
    to: 1.89,
    store: "CostPlus",
    category: "Dairy",
    time: "3 hrs ago",
    expanded: false,
    stores: [
      { name: "CostPlus", price: 1.89, dist: "1.1 mi" },
      { name: "FreshMart", price: 2.20, dist: "0.3 mi" },
    ],
  },
  {
    id: 5,
    product: "Sourdough Bread",
    emoji: "🍞",
    dropPct: 10,
    from: 4.99,
    to: 4.49,
    store: "BakeryHub",
    category: "Bakery",
    time: "5 hrs ago",
    expanded: false,
    stores: [
      { name: "BakeryHub", price: 4.49, dist: "0.5 mi" },
      { name: "CostPlus", price: 4.79, dist: "1.1 mi" },
    ],
  },
];

const storeFilters = ["All Stores", "FreshMart", "NatureMart", "CostPlus"];
const savingsFilters = ["All", "10%+", "20%+", "30%+"];

export function AlertsScreen() {
  const [alerts, setAlerts] = useState(alertsData.map(a => ({ ...a, expanded: false })));
  const [storeFilter, setStoreFilter] = useState("All Stores");
  const [savingsFilter, setSavingsFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const toggleExpand = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, expanded: !a.expanded } : a));
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const minDrop = savingsFilter === "All" ? 0 : parseInt(savingsFilter);
  const filteredAlerts = alerts.filter(a => {
    const storeMatch = storeFilter === "All Stores" || a.store === storeFilter;
    const savingsMatch = a.dropPct >= minDrop;
    return storeMatch && savingsMatch;
  });

  const totalSavings = filteredAlerts.reduce((s, a) => s + (a.from - a.to), 0);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-gray-900" style={{ fontSize: 24, fontWeight: 700 }}>Price Alerts</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
        <p className="text-gray-400" style={{ fontSize: 14 }}>
          {filteredAlerts.length} alerts · Save up to ${totalSavings.toFixed(2)}
        </p>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-t border-gray-50 overflow-hidden"
          >
            <div className="px-5 py-3">
              <p className="text-gray-500 mb-2" style={{ fontSize: 12, fontWeight: 600 }}>STORE</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "none" }}>
                {storeFilters.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStoreFilter(s)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      backgroundColor: storeFilter === s ? "#6366F1" : "#F3F4F6",
                      fontSize: 12, fontWeight: 600,
                      color: storeFilter === s ? "white" : "#6B7280",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 mb-2" style={{ fontSize: 12, fontWeight: 600 }}>MIN SAVINGS</p>
              <div className="flex gap-2">
                {savingsFilters.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSavingsFilter(s)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl transition-all"
                    style={{
                      backgroundColor: savingsFilter === s ? "#10B981" : "#F3F4F6",
                      fontSize: 12, fontWeight: 600,
                      color: savingsFilter === s ? "white" : "#6B7280",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
          <TrendingDown className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 700 }}>
            Potential savings today
          </p>
          <p className="text-green-600" style={{ fontSize: 11 }}>
            {filteredAlerts.length} products with price drops
          </p>
        </div>
        <p className="ml-auto text-green-600" style={{ fontSize: 18, fontWeight: 800 }}>
          ${totalSavings.toFixed(2)}
        </p>
      </div>

      {/* Alert cards */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Bell className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400" style={{ fontSize: 15, fontWeight: 600 }}>No alerts found</p>
              <p className="text-gray-300" style={{ fontSize: 13 }}>Try adjusting your filters</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                className="bg-white rounded-2xl mb-3 overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                {/* Main row */}
                <div
                  className="flex items-center gap-3 px-4 py-4 cursor-pointer"
                  onClick={() => toggleExpand(alert.id)}
                >
                  {/* Emoji */}
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {alert.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{alert.product}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Store className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400" style={{ fontSize: 12 }}>{alert.store}</span>
                      <span className="text-gray-300" style={{ fontSize: 12 }}>·</span>
                      <span className="text-gray-400" style={{ fontSize: 12 }}>{alert.time}</span>
                    </div>
                  </div>

                  {/* Price drop */}
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                      style={{ backgroundColor: "#ECFDF5" }}
                    >
                      <TrendingDown className="w-3 h-3 text-green-600" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>
                        ↓ {alert.dropPct}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>
                        ${alert.to.toFixed(2)}
                      </span>
                      <span className="line-through text-gray-400" style={{ fontSize: 12 }}>
                        ${alert.from.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <motion.div animate={{ rotate: alert.expanded ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                  </motion.div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {alert.expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                        <p className="text-gray-500 mb-2" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                          Price Comparison
                        </p>
                        {alert.stores.map((store, i) => (
                          <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-2">
                              {i === 0 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              )}
                              <span className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>{store.name}</span>
                              <span className="text-gray-400" style={{ fontSize: 11 }}>{store.dist}</span>
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#10B981" : "#111827" }}>
                              ${store.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-3">
                          <button
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 flex items-center justify-center"
                          >
                            <span className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>Add to List</span>
                          </button>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
