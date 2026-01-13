"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Highlight {
  id: string;
  title: string | null;
  imageUrl: string;
  active: boolean;
}

export default function HighlightsClient() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const res = await fetch("/api/highlights");
      if (res.ok) {
        const data = await res.json();
        setHighlights(data);
      }
    } catch (error) {
      console.error("Failed to fetch highlights", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setSubmitting(true);
    try {
      // First, upload the image
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      const { url: imageUrl } = await uploadRes.json();

      // Then create the highlight
      const res = await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, imageUrl }),
      });

      if (res.ok) {
        setNewTitle("");
        setSelectedFile(null);
        setPreviewUrl("");
        fetchHighlights();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create highlight", error);
      alert("Failed to create highlight. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this highlight?")) return;

    try {
      const res = await fetch(`/api/highlights/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete highlight", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-bg-primary p-6 rounded-2xl border border-border-color shadow-sm">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Add New Highlight
        </h3>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2.5 rounded-xl border border-border-color bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-500/10 dark:file:text-amber-500"
                required
              />
              {previewUrl && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-border-color">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Title (Optional)
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Wedding Celebration"
                className="w-full p-2.5 rounded-xl border border-border-color bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-amber-500 text-text-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || !selectedFile}
            className="self-end px-6 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Highlight
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="group relative aspect-video rounded-2xl overflow-hidden bg-bg-secondary border border-border-color shadow-sm hover:shadow-md transition-all"
          >
            <Image
              src={highlight.imageUrl}
              alt={highlight.title || "Highlight"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
              <button
                onClick={() => handleDelete(highlight.id)}
                className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors backdrop-blur-sm"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            {highlight.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium truncate">
                  {highlight.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {highlights.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No highlights added yet.</p>
        </div>
      )}
    </div>
  );
}
