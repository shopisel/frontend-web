import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Image, X, ChevronRight, Check } from "lucide-react";

interface ScanScreenProps {
  onNavigate: (tab: string) => void;
}

const scannedProduct = {
  name: "Organic Oat Milk",
  brand: "Oatly",
  barcode: "7340011364476",
  bestPrice: "$3.29",
  store: "NatureMart",
  emoji: "🥛",
  stores: [
    { name: "NatureMart", price: "$3.29", dist: "0.3 mi", inStock: true },
    { name: "FreshMart", price: "$3.79", dist: "0.6 mi", inStock: true },
    { name: "CostPlus", price: "$4.10", dist: "1.2 mi", inStock: false },
  ],
};

export function ScanScreen({ onNavigate }: ScanScreenProps) {
  const [torchOn, setTorchOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [addedToList, setAddedToList] = useState(false);

  useEffect(() => {
    if (scanning) {
      const t = setTimeout(() => {
        setScanning(false);
        setScanned(true);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [scanning]);

  const handleAddToList = () => {
    setAddedToList(true);
    setTimeout(() => {
      onNavigate("lists");
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden relative">
      {/* Camera simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />

      {/* Grid overlay for camera effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>Scan Product</h2>
          <p className="text-white/50" style={{ fontSize: 13 }}>Point camera at barcode or QR</p>
        </div>
        <button
          onClick={() => setTorchOn(!torchOn)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: torchOn ? "#FCD34D" : "rgba(255,255,255,0.15)" }}
        >
          <Zap className="w-5 h-5" style={{ color: torchOn ? "#92400E" : "white" }} />
        </button>
      </div>

      {/* Scanner frame */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative w-64 h-64">
          {/* Corner brackets */}
          {[
            "top-0 left-0 border-t-2 border-l-2",
            "top-0 right-0 border-t-2 border-r-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-8 h-8 rounded-sm ${cls}`}
              style={{ borderColor: "#6366F1" }}
            />
          ))}

          {/* Scanning line */}
          {scanning && (
            <motion.div
              className="absolute left-2 right-2 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, #6366F1, transparent)" }}
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Glow effect when scanning */}
          {scanning && (
            <motion.div
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: "#6366F1" }}
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Idle state */}
          {!scanning && !scanned && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-white/50" style={{ fontSize: 12 }}>Tap scan to start</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="relative z-10 px-5 pb-28 flex flex-col gap-3">
        {/* Scan button */}
        {!scanned && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setScanning(true)}
            disabled={scanning}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{ backgroundColor: scanning ? "#4F46E5" : "#6366F1" }}
          >
            {scanning ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-white" style={{ fontSize: 15, fontWeight: 600 }}>Scanning...</span>
              </>
            ) : (
              <>
                <span className="text-white text-xl">📷</span>
                <span className="text-white" style={{ fontSize: 15, fontWeight: 600 }}>Scan Barcode</span>
              </>
            )}
          </motion.button>
        )}

        {/* Gallery button */}
        {!scanned && (
          <button
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <Image className="w-4 h-4 text-white/70" />
            <span className="text-white/70" style={{ fontSize: 14, fontWeight: 500 }}>Upload from Gallery</span>
          </button>
        )}
      </div>

      {/* Scanned result bottom sheet */}
      <AnimatePresence>
        {scanned && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-20"
            style={{ boxShadow: "0 -10px 40px rgba(0,0,0,0.3)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pb-8 pt-3">
              {/* Product header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
                  {scannedProduct.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-gray-500" style={{ fontSize: 12 }}>{scannedProduct.brand}</p>
                  <h3 className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>{scannedProduct.name}</h3>
                  <p className="text-gray-400" style={{ fontSize: 11 }}>Barcode: {scannedProduct.barcode}</p>
                </div>
                <button
                  onClick={() => { setScanned(false); setAddedToList(false); }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Best price badge */}
              <div className="bg-green-50 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-green-600" style={{ fontSize: 12, fontWeight: 600 }}>Best Price Nearby</p>
                  <p className="text-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>{scannedProduct.bestPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400" style={{ fontSize: 12 }}>at</p>
                  <p className="text-gray-800" style={{ fontSize: 14, fontWeight: 700 }}>{scannedProduct.store}</p>
                </div>
              </div>

              {/* Store list */}
              <div className="flex flex-col gap-2 mb-5">
                {scannedProduct.stores.map((store, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{store.name}</p>
                      <p className="text-gray-400" style={{ fontSize: 12 }}>{store.dist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!store.inStock && (
                        <span className="text-red-400" style={{ fontSize: 11 }}>Out of stock</span>
                      )}
                      <span style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? "#10B981" : "#111827" }}>
                        {store.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToList}
                  className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: addedToList ? "#10B981" : "#6366F1" }}
                >
                  {addedToList ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span className="text-white" style={{ fontSize: 15, fontWeight: 600 }}>Added!</span>
                    </>
                  ) : (
                    <span className="text-white" style={{ fontSize: 15, fontWeight: 600 }}>Add to List</span>
                  )}
                </motion.button>
                <button
                  onClick={() => onNavigate("prices")}
                  className="flex-1 py-4 rounded-2xl border-2 border-indigo-100 flex items-center justify-center gap-1"
                >
                  <span className="text-indigo-600" style={{ fontSize: 14, fontWeight: 600 }}>Compare</span>
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
