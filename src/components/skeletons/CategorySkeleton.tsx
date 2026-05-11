import { Skeleton } from '@/components/ui/skeleton';

const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
    <Skeleton className="h-3 w-12" />
  </div>
);

export default CategorySkeleton;
