"use client";

import { useState } from "react";
import { HighlightCard } from "./HighlightCard";
import { FullscreenImageViewer } from "./FullscreenImageViewer";

interface HighlightsGridProps {
  highlights: Array<{
    id: string;
    imageUrl: string;
    title: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export function HighlightsGrid({ highlights }: HighlightsGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const handleOpenFullscreen = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseFullscreen = () => {
    setSelectedImageIndex(null);
  };

  const handleNavigate = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.length > 0 ? (
          highlights.map((item, index) => (
            <HighlightCard
              key={item.id}
              item={item}
              index={index}
              onClick={() => handleOpenFullscreen(index)}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-20 text-text-muted">
            <p>No highlights available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {selectedImageIndex !== null && (
        <FullscreenImageViewer
          isOpen={selectedImageIndex !== null}
          onClose={handleCloseFullscreen}
          imageUrl={highlights[selectedImageIndex].imageUrl}
          title={highlights[selectedImageIndex].title}
          images={highlights}
          currentIndex={selectedImageIndex}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
