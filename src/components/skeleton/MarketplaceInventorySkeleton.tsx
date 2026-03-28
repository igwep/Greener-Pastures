import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { Card } from '../ui/Card';

export function MarketplaceInventorySkeleton() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        {[...Array(7)].map((_, i) => (
          <Card key={i} className="p-6 rounded-2xl border-none shadow-sm bg-white">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Skeleton className="h-12 w-full pl-12 rounded-xl" />
              <Skeleton className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded" />
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded" />
            ))}
          </div>
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}
