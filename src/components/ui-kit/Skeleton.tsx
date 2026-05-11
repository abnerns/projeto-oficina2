export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function WorkshopCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
      <Skeleton className="h-5 w-24 mb-3" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1.5" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex -space-x-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
}
