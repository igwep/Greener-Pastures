export function ProductPreviewSkeleton() {
  return (
    <div className="p-6 rounded-2xl border-none shadow-sm bg-white">
      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function ListingInfoSkeleton() {
  return (
    <div className="p-6 rounded-2xl border-none shadow-sm bg-white">
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="border-t pt-3">
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TipsSkeleton() {
  return (
    <div className="p-6 rounded-2xl border-none shadow-sm bg-white">
      <div className="space-y-4">
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-11/12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-10/12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-9/12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
