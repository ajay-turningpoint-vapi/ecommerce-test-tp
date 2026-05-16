import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSliderProps {
  banners: { image: string; alt: string; link?: string }[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const BannerSlider = ({ banners, autoPlay = true, interval = 3500, className = '' }: BannerSliderProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % banners.length), interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, banners.length]);

  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b, i) => (
          <div key={i} className="w-full shrink-0 aspect-[16/9]">
            <img src={b.image} alt={b.alt} className="w-full h-full object-contain" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent((current - 1 + banners.length) % banners.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrent((current + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary-foreground' : 'bg-primary-foreground/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerSlider;
