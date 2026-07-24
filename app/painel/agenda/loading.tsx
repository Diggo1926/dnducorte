import { PageHeaderSkeleton, ListSkeleton } from "../Skeleton";

export default function LoadingAgenda() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <ListSkeleton rows={5} />
    </div>
  );
}
