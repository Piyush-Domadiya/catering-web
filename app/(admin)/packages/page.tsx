"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Package } from "lucide-react";
import PackageDialog from "@/components/admin/PackageDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string;
  tag?: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(
    null
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    pkg: PackageType | null;
  }>({ isOpen: false, pkg: null });

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.pkg) return;
    await fetch(`/api/packages/${deleteDialog.pkg.id}`, { method: "DELETE" });
    setDeleteDialog({ isOpen: false, pkg: null });
    fetchPackages();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Event Packages
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your event packages and pricing.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPackage(null);
            setIsDialogOpen(true);
          }}
          className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-amber-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Package
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative group"
            >
              {pkg.tag && (
                <span className="absolute top-8 right-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {pkg.tag}
                </span>
              )}

              <div className="mb-6">
                <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                  {pkg.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${pkg.price}
                </span>
                <span className="text-gray-400 text-sm">/pp</span>
              </div>

              <div className="space-y-3 mb-8">
                {pkg.features
                  .split(",")
                  .slice(0, 3)
                  .map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="truncate">{feature.trim()}</span>
                    </div>
                  ))}
                {pkg.features.split(",").length > 3 && (
                  <div className="text-xs text-gray-400 pl-3.5">
                    +{pkg.features.split(",").length - 3} more features
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-6 border-t border-gray-50 dark:border-slate-800">
                <button
                  onClick={() => {
                    setEditingPackage(pkg);
                    setIsDialogOpen(true);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, pkg })}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {packages.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No packages found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first event package to get started.
          </p>
          <button
            onClick={() => {
              setEditingPackage(null);
              setIsDialogOpen(true);
            }}
            className="text-amber-500 font-bold hover:underline"
          >
            Create Package
          </button>
        </div>
      )}

      <PackageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchPackages}
        pkg={editingPackage}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, pkg: null })}
        onConfirm={handleDelete}
        title="Delete Package"
        message={`Are you sure you want to delete "${deleteDialog.pkg?.name}"?`}
      />
    </div>
  );
}
