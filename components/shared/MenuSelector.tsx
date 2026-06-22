"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Search, ShoppingBag } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: {
    id: string;
    name: string;
  };
  image?: string | null;
}

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MenuSelectorProps {
  initialSelection?: string | null; // JSON string or legacy text
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function MenuSelector({
  initialSelection,
  onChange,
  readOnly = false,
}: MenuSelectorProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLegacyMode, setIsLegacyMode] = useState(false);
  const [legacyText, setLegacyText] = useState("");

  // Load menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu");
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Parse initial selection
  useEffect(() => {
    if (initialSelection) {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(initialSelection);
        if (Array.isArray(parsed)) {
          setSelectedItems(parsed);
        } else {
          // If JSON but not array (unexpected), treat as legacy
          setIsLegacyMode(true);
          setLegacyText(initialSelection);
        }
      } catch (e) {
        // Not JSON = Legacy Text
        setIsLegacyMode(true);
        setLegacyText(initialSelection);
      }
    }
  }, [initialSelection]);

  // Update parent whenever selection changes
  useEffect(() => {
    if (!readOnly) {
      if (isLegacyMode) {
        onChange(legacyText);
      } else {
        onChange(JSON.stringify(selectedItems));
      }
    }
  }, [selectedItems, isLegacyMode, legacyText, onChange, readOnly]);

  const handleAddItem = (item: MenuItem) => {
    if (readOnly) return;
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, quantity: 1 },
      ];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (readOnly) return;
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  // Group items by category
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category.name;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  if (isLoading) return <div className="p-4 text-center">Loading menu...</div>;

  return (
    <div className="space-y-4">
      {/* Mode Toggle (only if we have legacy data) */}
      {initialSelection && isLegacyMode && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl mb-4">
          <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
            ⚠ This event has a legacy text-based menu.
          </span>
          <button
            type="button"
            onClick={() => setIsLegacyMode(false)}
            className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Switch to Smart Menu
          </button>
        </div>
      )}

      {isLegacyMode ? (
        <textarea
          value={legacyText}
          onChange={(e) => setLegacyText(e.target.value)}
          placeholder="List menu items manually..."
          rows={6}
          disabled={readOnly}
          className="w-full px-5 py-4 rounded-2xl bg-bg-secondary border-2 border-border-color focus:border-amber-500 focus:outline-none transition-all font-bold text-text-primary disabled:opacity-50 resize-none"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
          <div className="flex flex-col bg-bg-secondary rounded-2xl p-4 border-2 border-border-color h-full overflow-hidden min-h-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-primary border border-border-color focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none text-sm font-bold text-text-primary"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-bold text-text-primary mb-3 text-xs uppercase tracking-wider sticky top-0 bg-bg-secondary py-1 z-10 border-b border-border-color/50">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const selected = selectedItems.find(
                        (i) => i.id === item.id,
                      );
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-border-color hover:border-amber-500 transition-all group"
                        >
                          <div>
                            <p className="font-medium text-text-primary text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              ₹{item.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {selected && (
                              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                                x{selected.quantity}
                              </span>
                            )}
                            {!readOnly && (
                              <button
                                type="button"
                                onClick={() => handleAddItem(item)}
                                className="p-1.5 rounded-lg bg-bg-secondary hover:bg-amber-500 hover:text-white transition-colors text-text-secondary"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Items */}
          <div className="flex flex-col bg-bg-primary rounded-[2rem] p-4 border-2 border-border-color h-full shadow-xl overflow-hidden min-h-0">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              Selected Menu (
              {selectedItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </h3>

            {selectedItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-center p-8">
                <p className="mb-2">No items selected</p>
                <p className="text-xs">Add items from the menu on the left</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl border-b border-border-color last:border-0"
                  >
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        ₹{item.price} x {item.quantity} = ₹
                        {item.price * item.quantity}
                      </p>
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 rounded-lg bg-bg-primary hover:bg-red-500 hover:text-white transition-colors text-text-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddItem({
                              ...item,
                              category: { id: "", name: "" },
                            } as MenuItem)
                          }
                          className="p-1.5 rounded-lg bg-bg-primary hover:bg-amber-500 hover:text-white transition-colors text-text-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border-color">
              <div className="flex justify-between items-center text-lg font-bold text-text-primary">
                <span>Total Estimate:</span>
                <span>
                  ₹
                  {selectedItems.reduce(
                    (acc, i) => acc + i.price * i.quantity,
                    0,
                  )}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 text-right">
                *Excluding tax & discounts
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
