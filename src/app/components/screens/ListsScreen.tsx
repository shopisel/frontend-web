import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, ChevronRight, Check, Search, BarChart2, ShoppingCart } from "lucide-react";

const initialItems = [
  { id: 1, name: "Organic Apples", qty: 2, unit: "kg", price: 2.49, store: "FreshMart", checked: false, emoji: "🍎", category: "Produce" },
  { id: 2, name: "Whole Milk", qty: 2, unit: "L", price: 3.20, store: "CostPlus", checked: true, emoji: "🥛", category: "Dairy" },
  { id: 3, name: "Sourdough Bread", qty: 1, unit: "loaf", price: 4.50, store: "BakeryHub", checked: false, emoji: "🍞", category: "Bakery" },
  { id: 4, name: "Free-Range Eggs", qty: 12, unit: "pcs", price: 3.99, store: "NatureMart", checked: false, emoji: "🥚", category: "Dairy" },
  { id: 5, name: "Greek Yogurt", qty: 2, unit: "pcs", price: 1.89, store: "FreshMart", checked: false, emoji: "🥣", category: "Dairy" },
  { id: 6, name: "Baby Spinach", qty: 1, unit: "bag", price: 2.99, store: "FreshMart", checked: true, emoji: "🥬", category: "Produce" },
  { id: 7, name: "Pasta Spaghetti", qty: 3, unit: "packs", price: 1.20, store: "CostPlus", checked: false, emoji: "🍝", category: "Grains" },
];

const lists = [
  { id: "weekly", name: "Weekly Groceries", items: 12, total: "$48.20", color: "#EEF2FF", accent: "#6366F1" },
  { id: "bbq", name: "BBQ Weekend", items: 8, total: "$34.50", color: "#ECFDF5", accent: "#10B981" },
  { id: "pantry", name: "Pantry Restock", items: 5, total: "$22.00", color: "#FFFBEB", accent: "#F59E0B" },
];

export function ListsScreen({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<"lists" | "items">("lists");
  const [activeList, setActiveList] = useState("weekly");
  const [addInput, setAddInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSwipedId(null);
  };

  const addItem = () => {
    if (!addInput.trim()) return;
    setItems(prev => [...prev, {
      id: Date.now(), name: addInput, qty: 1, unit: "pcs",
      price: 0, store: "Any", checked: false, emoji: "🛒", category: "Other"
    }]);
    setAddInput("");
    setShowAdd(false);
  };

  const total = items.filter(i => !i.checked).reduce((s, i) => s + i.price * i.qty, 0);
  const checkedCount = items.filter(i => i.checked).length;

  if (view === "lists") {
    return (
      <div className="flex flex-col h-full bg-[#F8F9FC]">
        <div className="px-5 pt-12 pb-4 bg-white">
          <h1 className="text-gray-900 mb-1" style={{ fontSize: 24, fontWeight: 700 }}>Shopping Lists</h1>
          <p className="text-gray-400" style={{ fontSize: 14 }}>Manage your smart lists</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-3 mb-6">
            {lists.map((list, i) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-5 cursor-pointer"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveList(list.id); setView("items"); }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: list.color }}>
                      <ShoppingCart className="w-5 h-5" style={{ color: list.accent }} />
                    </div>
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{list.name}</p>
                      <p className="text-gray-400" style={{ fontSize: 12 }}>{list.items} items</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1">
                    {["🍎", "🥛", "🥚"].map((e, j) => (
                      <div key={j} className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center" style={{ fontSize: 14 }}>
                        {e}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                      <span className="text-gray-500" style={{ fontSize: 10, fontWeight: 600 }}>+{list.items - 3}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: list.accent }}>{list.total}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create new list */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 600 }}>Create New List</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setView("lists")}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-gray-500 rotate-180" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900" style={{ fontSize: 20, fontWeight: 700 }}>Weekly Groceries</h1>
          </div>
          <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              animate={{ width: `${(checkedCount / items.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>
            {checkedCount}/{items.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input placeholder="Search items..." className="flex-1 bg-transparent outline-none text-gray-700" style={{ fontSize: 13 }} />
          </div>
          <div className="bg-indigo-50 rounded-xl px-3 py-2.5">
            <span style={{ fontSize: 13, fontWeight: 700, color: "#6366F1" }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-white rounded-2xl mb-2.5 overflow-hidden"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5 relative">
                {/* Emoji */}
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontSize: 14, fontWeight: 600,
                      color: item.checked ? "#9CA3AF" : "#111827",
                      textDecoration: item.checked ? "line-through" : "none",
                    }}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400" style={{ fontSize: 12 }}>
                      {item.qty} {item.unit}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-gray-400" style={{ fontSize: 12 }}>{item.store}</span>
                  </div>
                </div>

                {/* Price + actions */}
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 14, fontWeight: 700, color: item.checked ? "#9CA3AF" : "#10B981" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                  <motion.button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    animate={{
                      borderColor: item.checked ? "#10B981" : "#D1D5DB",
                      backgroundColor: item.checked ? "#10B981" : "white",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence>
                      {item.checked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add item input */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-5 py-3 bg-white border-t border-gray-100"
          >
            <div className="flex gap-2">
              <input
                value={addInput}
                onChange={(e) => setAddInput(e.target.value)}
                placeholder="Add item name..."
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                className="flex-1 bg-gray-50 px-4 py-3 rounded-xl outline-none"
                style={{ fontSize: 14 }}
              />
              <button
                onClick={addItem}
                className="px-4 py-3 bg-indigo-600 rounded-xl"
                style={{ fontSize: 13, fontWeight: 600, color: "white" }}
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <div className="absolute bottom-24 right-5">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowAdd(!showAdd)}
          className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl"
        >
          <motion.div animate={{ rotate: showAdd ? 45 : 0 }}>
            <Plus className="w-6 h-6 text-white" />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
