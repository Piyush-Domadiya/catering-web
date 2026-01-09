"use client";

import { useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm pb-4 pt-1">
          <h1 className="text-2xl font-bold text-white mb-4">
            Create Custom Menu
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border-none rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="space-y-8 pb-20">
          {categories.map((category) => {
            const items = itemsByCategory[category.name];
            if (!items || items.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                <h2 className="text-xl font-semibold text-amber-500 sticky top-20 bg-gray-900/90 py-2 z-10">
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
                            : "bg-gray-800 border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                isSelected ? "text-amber-400" : "text-white"
                              }`}
                            >
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
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
                                : "border-gray-500 group-hover:border-gray-400"
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
          className={`fixed right-0 top-0 h-screen w-96 bg-gray-900 border-l border-gray-800 shadow-2xl p-6 flex flex-col z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:h-auto lg:rounded-2xl lg:border lg:bg-gray-800/50 lg:backdrop-blur-xl print:static print:w-full print:h-auto print:bg-white print:shadow-none print:border-none print:p-0 print:overflow-visible ${
            !isSidebarOpen
              ? "translate-x-full lg:hidden print:translate-x-0 print:block"
              : "" // Handle mobile drawer later if needed, mostly desktop for admins
          }`}
        >
          {/* Mobile close button could go here */}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 print:text-black">
              <ShoppingCart className="h-5 w-5 text-amber-500 print:hidden" />
              Selected Items
            </h2>
            <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-sm font-bold">
              {selectedItems.size}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-3">
            {selectedList.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Utensils className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No items selected</p>
                <p className="text-sm">Select items to build your menu</p>
              </div>
            ) : (
              selectedList.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700 print:bg-transparent print:border-b print:border-gray-200 print:rounded-none print:border-t-0 print:border-x-0"
                >
                  <div>
                    <p className="text-white font-medium print:text-black">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 print:hidden">
                      {item.category.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm print:text-black font-bold">
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

          <div className="mt-6 pt-6 border-t border-gray-700 space-y-4 print:border-gray-300">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-white print:text-black">
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
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              {/* Print Button - Helper for printing */}
              <button
                onClick={printMenu}
                disabled={selectedItems.size === 0}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
