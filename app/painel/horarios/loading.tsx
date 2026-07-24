import { PageHeaderSkeleton, ListSkeleton } from "../Skeleton";

export default function LoadingHorarios() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <ListSkeleton rows={7} />
    </div>
  );
}
