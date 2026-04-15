import { Button } from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  isLoading = false 
}: PaginationProps) {
  // Safety checks for invalid values
  const safeCurrentPage = Math.max(1, currentPage || 1);
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeTotalItems = Math.max(0, totalItems || 0);
  const safeItemsPerPage = Math.max(1, itemsPerPage || 20);

  const startItem = safeTotalItems > 0 ? (safeCurrentPage - 1) * safeItemsPerPage + 1 : 0;
  const endItem = Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems);

  const handlePrevious = () => {
    if (safeCurrentPage > 1 && !isLoading) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < safeTotalPages && !isLoading) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== safeCurrentPage && !isLoading) {
      onPageChange(page);
    }
  };

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (safeTotalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, safeCurrentPage - 1);
      let endPage = Math.min(safeTotalPages - 1, safeCurrentPage + 1);
      
      // Adjust if we're near the start or end
      if (safeCurrentPage <= 2) {
        endPage = Math.min(safeTotalPages - 1, 4);
      } else if (safeCurrentPage >= safeTotalPages - 1) {
        startPage = Math.max(2, safeTotalPages - 3);
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < safeTotalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Always show last page
      if (safeTotalPages > 1) {
        pages.push(safeTotalPages);
      }
    }
    
    return pages;
  };

  if (safeTotalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between items-center flex-1">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{safeTotalItems}</span> results
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={safeCurrentPage <= 1 || isLoading}
            className="flex items-center"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              page === -1 ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === safeCurrentPage ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  disabled={isLoading}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={safeCurrentPage >= safeTotalPages || isLoading}
            className="flex items-center"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
