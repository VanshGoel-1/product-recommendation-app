// File: src/components/SkeletonCard.tsx
// REPLACED CONTENT

export default function SkeletonCard() {
  return (
    // --- This new layout matches ProductCard.tsx ---
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      
      {/* Image container */}
      <div className="h-48 w-full flex-shrink-0 bg-gray-300 animate-pulse"></div>

      {/* Content container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Top section (text) */}
        <div>
          {/* Brand */}
          <div className="h-4 w-1/4 rounded bg-gray-300 animate-pulse mb-2"></div>
          {/* Title */}
          <div className="h-6 w-3/4 rounded bg-gray-300 animate-pulse mb-3"></div>
          {/* Category */}
          <div className="h-3 w-1/3 rounded bg-gray-300 animate-pulse mb-3"></div>
          {/* Description */}
          <div className="h-4 w-full rounded bg-gray-300 animate-pulse mb-2"></div>
          <div className="h-4 w-5/6 rounded bg-gray-300 animate-pulse mb-4"></div>
        </div>

        {/* Bottom section (price) */}
        <div className="mt-auto">
          <div className="h-8 w-1/3 rounded bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}