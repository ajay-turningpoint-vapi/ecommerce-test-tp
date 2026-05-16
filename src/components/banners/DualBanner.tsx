import PromoBanner from './PromoBanner';

interface DualBannerProps {
  left: { image: string; title: string; subtitle?: string; link?: string };
  right: { image: string; title: string; subtitle?: string; link?: string };
  className?: string;
}

const DualBanner = ({ left, right, className = '' }: DualBannerProps) => (
  <div className={`grid grid-cols-2 gap-1 ${className}`}>
    <PromoBanner image={left.image} title={left.title} subtitle={left.subtitle} link={left.link || '/'} variant="horizontal" />
    <PromoBanner image={right.image} title={right.title} subtitle={right.subtitle} link={right.link || '/'} variant="horizontal" />
  </div>
);

export default DualBanner;
