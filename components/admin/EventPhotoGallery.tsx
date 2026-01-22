"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Loader2, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface EventImage {
  id: string;
  url: string;
  caption: string | null;
}

interface EventPhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
}

export default function EventPhotoGallery({
  isOpen,
  onClose,
  eventId,
  eventName,
}: EventPhotoGalleryProps) {
  const [images, setImages] = useState<EventImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/images`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Failed to fetch event images", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      // 1. Upload to server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "events");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      // 2. Save to database
      const saveRes = await fetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption: "" }),
      });

      if (!saveRes.ok) throw new Error("Failed to save image reference");

      await fetchImages();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch(
        `/api/events/${eventId}/images?imageId=${imageId}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-primary rounded-[2.5rem] p-8 md:p-10 max-w-4xl w-full border border-border-color shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Event Photos
            </h2>
            <p className="text-sm text-text-secondary mt-1">{eventName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-secondary rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-text-muted" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Upload Button */}
          <label className="aspect-square rounded-3xl border-2 border-dashed border-border-color hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            ) : (
              <>
                <div className="p-3 bg-bg-secondary group-hover:bg-amber-500 group-hover:text-white rounded-2xl transition-all">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-text-muted group-hover:text-amber-600 transition-all uppercase tracking-wider">
                  Add Photo
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>

          {isLoading ? (
            <div className="col-span-full py-20 flex justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            </div>
          ) : (
            images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-3xl overflow-hidden bg-bg-secondary border border-border-color"
              >
                <Image
                  src={img.url}
                  alt={img.caption || "Event photo"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {!isLoading && images.length === 0 && !isUploading && (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-text-muted">
                <ImageIcon className="h-10 w-10" />
              </div>
              <p className="text-text-secondary font-medium">
                No photos uploaded yet for this event.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border-color">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 rounded-2xl font-bold bg-bg-secondary text-text-secondary hover:bg-bg-tertiary transition-all"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
