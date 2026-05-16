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
      <Link to={link} className={`block rounded-2xl overflow-hidden relative group ${className}`}>
        <div className="aspect-[16/9]">
          <img src={image} alt={title} className="w-full h-full object-contain" loading="lazy" />
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
      <Link to={link} className={`block rounded-2xl overflow-hidden ${className}`}>
        <div className="aspect-[16/9]">
          <img src={image} alt={title} className="w-full h-full object-contain" loading="lazy" />
        </div>
      </Link>
    );
  }

  // horizontal (default)
  return (
    <Link to={link} className={`block rounded-2xl overflow-hidden ${className}`}>
      {image ? (
        <div className="aspect-[16/9]">
          <img src={image} alt={title} className="w-full h-full object-contain" loading="lazy" />
        </div>
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
