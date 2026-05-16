import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  activeIndex?: number;
  onChange?: (index: number) => void;
}

const ProductImageGallery = ({ images, name, activeIndex, onChange }: ProductImageGalleryProps) => {
  const [internal, setInternal] = useState(0);
  const selected = activeIndex ?? internal;

  useEffect(() => {
    if (activeIndex !== undefined) setInternal(activeIndex);
  }, [activeIndex]);

  const setSelected = (idx: number) => {
    const next = (idx + images.length) % images.length;
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
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
              onClick={() => setSelected(selected - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelected(selected + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
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
              key={i}
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
