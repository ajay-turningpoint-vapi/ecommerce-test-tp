import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PromoBannerProps {
  image?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  link?: string;
  variant?: 'full' | 'horizontal' | 'small' | 'vertical';
  bgColor?: string;
  className?: string;
}

const PromoBanner = ({ image, title, subtitle, cta, link = '/', variant = 'horizontal', bgColor, className = '' }: PromoBannerProps) => {
  if (variant === 'full' && image) {
    return (
      <Link to={link} className={`block rounded-xl overflow-hidden relative group ${className}`}>
        <img src={image} alt={title} className="w-full h-36 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs md:text-sm text-white/80 mt-1">{subtitle}</p>}
            {cta && <span className="inline-flex items-center gap-1 text-xs font-bold text-white mt-2 border-b border-white/50">{cta} <ArrowRight className="h-3 w-3" /></span>}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'small') {
    return (
      <Link to={link} className={`flex items-center justify-between rounded-lg px-4 py-3 transition-opacity hover:opacity-90 ${bgColor || 'bg-primary'} ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">💄</span>
          <span className="text-sm font-bold text-primary-foreground">{title} {subtitle && <span className="font-normal text-primary-foreground/80">{subtitle}</span>}</span>
        </div>
        <ArrowRight className="h-5 w-5 text-primary-foreground shrink-0" />
      </Link>
    );
  }

  if (variant === 'vertical' && image) {
    return (
      <Link to={link} className={`block rounded-xl overflow-hidden relative group ${className}`}>
        <img src={image} alt={title} className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-white/80 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </Link>
    );
  }

  // horizontal (default)
  return (
    <Link to={link} className={`block rounded-xl overflow-hidden relative group ${className}`}>
      {image ? (
        <>
          <img src={image} alt={title} className="w-full h-28 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-5">
            <div>
              <h3 className="text-sm md:text-lg font-bold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
            </div>
          </div>
        </>
      ) : (
        <div className={`flex items-center justify-between px-5 py-4 ${bgColor || 'bg-accent'}`}>
          <div>
            <h3 className="text-sm md:text-base font-bold">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </div>
      )}
    </Link>
  );
};

export default PromoBanner;
