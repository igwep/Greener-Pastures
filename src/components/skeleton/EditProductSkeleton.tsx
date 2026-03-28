import { ListingInfoSkeleton, TipsSkeleton } from './SidebarSkeletons';

export function EditProductSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Form Card */}
          <div className="p-8 rounded-3xl border-none shadow-sm bg-white">
            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Price and Duration Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-4">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-4">
                  {['Facebook', 'TikTok', 'Instagram', 'Other'].map((platform) => (
                    <div key={platform} className="space-y-2">
                      <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ListingInfoSkeleton />
          <TipsSkeleton />
        </div>
      </div>
    </div>
  );
}
