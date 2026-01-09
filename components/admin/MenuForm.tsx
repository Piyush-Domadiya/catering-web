"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";

// Matches the Zod schema in the server action, but without needing to import the server file directly in client if strict separation is preferred.
// However, since we might want to share the type, I will redefine it or import it. For simplicity in this step, I'll redefine it to match.
const MenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  available: z.boolean().default(true),
});

type MenuFormData = z.infer<typeof MenuItemSchema>;

interface MenuFormProps {
  initialData?: any; // Using any to avoid complex type matching for now, ideally MenuItemWithCategory
  categories: { id: string; name: string }[];
  onSubmit: (data: MenuFormData) => Promise<void>;
  isLoading: boolean;
  onCreateCategory?: (name: string) => Promise<string | null>;
}

export function MenuForm({
  initialData,
  categories,
  onSubmit,
  isLoading,
  onCreateCategory,
}: MenuFormProps) {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategoryLoading, setIsCreatingCategoryLoading] =
    useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MenuFormData>({
    resolver: zodResolver(MenuItemSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || "",
      image: initialData?.image || "",
      available: initialData?.available ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        categoryId: initialData.categoryId,
        image: initialData.image,
        available: initialData.available,
      });
      if (initialData.image) {
        setPreviewUrl(initialData.image);
      }
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        image: "",
        available: true,
      });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  // Handle file selection and generate a preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clear the text input for image URL since we are using a file
      setValue("image", "");
    }
  };

  // Wrapper around submit to handle file upload first if a new file is selected
  const handleFormSubmit = async (data: MenuFormData) => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        // Prepare form data for the upload API
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("type", "menu");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await uploadRes.json();
        data.image = url;
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image. Please try again or use a direct URL.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Item Name
        </label>
        <input
          {...register("name")}
          className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          placeholder="e.g. Truffle Arancini"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        {isCreatingCategory ? (
          <div className="flex gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
              className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <button
              type="button"
              onClick={async () => {
                if (!newCategoryName.trim()) return;
                setIsCreatingCategoryLoading(true);
                try {
                  const newId = await onCreateCategory?.(newCategoryName);
                  if (newId) {
                    setIsCreatingCategory(false);
                    setValue("categoryId", newId);
                  }
                } finally {
                  setIsCreatingCategoryLoading(false);
                }
              }}
              disabled={isCreatingCategoryLoading}
              className="bg-amber-500 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50"
            >
              {isCreatingCategoryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreatingCategory(false);
                setNewCategoryName("");
                setValue("categoryId", "");
              }}
              className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-xl font-medium"
            >
              Cancel
            </button>
          </div>
        ) : (
          <select
            className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            {...register("categoryId", {
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                if (e.target.value === "__NEW__") {
                  setIsCreatingCategory(true);
                  setValue("categoryId", "");
                }
              },
            })}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="__NEW__" className="font-bold text-amber-600">
              + Create New Category
            </option>
          </select>
        )}
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <div className="flex items-center h-full">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("available")}
                className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 border-gray-300"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Available
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          placeholder="Brief description of the dish..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image
        </label>

        <div className="space-y-4">
          {/* File Upload UI */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or WEBP
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Preview */}
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl("");
                      setSelectedFile(null);
                      setValue("image", "");
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white dark:bg-slate-900 px-3 text-gray-900 dark:text-white">
                Or use URL
              </span>
            </div>
          </div>

          <input
            {...register("image", {
              onChange: (e) => {
                if (e.target.value) {
                  setPreviewUrl(e.target.value);
                  setSelectedFile(null);
                }
              },
            })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {(isLoading || isUploading) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {initialData ? "Update Item" : "Create Item"}
        </button>
      </div>
    </form>
  );
}
