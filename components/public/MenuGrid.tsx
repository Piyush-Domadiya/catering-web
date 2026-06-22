"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, StarHalf, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { MenuCategory, MenuItem } from "@prisma/client";
import { Modal } from "@/components/shared/Modal";
import { submitReview } from "@/app/actions/reviews";

// Extended type to include category relation if needed, though for filtering simple ID matching is enough
// Extended type for review details
type ReviewDetails = {
  id: string;
  name: string;
  rating: number;
  content: string | null;
  createdAt: Date;
};

// Extended type to include category relation and review stats
type MenuItemWithCategory = MenuItem & { 
  category: MenuCategory;
  reviewCount: number;
  averageRating: number;
  reviews: ReviewDetails[];
};

interface MenuGridProps {
  categories: MenuCategory[];
  items: MenuItemWithCategory[];
}

export function MenuGrid({ categories, items }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewingItem, setReviewingItem] = useState<MenuItem | null>(null);
  const [viewingReviewsItem, setViewingReviewsItem] = useState<MenuItemWithCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState(5);

  // Ensure unique category names and enhance with "All"
  const uniqueCategoryNames = Array.from(
    new Set(categories.map((c) => c.name)),
  ).sort();

  const filterCategories = [
    { id: "All", name: "All" },
    ...uniqueCategoryNames.map((name) => ({ id: name, name })),
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category.name === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reviewingItem) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      itemId: reviewingItem.id,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      rating: rating,
      content: formData.get("content") as string,
    };

    const result = await submitReview(data);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setReviewingItem(null);
        setIsSuccess(false);
        setRating(5);
      }, 2000);
    } else {
      alert(result.error || "Failed to submit review");
    }
    setIsSubmitting(false);
  };

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
                  {item.image && (
                    <div className="relative w-full sm:w-48 h-56 sm:h-auto rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center py-2 pr-2">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-amber-100 dark:border-amber-500/20">
                          {item.category.name}
                        </span>
                        <h3 className="text-2xl font-bold text-text-primary leading-tight transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        {item.reviewCount > 0 && (
                          <div 
                            onClick={() => setViewingReviewsItem(item)}
                            className="flex flex-col items-end gap-1 cursor-pointer group/rating hover:opacity-80 transition-opacity"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => {
                                  if (s <= Math.floor(item.averageRating)) {
                                    return <Star key={s} className="h-3 w-3 text-amber-500 fill-current" />;
                                  } else if (s === Math.ceil(item.averageRating) && item.averageRating % 1 !== 0) {
                                    return <StarHalf key={s} className="h-3 w-3 text-amber-500 fill-current" />;
                                  } else {
                                    return <Star key={s} className="h-3 w-3 text-gray-300 dark:text-gray-600" />;
                                  }
                                })}
                              </div>
                              <span className="text-[10px] font-bold text-text-muted group-hover/rating:text-amber-500 transition-colors">
                                ({item.reviewCount})
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-500">
                              {item.averageRating.toFixed(1)} / 5.0
                            </span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setReviewingItem(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all duration-300 group/btn shadow-sm"
                        >
                          <MessageSquare className="h-3 w-3" />
                          Review
                        </button>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
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
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewingItem}
        onClose={() => !isSubmitting && setReviewingItem(null)}
        title={`Review ${reviewingItem?.name}`}
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-500 mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Review Submitted!</h3>
              <p className="text-text-secondary">Thank you for your valuable feedback.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-1 transition-all ${s <= rating ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                    >
                      <Star className={`h-6 w-6 ${s <= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all text-sm text-text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Mobile No.</label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="Your Mobile Number"
                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all text-sm text-text-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Review (Optional)</label>
                <textarea
                  name="content"
                  rows={3}
                  placeholder="What did you think of this item?"
                  className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-color focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all text-sm text-text-primary resize-none"
                />
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          )}
        </AnimatePresence>
      </Modal>

      {/* View Reviews Modal */}
      <Modal
        isOpen={!!viewingReviewsItem}
        onClose={() => setViewingReviewsItem(null)}
        title={`Reviews for ${viewingReviewsItem?.name}`}
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {viewingReviewsItem?.reviews && viewingReviewsItem.reviews.length > 0 ? (
            viewingReviewsItem.reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-2xl bg-bg-secondary border border-border-color space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-text-primary text-sm">{review.name}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-3 w-3 ${s <= review.rating ? 'text-amber-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted font-medium italic">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.content && (
                  <p className="text-sm text-text-secondary leading-relaxed pt-1 italic">
                    &ldquo;{review.content}&rdquo;
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-text-muted">No reviews yet for this item.</p>
            </div>
          )}
        </div>
        
        <button
          onClick={() => {
            setReviewingItem(viewingReviewsItem);
            setViewingReviewsItem(null);
          }}
          className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all active:scale-[0.98]"
        >
          Rate this item
        </button>
      </Modal>
    </>
  );
}
