import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  useAdminDepositsQuery,
  useApproveDepositMutation,
  useRejectDepositMutation,
  useAdminAllDepositsQuery,
} from "../../services/admin/hooks";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export function DepositsAndWithdrawals() {
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals">(
    "deposits",
  );
  const [depositStatus, setDepositStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | undefined>(
    "PENDING",
  );

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === "deposits" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("deposits")}
        >
          Deposits
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "withdrawals" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("withdrawals")}
        >
          Withdrawals
        </button>
      </div>

      {activeTab === "deposits" && (
        <DepositsView status={depositStatus} setStatus={setDepositStatus} />
      )}
      {activeTab === "withdrawals" && (
        <div className="mt-4">
          <p>Withdrawals view is not implemented yet.</p>
        </div>
      )}
    </div>
  );
}

function DepositsView({ status, setStatus }: { 
  status: "PENDING" | "APPROVED" | "REJECTED" | undefined; 
  setStatus: (status: "PENDING" | "APPROVED" | "REJECTED" | undefined) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSortOrder, setDateSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const depositsPerPage = 4;

  const { data: depositsData, isLoading: isDepositsLoading } = useAdminAllDepositsQuery();

  // Log the deposits response to console
  console.log('All Deposits Response:', depositsData);

  const deposits = useMemo(() => {
    if (!depositsData?.deposits) return [];
    
    let filteredDeposits = [...depositsData.deposits];
    
    // Filter by status
    if (status) {
      filteredDeposits = filteredDeposits.filter(deposit => deposit.status === status);
    }
    
    // Filter by name search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredDeposits = filteredDeposits.filter(deposit => 
        `${deposit.user.firstName} ${deposit.user.lastName}`.toLowerCase().includes(searchLower) ||
        deposit.user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date
    filteredDeposits.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filteredDeposits;
  }, [depositsData, status, searchTerm, dateSortOrder]);

  // Pagination
  const totalPages = Math.ceil(deposits.length / depositsPerPage);
  const startIndex = (currentPage - 1) * depositsPerPage;
  const paginatedDeposits = deposits.slice(startIndex, startIndex + depositsPerPage);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [status, searchTerm, dateSortOrder]);

  const approveDepositMutation = useApproveDepositMutation();
  const rejectDepositMutation = useRejectDepositMutation();

  const handleApproveDeposit = async (depositId: string) => {
    try {
      await approveDepositMutation.mutateAsync({ depositId });
      showSuccessToast('Deposit approved successfully!');
    } catch (error) {
      showErrorToast(error, 'Failed to approve deposit.');
    }
  };

  const handleRejectDeposit = async (depositId: string) => {
    try {
      await rejectDepositMutation.mutateAsync({ depositId });
      showSuccessToast('Deposit rejected successfully!');
    } catch (error) {
      showErrorToast(error, 'Failed to reject deposit.');
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

      <div className="flex mb-4">
        <button
          className={`px-3 py-1 rounded-md ${status === "PENDING" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("PENDING")}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 rounded-md ml-2 ${status === "APPROVED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("APPROVED")}
        >
          Approved
        </button>
        <button
          className={`px-3 py-1 rounded-md ml-2 ${status === "REJECTED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setStatus("REJECTED")}
        >
          Rejected
        </button>
      </div>

      {isDepositsLoading ? (
        <div className="text-center py-8">Loading deposits...</div>
      ) : paginatedDeposits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No deposits found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedDeposits.map((deposit) => (
            <Card key={deposit.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {deposit.user.firstName} {deposit.user.lastName}
                    </h3>
                    <Badge variant={
                      deposit.status === 'APPROVED' ? 'success' :
                      deposit.status === 'REJECTED' ? 'error' : 'warning'
                    }>
                      {deposit.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{deposit.user.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-medium">
                        ₦{Number(deposit.amountNaira).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Amount:</span>
                      <span className="ml-2 font-medium">
                        ₦{Number(deposit.expectedAmountNaira).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="ml-2 font-medium">{deposit.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(deposit.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {deposit.transferReference && (
                      <div>
                        <span className="text-gray-500">Transfer Reference:</span>
                        <span className="ml-2 font-mono text-xs">{deposit.transferReference}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <span className="ml-2 font-mono text-xs">{deposit.userId}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 space-y-2">
                  {deposit.proofImagePath && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.open(deposit.proofImagePath!, '_blank');
                      }}
                    >
                      View Proof
                    </Button>
                  )}
                  {status === "PENDING" && (
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRejectDeposit(deposit.id)}
                        disabled={approveDepositMutation.isPending || rejectDepositMutation.isPending}
                      >
                        {rejectDepositMutation.isPending ? "Rejecting..." : "Reject"}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveDeposit(deposit.id)}
                        disabled={approveDepositMutation.isPending || rejectDepositMutation.isPending}
                      >
                        {approveDepositMutation.isPending ? "Approving..." : "Approve"}
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
