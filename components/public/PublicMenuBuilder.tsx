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
  whatsappNumber?: string | null;
}

export function PublicMenuBuilder({
  initialCategories,
  initialItems,
  whatsappNumber,
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
    const phoneNumber = whatsappNumber || "919876543210";
    const menuList = selectedList.map((item) => `- ${item.name}`).join("\n");

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
      <div className="sticky top-20 z-30 bg-bg-primary/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 overflow-x-auto custom-scrollbar border-b border-border-color">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === "all"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
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
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-primary border border-border-color focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium text-text-primary shadow-sm placeholder:text-text-muted"
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
              className={`relative bg-bg-primary rounded-[2rem] p-4 border-2 transition-all cursor-pointer group overflow-hidden ${
                isSelected
                  ? "border-amber-500 shadow-xl shadow-amber-500/10"
                  : "border-transparent hover:border-border-color shadow-sm"
              }`}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl bg-bg-secondary flex-shrink-0 overflow-hidden relative">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
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
                    <h3 className="font-bold text-text-primary group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-2 font-medium">
                    {item.description || "Freshly prepared delicacy"}
                  </p>
                  <div className="flex justify-between items-end">
                    <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg text-sm invisible">
                      ₹{item.price}
                    </span>
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-red-500/10 text-red-600"
                          : "bg-bg-tertiary text-text-secondary group-hover:bg-amber-500 group-hover:text-white"
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
            className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-text-primary text-bg-primary p-4 rounded-[2rem] shadow-2xl z-40 flex items-center justify-between pl-6 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95"
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
            <button className="bg-bg-primary text-text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-bg-tertiary transition-colors">
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
              className="fixed bottom-0 left-0 right-0 bg-bg-primary rounded-t-[2.5rem] z-50 max-h-[85vh] flex flex-col shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] md:max-w-2xl md:mx-auto md:rounded-[2.5rem] md:bottom-6 md:h-auto"
            >
              <div className="p-8 border-b border-border-color flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    Your Selection
                  </h2>
                  <p className="text-text-muted text-sm">
                    {selectedItems.size} items ready for inquiry
                  </p>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors"
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar flex-grow">
                {selectedList.length === 0 ? (
                  <p className="text-center text-text-muted py-10">
                    Your plate is empty. Add some delicious items!
                  </p>
                ) : (
                  selectedList.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-bg-secondary p-4 rounded-2xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-bg-primary flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Utensils className="h-5 w-5 text-text-muted" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary">
                            {item.name}
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

              <div className="p-6 border-t border-border-color bg-bg-secondary space-y-4 shrink-0 pb-10 md:pb-6">
                <div className="flex justify-between items-center text-lg font-bold text-text-primary">
                  <span>Total Estimate</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={clearSelection}
                    className="flex-1 py-4 rounded-2xl font-bold bg-bg-primary border-2 border-transparent hover:border-red-100 text-red-500 transition-all"
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
