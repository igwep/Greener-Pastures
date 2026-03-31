import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  useApproveDepositMutation,
  useRejectDepositMutation,
  useAdminAllDepositsQuery,
} from "../../services/admin/hooks";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export function DepositsPage() {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | undefined>(
    "PENDING",
  );
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

  const getStatusColor = (depositStatus: string) => {
    switch (depositStatus) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deposits Management</h1>
        <p className="text-gray-600 mt-1">Manage and process deposit requests</p>
      </div>

      {/* Status Filter Tabs */}
      <Card className="p-0">
        <div className="flex flex-wrap gap-1 p-1">
          {[
            { value: undefined, label: 'ALL' },
            { value: 'PENDING', label: 'PENDING' },
            { value: 'APPROVED', label: 'APPROVED' },
            { value: 'REJECTED', label: 'REJECTED' }
          ].map((statusOption) => (
            <button
              key={statusOption.label}
              onClick={() => setStatus(statusOption.value as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors relative ${
                status === statusOption.value
                  ? 'bg-ajo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{statusOption.label}</span>
              {status === statusOption.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-ajo-600 rounded-lg -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Search and Sort Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
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

      {/* Deposits List */}
      <Card className="divide-y divide-gray-200">
        {isDepositsLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading deposits...
          </div>
        ) : paginatedDeposits.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No deposits found
          </div>
        ) : (
          paginatedDeposits.map((deposit) => (
            <div
              key={deposit.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={getStatusColor(deposit.status)}>
                      {deposit.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ID: {deposit.id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">User:</span>
                        <span className="text-sm font-medium">
                          {deposit.user.firstName} {deposit.user.lastName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm">{deposit.user.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-lg font-bold text-ajo-600">
                          ₦{Number(deposit.amountNaira).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium">{deposit.paymentMethod}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Reference:</span>
                        <span className="text-sm font-mono">{deposit.transferReference || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="text-sm">
                          {new Date(deposit.createdAt).toLocaleDateString()} • 
                          {new Date(deposit.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col gap-2">
                  {deposit.proofImagePath ? (
                    <button
                      type="button"
                      onClick={() => window.open(deposit.proofImagePath!, "_blank")}
                      className="w-28 sm:w-32 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                      aria-label="View proof image"
                    >
                      <img
                        src={deposit.proofImagePath}
                        alt="Deposit proof"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ) : null}

                  {deposit.status === 'PENDING' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveDeposit(deposit.id)}
                        disabled={approveDepositMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        {approveDepositMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRejectDeposit(deposit.id)}
                        disabled={rejectDepositMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        {rejectDepositMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </>
                  )}
                  
                  {deposit.status === 'APPROVED' && (
                    <Badge variant="success" className="whitespace-nowrap">
                      Approved
                    </Badge>
                  )}
                  
                  {deposit.status === 'REJECTED' && (
                    <Badge variant="error" className="whitespace-nowrap">
                      Rejected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
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
