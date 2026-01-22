"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface EventImage {
  id: string;
  url: string;
  caption: string | null;
}

interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  images: EventImage[];
}

export default function EventPhotosPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);

  useEffect(() => {
    const fetchEventPhotos = async () => {
      try {
        const res = await fetch(`/api/customer/events/${eventId}/photos`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (error) {
        console.error("Failed to fetch photos", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventPhotos();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Event not found
        </h1>
        <Link
          href="/my-events"
          className="text-amber-500 font-bold hover:underline"
        >
          Go back to my events
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/my-events"
            className="p-2 bg-bg-primary rounded-xl border border-border-color hover:bg-bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {event.name}
            </h1>
            <p className="text-text-secondary">
              Capture the moments from your special day
            </p>
          </div>
        </div>
      </div>

      {event.images.length === 0 ? (
        <div className="bg-bg-primary rounded-[2.5rem] p-20 text-center border border-border-color">
          <div className="w-20 h-20 bg-bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-text-muted">
            <ImageIcon className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            No photos yet
          </h3>
          <p className="text-text-secondary max-w-sm mx-auto">
            Our team is currently processing your event photos. Please check
            back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {event.images.map((img, index) => (
            <motion.div
              layoutId={img.id}
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-square rounded-[2rem] overflow-hidden bg-bg-secondary border border-border-color cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={img.url}
                alt={img.caption || event.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-white font-bold text-sm truncate">
                  {img.caption || "View Moment"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              layoutId={selectedImage.id}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || "Event photo"}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="mt-6 text-center">
                <p className="text-white text-lg font-medium mb-4">
                  {selectedImage.caption || "Captured Moment"}
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href={selectedImage.url}
                    download
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-md transition-all font-bold"
                  >
                    <Download className="h-5 w-5" />
                    Download
                  </a>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
