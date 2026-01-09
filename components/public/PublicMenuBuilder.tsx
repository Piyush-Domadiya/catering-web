"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  X,
  ChevronDown,
  Utensils,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: string;
  category: {
    name: string;
  };
}

interface MenuCategory {
  id: string;
  name: string;
}

interface PublicMenuBuilderProps {
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
}

export function PublicMenuBuilder({
  initialCategories,
  initialItems,
}: PublicMenuBuilderProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.categoryId === activeCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialItems, activeCategory, searchQuery]);

  // Calculate stats
  const selectedList = initialItems.filter((item) =>
    selectedItems.has(item.id)
  );
  const totalCost = selectedList.reduce((sum, item) => sum + item.price, 0);

  const toggleItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const clearSelection = () => {
    if (confirm("Are you sure you want to clear your selection?")) {
      setSelectedItems(new Set());
      setIsPreviewOpen(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = "919876543210"; // Replace with actual business number
    const menuList = selectedList
      .map((item) => `- ${item.name} (₹${item.price})`)
      .join("\n");

    const message = `*New Menu Inquiry* 🍽️%0A%0AI've created a custom menu on your website:%0A%0A${encodeURIComponent(
      menuList
    )}%0A%0A*Total Estimated Price:* ₹${totalCost}%0A*Items:* ${
      selectedList.length
    }%0A%0APlease let me know the availability and final quote.`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="relative">
      {/* Category Navigation - Sticky */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 overflow-x-auto custom-scrollbar border-b border-gray-100 dark:border-slate-800">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === "all"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            All Items
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-gray-900 dark:text-white shadow-sm"
        />
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
        {filteredItems.map((item) => {
          const isSelected = selectedItems.has(item.id);
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`relative bg-white dark:bg-slate-900 rounded-[2rem] p-4 border-2 transition-all cursor-pointer group overflow-hidden ${
                isSelected
                  ? "border-amber-500 shadow-xl shadow-amber-500/10"
                  : "border-transparent hover:border-gray-200 dark:hover:border-slate-700 shadow-sm"
              }`}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden relative">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Utensils className="h-8 w-8" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/80 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-white rotate-45 transition-transform duration-300" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                    {item.description || "Freshly prepared delicacy"}
                  </p>
                  <div className="flex justify-between items-end">
                    <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg text-sm">
                      ₹{item.price}
                    </span>
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400 group-hover:bg-amber-500 group-hover:text-white"
                      }`}
                    >
                      {isSelected ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Action Bar (Cart) */}
      <AnimatePresence>
        {selectedItems.size > 0 && !isPreviewOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-[2rem] shadow-2xl z-40 flex items-center justify-between pl-6 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95"
            onClick={() => setIsPreviewOpen(true)}
          >
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
                {selectedItems.size}
              </div>
              <div>
                <p className="text-xs opacity-70 font-medium uppercase tracking-wider">
                  Est. Total
                </p>
                <p className="text-xl font-bold">₹{totalCost.toFixed(2)}</p>
              </div>
            </div>
            <button className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              View Menu <ChevronDown className="h-4 w-4 rotate-180" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2.5rem] z-50 max-h-[85vh] flex flex-col shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] md:max-w-2xl md:mx-auto md:rounded-[2.5rem] md:bottom-6 md:h-auto"
            >
              <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Selection
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {selectedItems.size} items ready for inquiry
                  </p>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar flex-grow">
                {selectedList.length === 0 ? (
                  <p className="text-center text-gray-400 py-10">
                    Your plate is empty. Add some delicious items!
                  </p>
                ) : (
                  selectedList.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Utensils className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 space-y-4 shrink-0 pb-10 md:pb-6">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total Estimate</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={clearSelection}
                    className="flex-1 py-4 rounded-2xl font-bold bg-white dark:bg-slate-800 border-2 border-transparent hover:border-red-100 text-red-500 transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="flex-[2] py-4 rounded-2xl font-bold bg-[#25D366] text-white hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                  >
                    <Send className="h-5 w-5" />
                    Send Inquiry on WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
