export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm h-[420px]">
      {/* Image Skeleton */}
      <div className="h-64 w-full bg-white/10 animate-pulse" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse" />

        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse" />
        </div>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
          <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}