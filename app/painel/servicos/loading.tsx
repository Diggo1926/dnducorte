import { PageHeaderSkeleton, Skeleton, ListSkeleton } from "../Skeleton";

export default function LoadingServicos() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <Skeleton className="h-40 w-full" />
      <ListSkeleton rows={3} />
    </div>
  );
}
