"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Utensils,
  FolderEdit,
} from "lucide-react";
import {
  MenuItemData,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
} from "@/app/actions/menu";
import { Modal } from "@/components/shared/Modal";
import { MenuForm } from "@/components/admin/MenuForm";
import { useRouter } from "next/navigation";
import CategoryManagerDialog from "@/components/admin/CategoryManagerDialog";

interface MenuManagerProps {
  initialItems: any[];
  categories: any[];
}

export function MenuManager({ initialItems, categories }: MenuManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // Filter state could be added here if needed, for now just search
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handle item deletion with confirmation
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const res = await deleteMenuItem(id);
      if (res.success) {
        router.refresh();
        // Optimistic update
        setItems(items.filter((i) => i.id !== id));
      } else {
        alert(res.error || "Failed to delete");
      }
    }
  };

  // Handle form submission for both creating and editing menu items
  const handleSubmit = async (data: MenuItemData) => {
    setIsLoading(true);
    try {
      if (editingItem) {
        const res = await updateMenuItem(editingItem.id, data);
        if (res.success) {
          router.refresh();
          setIsModalOpen(false);
          // Optimistic update (simplified, ideally re-fetch or use returned data)
          // For now, router.refresh handles the real data, but we can patch local state for responsiveness
          // But since router.refresh is async, we might want to wait or correct local state.
          // Let's rely on router.refresh for now as it's cleaner for this complexity.
        } else {
          alert(res.error);
        }
      } else {
        const res = await createMenuItem(data);
        if (res.success) {
          router.refresh();
          setIsModalOpen(false);
        } else {
          alert(res.error);
        }
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new category on the fly from the menu form
  const handleCreateCategory = async (name: string) => {
    const res = await createCategory(name);
    if (res.success && res.data) {
      router.refresh();
      return res.data.id;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Menu Management
          </h1>
          <p className="text-text-secondary">
            Configure your menu items, categories, and pricing.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="bg-bg-secondary text-text-secondary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-bg-tertiary transition-all active:scale-95"
          >
            <FolderEdit className="h-5 w-5" />
            Manage Categories
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-none active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add New Item
          </button>
        </div>
      </div>

      {/* ... table code ... */}

      <div className="bg-bg-primary rounded-[2.5rem] border border-border-color shadow-sm overflow-hidden">
        {/* ... table content ... */}
        <div className="p-6 border-b border-border-color">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary border border-transparent focus:bg-bg-primary focus:border-amber-500 focus:outline-none transition-all text-text-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-text-muted text-sm font-bold border-b border-border-color">
                <th className="px-8 py-5">ITEM NAME</th>
                <th className="px-8 py-5">CATEGORY</th>
                <th className="px-8 py-5">PRICE</th>
                <th className="px-8 py-5">STATUS</th>
                <th className="px-8 py-5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-bg-secondary transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-amber-600 dark:text-amber-500">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <Utensils className="h-5 w-5" />
                        )}
                      </div>
                      <p className="font-bold text-text-primary">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-text-secondary bg-bg-secondary px-3 py-1 rounded-lg">
                      {item.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-text-primary">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`flex items-center gap-2 text-xs font-bold ${
                        item.available
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.available ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-text-muted">
                    No items found. Click "Add New Item" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Menu Item" : "Add New Item"}
      >
        <MenuForm
          initialData={editingItem}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCreateCategory={handleCreateCategory}
        />
      </Modal>

      <CategoryManagerDialog
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        onRefresh={() => router.refresh()}
        initialCategories={categories}
      />
    </div>
  );
}
