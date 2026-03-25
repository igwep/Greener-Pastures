import React from 'react';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-6 ${className || ''}`}>
      <div className="space-y-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
}

export function WalletCardSkeleton() {
  return (
    <div className="md:col-span-2">
      <div className="bg-ajo-900 text-white relative overflow-visible flex flex-col justify-between p-8 rounded-3xl border-none shadow-lg">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/4 bg-gray-600" />
          <Skeleton className="h-12 w-2/3 bg-gray-600" />
          <Skeleton className="h-3 w-1/2 bg-gray-600" />
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 bg-gray-600" />
            <Skeleton className="h-6 w-32 bg-gray-600" />
          </div>
          <Skeleton className="h-10 w-24 bg-gray-600" />
        </div>
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-12 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
          </div>
        </div>
        <div className="h-[300px] flex items-end justify-around">
          {[1, 2, 3, 4, 5, 6, 7].map((height) => (
            <div 
              key={height} 
              className={`w-8 animate-pulse rounded-md bg-gray-200`}
              style={{ height: `${height * 30}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
