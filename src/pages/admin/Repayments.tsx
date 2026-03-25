import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  useAdminRepaymentsQuery,
  useApproveRepaymentMutation,
  useRejectRepaymentMutation,
} from "../../services/admin/hooks";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export function Repayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSortOrder, setDateSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const repaymentsPerPage = 4;

  const { data: repaymentsData, isLoading: isRepaymentsLoading } = useAdminRepaymentsQuery();

  // Log the repayments response to console
  console.log('All Repayments Response:', repaymentsData);

  const repayments = useMemo(() => {
    if (!repaymentsData?.repayments) return [];
    
    let filteredRepayments = [...repaymentsData.repayments];
    
    // Filter by status
    if (statusFilter) {
      filteredRepayments = filteredRepayments.filter(repayment => repayment.status === statusFilter);
    }
    
    // Filter by name search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredRepayments = filteredRepayments.filter(repayment => 
        `${repayment.user.firstName} ${repayment.user.lastName}`.toLowerCase().includes(searchLower) ||
        repayment.user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date
    filteredRepayments.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filteredRepayments;
  }, [repaymentsData, statusFilter, searchTerm, dateSortOrder]);

  // Pagination
  const totalPages = Math.ceil(repayments.length / repaymentsPerPage);
  const startIndex = (currentPage - 1) * repaymentsPerPage;
  const paginatedRepayments = repayments.slice(startIndex, startIndex + repaymentsPerPage);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateSortOrder, statusFilter]);

  const approveRepaymentMutation = useApproveRepaymentMutation();
  const rejectRepaymentMutation = useRejectRepaymentMutation();

  const handleApproveRepayment = async (repaymentId: string) => {
    try {
      await approveRepaymentMutation.mutateAsync({ repaymentId });
      showSuccessToast('Repayment approved successfully!');
    } catch (error) {
      showErrorToast(error, 'Failed to approve repayment.');
    }
  };

  const handleRejectRepayment = async (repaymentId: string) => {
    try {
      await rejectRepaymentMutation.mutateAsync({ repaymentId });
      showSuccessToast('Repayment rejected successfully!');
    } catch (error) {
      showErrorToast(error, 'Failed to reject repayment.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Date Sort */}
        <div className="flex gap-2">
          <Button
            variant={dateSortOrder === "newest" ? "primary" : "ghost"}
            onClick={() => setDateSortOrder("newest")}
            size="sm"
          >
            Newest First
          </Button>
          <Button
            variant={dateSortOrder === "oldest" ? "primary" : "ghost"}
            onClick={() => setDateSortOrder("oldest")}
            size="sm"
          >
            Oldest First
          </Button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={!statusFilter ? "primary" : "ghost"}
          onClick={() => setStatusFilter("")}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={statusFilter === "PENDING" ? "primary" : "ghost"}
          onClick={() => setStatusFilter("PENDING")}
          size="sm"
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "APPROVED" ? "primary" : "ghost"}
          onClick={() => setStatusFilter("APPROVED")}
          size="sm"
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === "REJECTED" ? "primary" : "ghost"}
          onClick={() => setStatusFilter("REJECTED")}
          size="sm"
        >
          Rejected
        </Button>
      </div>

      {isRepaymentsLoading ? (
        <div className="text-center py-8">Loading repayments...</div>
      ) : paginatedRepayments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No repayments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedRepayments.map((repayment) => (
            <Card key={repayment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {repayment.user.firstName} {repayment.user.lastName}
                    </h3>
                    <Badge variant={
                      repayment.status === 'APPROVED' ? 'success' :
                      repayment.status === 'REJECTED' ? 'error' : 'warning'
                    }>
                      {repayment.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{repayment.user.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-medium">
                        ₦{Number(repayment.amountNaira).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(repayment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {repayment.transferReference && (
                      <div>
                        <span className="text-gray-500">Transfer Reference:</span>
                        <span className="ml-2 font-mono text-xs">{repayment.transferReference}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <span className="ml-2 font-mono text-xs">{repayment.user.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 space-y-2">
                  {repayment.proofImagePath && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.open(repayment.proofImagePath!, '_blank');
                      }}
                    >
                      View Proof
                    </Button>
                  )}
                  {repayment.status === "PENDING" && (
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRejectRepayment(repayment.id)}
                        disabled={approveRepaymentMutation.isPending || rejectRepaymentMutation.isPending}
                      >
                        {rejectRepaymentMutation.isPending ? "Rejecting..." : "Reject"}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveRepayment(repayment.id)}
                        disabled={approveRepaymentMutation.isPending || rejectRepaymentMutation.isPending}
                      >
                        {approveRepaymentMutation.isPending ? "Approving..." : "Approve"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}
