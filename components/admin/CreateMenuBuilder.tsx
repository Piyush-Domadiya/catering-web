"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Plus,
  Minus,
  Check,
  Search,
  ShoppingCart,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  category: Category;
  image: string | null;
  available: boolean;
}

interface CreateMenuBuilderProps {
  initialItems: MenuItem[];
  categories: Category[];
}

export function CreateMenuBuilder({
  initialItems,
  categories,
}: CreateMenuBuilderProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Group items by category to display them in organized sections
  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = initialItems.filter(
      (item) =>
        item.categoryId === category.id &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Toggle selection of a menu item for the custom menu
  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const getSelectedItemsNodes = () => {
    return initialItems.filter((item) => selectedItems.has(item.id));
  };

  const selectedList = getSelectedItemsNodes();
  const totalPrice = selectedList.reduce((sum, item) => sum + item.price, 0);

  // Copy the selected menu summary to clipboard for easy sharing
  const copyToClipboard = () => {
    const text = selectedList
      .map((item) => `${item.name} - ₹${item.price}`)
      .join("\n");
    const summary = `\nTotal Items: ${selectedList.length}\nTotal Price: ₹${totalPrice}`;
    navigator.clipboard.writeText(text + summary);
    alert("Menu copied to clipboard!");
  };

  // Print the menu using the browser's print dialog (optimized with print-specific CSS classes)
  const printMenu = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] lg:flex-row gap-6">
      {/* Main Content - Item Selection */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar print:hidden">
        <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm pb-4 pt-1">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Create Custom Menu
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-secondary border-none rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="space-y-8 pb-20">
          {categories.map((category) => {
            const items = itemsByCategory[category.name];
            if (!items || items.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                <h2 className="text-xl font-semibold text-amber-500 sticky top-20 bg-bg-primary/90 py-2 z-10">
                  {category.name} ({items.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        layoutId={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500"
                            : "bg-bg-secondary border-border-color hover:border-amber-500/50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                isSelected
                                  ? "text-amber-500"
                                  : "text-text-primary"
                              }`}
                            >
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-text-muted mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <p className="text-amber-500 font-bold mt-2">
                              ₹{item.price}
                            </p>
                          </div>
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center border transition-colors ${
                              isSelected
                                ? "bg-amber-500 border-amber-500"
                                : "border-text-muted group-hover:border-amber-500/50"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar - Selected Menu Summary */}
      <AnimatePresence>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "24rem", opacity: 1 }}
          className={`fixed right-0 top-0 h-screen w-96 bg-bg-primary border-l border-border-color shadow-2xl p-6 flex flex-col z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:h-auto lg:rounded-2xl lg:border lg:bg-bg-secondary/50 lg:backdrop-blur-xl print:static print:w-full print:h-auto print:bg-white print:shadow-none print:border-none print:p-0 print:overflow-visible ${
            !isSidebarOpen
              ? "translate-x-full lg:hidden print:translate-x-0 print:block"
              : "" // Handle mobile drawer later if needed, mostly desktop for admins
          }`}
        >
          {/* Mobile close button could go here */}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 print:text-black">
              <ShoppingCart className="h-5 w-5 text-amber-500 print:hidden" />
              Selected Items
            </h2>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-sm font-bold">
                {selectedItems.size}
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="Close summary"
              >
                <Plus className="h-5 w-5 rotate-45 text-text-muted" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-3">
            {selectedList.length === 0 ? (
              <div className="text-center py-10 text-text-muted">
                <Utensils className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No items selected</p>
                <p className="text-sm">Select items to build your menu</p>
              </div>
            ) : (
              selectedList.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-bg-secondary/50 rounded-lg border border-border-color print:bg-transparent print:border-b print:border-gray-200 print:rounded-none print:border-t-0 print:border-x-0"
                >
                  <div>
                    <p className="text-text-primary font-medium print:text-black">
                      {item.name}
                    </p>
                    <p className="text-xs text-text-muted print:hidden">
                      {item.category.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-secondary text-sm print:text-black font-bold">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="text-red-400 hover:text-red-300 p-1 print:hidden"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border-color space-y-4 print:border-gray-300">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-text-primary print:text-black">
                Total Estimated
              </span>
              <span className="text-amber-500 print:text-black">
                ₹{totalPrice}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 print:hidden">
              <button
                onClick={copyToClipboard}
                disabled={selectedItems.size === 0}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-tertiary text-text-primary hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              {/* Print Button - Helper for printing */}
              <button
                onClick={printMenu}
                disabled={selectedItems.size === 0}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-tertiary text-text-primary hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Floating Action Button */}
      {!isSidebarOpen && selectedItems.size > 0 && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden z-30 bg-amber-500 text-white p-4 rounded-2xl shadow-2xl shadow-amber-500/40 flex items-center gap-3 font-bold active:scale-95 transition-transform"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-white text-amber-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-500">
              {selectedItems.size}
            </span>
          </div>
          <span>View Selected</span>
        </motion.button>
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
