"use client";

import { useState } from "react";
import { X, Loader2, Edit2, Trash2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  _count?: {
    items: number;
  };
}

interface CategoryManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  initialCategories: Category[];
}

export default function CategoryManagerDialog({
  isOpen,
  onClose,
  onRefresh,
  initialCategories,
}: CategoryManagerDialogProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const updated = await res.json();
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      setEditName("");
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setCategories(categories.filter((c) => c.id !== id));
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-border-color shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-text-muted" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Add New Category */}
        <div className="mb-6 p-4 bg-bg-secondary rounded-2xl">
          <label className="text-sm font-bold text-text-secondary mb-2 block">
            Add New Category
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              placeholder="Enter category name..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-bg-primary border border-border-color focus:border-amber-500 focus:outline-none transition-all text-text-primary disabled:opacity-50"
            />
            <button
              onClick={handleAddCategory}
              disabled={isLoading || !newCategoryName.trim()}
              className="px-6 py-3 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-text-secondary mb-3">
            Existing Categories ({categories.length})
          </h3>
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 p-4 bg-bg-secondary rounded-2xl"
              >
                {editingId === category.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleUpdateCategory(category.id);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-bg-primary border border-amber-500 focus:outline-none text-text-primary"
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl font-bold bg-bg-tertiary text-text-secondary hover:bg-bg-secondary transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-bold text-text-primary">
                        {category.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {category._count?.items || 0} items
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartEdit(category)}
                      disabled={isLoading}
                      className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isLoading}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted text-center py-8">
              No categories yet. Add one above!
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border-color dark:border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 rounded-2xl font-bold bg-bg-secondary text-text-secondary hover:bg-bg-tertiary transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
