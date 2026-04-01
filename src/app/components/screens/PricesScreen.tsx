import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Search, ArrowUpDown, Tag, Navigation } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Organic Whole Milk 2L",
    emoji: "🥛",
    category: "Dairy",
    stores: [
      { name: "FreshMart", price: 2.99, dist: "0.3 mi", promo: "10% off", rating: 4.5 },
      { name: "NatureMart", price: 3.29, dist: "0.7 mi", promo: null, rating: 4.2 },
      { name: "CostPlus", price: 3.60, dist: "1.1 mi", promo: null, rating: 3.9 },
      { name: "BioShop", price: 3.89, dist: "1.8 mi", promo: "Member only", rating: 4.7 },
    ],
  },
  {
    id: 2,
    name: "Free-Range Eggs x12",
    emoji: "🥚",
    category: "Protein",
    stores: [
      { name: "NatureMart", price: 3.99, dist: "0.7 mi", promo: "20% off", rating: 4.4 },
      { name: "FreshMart", price: 4.49, dist: "0.3 mi", promo: null, rating: 4.5 },
      { name: "CostPlus", price: 4.79, dist: "1.1 mi", promo: null, rating: 3.9 },
    ],
  },
  {
    id: 3,
    name: "Sourdough Bread Loaf",
    emoji: "🍞",
    category: "Bakery",
    stores: [
      { name: "BakeryHub", price: 4.50, dist: "0.5 mi", promo: "Fresh today", rating: 4.8 },
      { name: "FreshMart", price: 4.99, dist: "0.3 mi", promo: null, rating: 4.5 },
      { name: "CostPlus", price: 3.80, dist: "1.1 mi", promo: null, rating: 3.9 },
    ],
  },
];

const categories = ["All", "Dairy", "Produce", "Protein", "Bakery", "Grains"];

export function PricesScreen() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "distance">("price");
  const [selectedCat, setSelectedCat] = useState("All");
  const [mapView, setMapView] = useState(false);

  const sortedStores = [...selectedProduct.stores].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : parseFloat(a.dist) - parseFloat(b.dist)
  );

  const savings = sortedStores[sortedStores.length - 1].price - sortedStores[0].price;

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white">
        <h1 className="text-gray-900 mb-1" style={{ fontSize: 24, fontWeight: 700 }}>Price Compare</h1>
        <p className="text-gray-400 mb-4" style={{ fontSize: 14 }}>Find the best deals nearby</p>

        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any product..."
            className="flex-1 bg-transparent outline-none text-gray-700"
            style={{ fontSize: 14 }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white pb-3 pt-1">
        <div className="flex gap-2 px-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-xl"
              animate={{
                backgroundColor: cat === selectedCat ? "#6366F1" : "#F3F4F6",
                color: cat === selectedCat ? "#FFFFFF" : "#6B7280",
              }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Product selector */}
        <div className="px-5 py-4">
          <p className="text-gray-500 mb-3" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            SELECT PRODUCT
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {products.map((p) => (
              <motion.button
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2"
                animate={{
                  borderColor: selectedProduct.id === p.id ? "#6366F1" : "#F3F4F6",
                  backgroundColor: selectedProduct.id === p.id ? "#EEF2FF" : "white",
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-lg">{p.emoji}</span>
                <span
                  style={{
                    fontSize: 12, fontWeight: 600,
                    color: selectedProduct.id === p.id ? "#6366F1" : "#6B7280",
                    maxWidth: 90,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product detail card */}
        <div className="px-5 mb-4">
          <motion.div
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-5"
            style={{ boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                {selectedProduct.emoji}
              </div>
              <div className="flex-1">
                <p className="text-indigo-200" style={{ fontSize: 12 }}>{selectedProduct.category}</p>
                <p className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>{selectedProduct.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-indigo-200" style={{ fontSize: 11 }}>Best price</p>
                <p className="text-white" style={{ fontSize: 26, fontWeight: 800 }}>
                  ${sortedStores[0].price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-indigo-200" style={{ fontSize: 11 }}>Max savings</p>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4 text-green-300" />
                  <p className="text-green-300" style={{ fontSize: 18, fontWeight: 700 }}>
                    ${savings.toFixed(2)} off
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sort + Map toggle */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-gray-700" style={{ fontSize: 14, fontWeight: 700 }}>Stores ({sortedStores.length})</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy(sortBy === "price" ? "distance" : "price")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>
                {sortBy === "price" ? "Price" : "Distance"}
              </span>
            </button>
            <button
              onClick={() => setMapView(!mapView)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: mapView ? "#6366F1" : "#F3F4F6" }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: mapView ? "white" : "#6B7280" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: mapView ? "white" : "#6B7280" }}>Map</span>
            </button>
          </div>
        </div>

        {/* Map view */}
        <AnimatePresence>
          {mapView && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 160, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-5 mb-4 rounded-2xl overflow-hidden"
            >
              <div
                className="w-full h-full relative"
                style={{
                  background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)",
                }}
              >
                {/* Fake map grid */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Store pins */}
                {sortedStores.map((store, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 22}%`,
                      top: `${25 + (i % 2) * 35}%`,
                    }}
                  >
                    <div
                      className="px-2 py-1 rounded-xl shadow-md flex items-center gap-1"
                      style={{ backgroundColor: i === 0 ? "#6366F1" : "white" }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "white" : "#111827" }}>
                        ${store.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-1 h-2 bg-gray-400 mx-auto" />
                  </div>
                ))}
                {/* User location */}
                <div className="absolute bottom-5 right-5">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-3 border-white shadow-md flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-white" fill="white" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Store list */}
        <div className="px-5 pb-6 flex flex-col gap-3">
          <AnimatePresence>
            {sortedStores.map((store, i) => (
              <motion.div
                key={`${selectedProduct.id}-${store.name}`}
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
                    {/* Rank badge */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: i === 0 ? "#6366F1" : "#F3F4F6",
                        color: i === 0 ? "white" : "#6B7280",
                        fontSize: 13, fontWeight: 700,
                      }}
                    >
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{store.name}</p>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400" style={{ fontSize: 12 }}>{store.dist}</span>
                        <span className="text-yellow-400" style={{ fontSize: 11 }}>★ {store.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: 20, fontWeight: 800, color: i === 0 ? "#10B981" : "#111827" }}>
                      ${store.price.toFixed(2)}
                    </p>
                    {i > 0 && (
                      <p className="text-red-400" style={{ fontSize: 11 }}>
                        +${(store.price - sortedStores[0].price).toFixed(2)} more
                      </p>
                    )}
                  </div>
                </div>

                {store.promo && (
                  <div
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: "#ECFDF5" }}
                  >
                    <Tag className="w-3 h-3 text-green-600" />
                    <span className="text-green-700" style={{ fontSize: 11, fontWeight: 600 }}>{store.promo}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
