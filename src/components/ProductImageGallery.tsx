import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  /** Optional: when this key changes, the gallery resets to image 0 (e.g. variant change) */
  resetKey?: string | number;
}

const ProductImageGallery = ({ images, name, resetKey }: ProductImageGalleryProps) => {
  const [selected, setSelected] = useState(0);

  // Reset to first image when the variant (resetKey) changes
  useEffect(() => {
    setSelected(0);
  }, [resetKey]);

  // Guard against out-of-range if images list shrinks
  useEffect(() => {
    if (selected >= images.length) setSelected(0);
  }, [images.length, selected]);

  const go = (idx: number) => {
    if (!images.length) return;
    setSelected(((idx % images.length) + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-xl overflow-hidden border border-border bg-muted group">
        <img
          src={images[selected]}
          alt={`${name} - ${selected + 1}`}
          width={800}
          height={800}
          decoding="async"
          fetchPriority="high"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full aspect-square object-cover transition-opacity duration-300"
          key={images[selected]}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(selected - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(selected + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === selected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img src={img} alt={`${name} thumbnail ${i + 1}`} loading="lazy" decoding="async" width={80} height={80} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
