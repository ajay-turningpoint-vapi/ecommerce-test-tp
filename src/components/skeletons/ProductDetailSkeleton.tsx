import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-8">
    <Skeleton className="w-full aspect-square rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
