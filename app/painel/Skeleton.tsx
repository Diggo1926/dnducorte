export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
