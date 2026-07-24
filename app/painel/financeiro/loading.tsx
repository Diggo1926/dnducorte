import { PageHeaderSkeleton, Skeleton, ListSkeleton } from "../Skeleton";

export default function LoadingFinanceiro() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <ListSkeleton rows={5} />
    </div>
  );
}
