import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  variant?: 'hero' | 'small' | 'horizontal' | 'vertical';
  className?: string;
}

const BannerSkeleton = ({ variant = 'hero', className = '' }: Props) => {
  const heights: Record<string, string> = {
    hero: 'h-48 md:h-64',
    small: 'h-12',
    horizontal: 'h-32',
    vertical: 'h-64',
  };

  return <Skeleton className={`w-full rounded-xl ${heights[variant]} ${className}`} />;
};

export default BannerSkeleton;
