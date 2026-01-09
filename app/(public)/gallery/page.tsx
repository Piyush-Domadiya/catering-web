import { getPublicEvents } from "@/app/actions/public-events";
import prisma from "@/lib/prisma";
import { GalleryGrid } from "../../../components/public/GalleryGrid";
import { GalleryHeader } from "@/components/public/GalleryHeader";

export const revalidate = 60;

export default async function GalleryPage() {
  const events = await getPublicEvents();

  const highlights = await prisma.highlight.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  // Combine events and highlights into a unified format
  const galleryItems = [
    ...events.map((event) => ({
      id: event.id,
      type: "event",
      image: event.image,
      title: event.title,
      category: event.category,
      description: event.description,
      time: event.time,
    })),
    ...highlights.map((highlight) => ({
      id: highlight.id,
      type: "highlight",
      image: highlight.imageUrl,
      title: highlight.title || "Featured Moment",
      category: "Highlight",
      description: null,
    })),
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <GalleryHeader />
      <div className="max-w-7xl mx-auto px-4 py-20">
        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GalleryGrid events={galleryItems} />
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No gallery items yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
