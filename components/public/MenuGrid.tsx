"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingBag, ArrowRight } from "lucide-react";
import { MenuCategory, MenuItem } from "@prisma/client";

// Extended type to include category relation if needed, though for filtering simple ID matching is enough
type MenuItemWithCategory = MenuItem & { category: MenuCategory };

interface MenuGridProps {
  categories: MenuCategory[];
  items: MenuItemWithCategory[];
}

export function MenuGrid({ categories, items }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Enhance categories with "All"
  const filterCategories = [
    { id: "All", name: "All" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.categoryId === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Premium Sticky Search & Filter Bar */}
      <div className="sticky top-20 z-40 py-6 transition-all duration-300">
        <div className="absolute inset-0 bg-bg-primary/80 border-b border-border-color shadow-2xl backdrop-blur-xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            {/* Elegant Search */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-amber-500 transition-colors z-10" />
              <input
                type="text"
                placeholder="Search our culinary delights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500/50 focus:outline-none transition-all text-text-primary placeholder:text-text-muted shadow-sm backdrop-blur-md"
              />
            </div>

            {/* Premium Filter Tabs */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex flex-wrap gap-3 p-1">
                {filterCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all overflow-hidden group ${
                      selectedCategory === cat.id
                        ? "text-white shadow-lg shadow-amber-500/25"
                        : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    {selectedCategory === cat.id && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immersive Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-bg-primary rounded-[2.5rem] p-5 hover:shadow-2xl hover:shadow-amber-500/10 border border-border-color transition-all duration-500 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/5 transition-colors duration-500"></div>

                <div className="flex flex-col sm:flex-row gap-6 h-full relative z-10">
                  {/* Image with Hover Effect */}
                  <div className="relative w-full sm:w-48 h-56 sm:h-auto rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg">
                    <Image
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80"
                      }
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center py-2 pr-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-amber-100 dark:border-amber-500/20">
                          {item.category.name}
                        </span>
                        <h3 className="text-2xl font-bold text-text-primary leading-tight transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-xl">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">
                      {item.description ||
                        "A masterpiece of flavors, carefully curated for an exquisite dining experience."}
                    </p>

                    <div className="mt-auto flex gap-3">
                      <button className="flex-1 group/btn flex items-center justify-center gap-2 bg-bg-secondary text-text-primary font-bold py-3.5 rounded-xl hover:bg-amber-500 hover:text-white transition-all text-sm border border-border-color hover:border-amber-500">
                        View Details
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button className="w-14 h-14 flex items-center justify-center bg-text-primary text-bg-primary rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-95">
                        <ShoppingBag className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-32">
              <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted animate-pulse">
                <Filter className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-3">
                No culinary matches found
              </h3>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                We couldn&apos;t find any items matching your criteria. Try
                exploring our other exquisite categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                Clear all filters <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
