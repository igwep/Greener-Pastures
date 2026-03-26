import React, { useMemo, useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAdminAllLoansQuery, useApproveLoanMutation, useDisburseLoanMutation, useRejectLoanMutation } from "../../services/admin/hooks";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export function Loans() {
  const [loanStatusFilter, setLoanStatusFilter] = useState<
    "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED" | undefined
  >("PENDING");
  
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSortOrder, setDateSortOrder] = useState<"newest" | "oldest">("newest");

  const { data: loansData, isLoading: isLoansLoading } = useAdminAllLoansQuery();
  const approveLoanMutation = useApproveLoanMutation();
  const disburseLoanMutation = useDisburseLoanMutation();
  const rejectLoanMutation = useRejectLoanMutation();

  const loans = useMemo(() => {
    if (!loansData?.loans) return [];
    
    let filteredLoans = [...loansData.loans];
    
    // Filter by status
    if (loanStatusFilter) {
      filteredLoans = filteredLoans.filter(loan => loan.status === loanStatusFilter);
    }
    
    // Filter by name search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredLoans = filteredLoans.filter(loan => 
        `${loan.user.firstName} ${loan.user.lastName}`.toLowerCase().includes(searchLower) ||
        loan.user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date
    filteredLoans.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filteredLoans;
  }, [loansData, loanStatusFilter, searchTerm, dateSortOrder]);

  // Pagination
  const totalPages = Math.ceil(loans.length / loansPerPage);
  const paginatedLoans = useMemo(() => {
    const startIndex = (currentPage - 1) * loansPerPage;
    return loans.slice(startIndex, startIndex + loansPerPage);
  }, [loans, currentPage, loansPerPage]);

  const [approveLoanId, setApproveLoanId] = useState<string | null>(null);
  const [approveAmount, setApproveLoanAmount] = useState("");
  const [approveNote, setApproveLoanNote] = useState("");
  const [disburseLoanId, setDisburseLoanId] = useState<string | null>(null);
  const [disburseAmount, setDisburseAmount] = useState("");
  const [disburseNote, setDisburseNote] = useState("");

  const handleApproveLoanSubmit = async () => {
    if (!approveLoanId || !approveAmount) return;
    
    // Validate that approveAmount is a valid number
    const numericAmount = Number(approveAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showErrorToast(new Error("Please enter a valid amount"), "Invalid amount");
      return;
    }
    
    try {
      console.log('Approving loan:', { approveLoanId, approveAmount, approveNote });
      
      // Only include note if it has a value
      const requestData: any = { approvedAmountNaira: approveAmount };
      if (approveNote.trim()) {
        requestData.note = approveNote;
      }
      
      console.log('Request data being sent:', requestData);
      
      await approveLoanMutation.mutateAsync({
        loanApplicationId: approveLoanId,
        data: requestData,
      });
      showSuccessToast("Loan approved successfully!");
      setDisburseLoanId(approveLoanId);
      setDisburseAmount(approveAmount);
      setApproveLoanId(null);
      setApproveLoanAmount("");
      setApproveLoanNote("");
    } catch (error) {
      console.error('Error approving loan:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      showErrorToast(error, "Failed to approve loan.");
    }
  };

  const handleDisburseLoan = async (id: string, amount: string) => {
    setDisburseLoanId(id);
    setDisburseAmount(amount);
    setDisburseNote("");
  };

  const handleDisburseLoanSubmit = async () => {
    if (!disburseLoanId) return;
    try {
      console.log('Disbursing loan:', { disburseLoanId, disburseNote });
      
      const requestData: any = {};
      if (disburseNote.trim()) {
        requestData.note = disburseNote;
      }
      
      console.log('Disburse request data:', requestData);
      
      await disburseLoanMutation.mutateAsync({
        loanApplicationId: disburseLoanId,
        data: requestData,
      });
      showSuccessToast("Loan disbursed successfully!");
      setDisburseLoanId(null);
      setDisburseAmount("");
      setDisburseNote("");
    } catch (error) {
      console.error('Error disbursing loan:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      showErrorToast(error, "Failed to disburse loan.");
    }
  };

  const handleRejectLoan = async (id: string) => {
    const note = window.prompt("Enter rejection reason:");
    if (note === null) return;
    try {
      await rejectLoanMutation.mutateAsync({ loanApplicationId: id, data: { note } });
      showSuccessToast("Loan rejected successfully!");
    } catch (error) {
      showErrorToast(error, "Failed to reject loan.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Loan Management</h1>
        
        {/* Search and Filters */}
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
            variant={!loanStatusFilter ? "primary" : "ghost"}
            onClick={() => setLoanStatusFilter(undefined)}
          >
            All
          </Button>
          <Button
            variant={loanStatusFilter === "PENDING" ? "primary" : "ghost"}
            onClick={() => setLoanStatusFilter("PENDING")}
          >
            Pending
          </Button>
          <Button
            variant={loanStatusFilter === "APPROVED" ? "primary" : "ghost"}
            onClick={() => setLoanStatusFilter("APPROVED")}
          >
            Approved
          </Button>
          <Button
            variant={loanStatusFilter === "DISBURSED" ? "primary" : "ghost"}
            onClick={() => setLoanStatusFilter("DISBURSED")}
          >
            Disbursed
          </Button>
          <Button
            variant={loanStatusFilter === "REJECTED" ? "primary" : "ghost"}
            onClick={() => setLoanStatusFilter("REJECTED")}
          >
            Rejected
          </Button>
        </div>
      </div>

      {isLoansLoading ? (
        <div className="text-center py-8">Loading loans...</div>
      ) : paginatedLoans.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No loans found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedLoans.map((loan) => (
            <Card key={loan.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {loan.user.firstName} {loan.user.lastName}
                    </h3>
                    <Badge variant={
                      loan.status === 'APPROVED' ? 'success' :
                      loan.status === 'DISBURSED' ? 'neutral' :
                      loan.status === 'REJECTED' ? 'error' : 'warning'
                    }>
                      {loan.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{loan.user.email}</p>
                  <p className="text-sm text-gray-600 mb-2">{loan.reason}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-medium">
                        ₦{Number(loan.requestedAmountNaira).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Type:</span>
                      <span className="ml-2 font-medium">{loan.loanType.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Amount:</span>
                      <span className="ml-2 font-medium">
                        ₦{Number(loan.loanType.maxAmountNaira).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Interest:</span>
                      <span className="ml-2 font-medium">{loan.loanType.interestBps / 100}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Applied:</span>
                      <span className="ml-2 font-medium">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (loan.formImagePath) {
                        window.open(loan.formImagePath, '_blank');
                      } else {
                        showErrorToast(new Error('No form image available'), 'Form image not available');
                      }
                    }}
                  >
                    View Form
                  </Button>
                  {loan.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setApproveLoanId(loan.id)}
                        className="mr-2"
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRejectLoan(loan.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {loan.status === 'APPROVED' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleDisburseLoan(loan.id, loan.requestedAmountNaira)}
                      disabled={disburseLoanMutation.isPending}
                      isLoading={disburseLoanMutation.isPending}
                    >
                      Disburse
                    </Button>
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

      {/* Approve Loan Modal */}
      {approveLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Approve Loan Application</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approved Amount (₦)
                </label>
                <input
                  type="number"
                  value={approveAmount}
                  onChange={(e) => setApproveLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter approved amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={approveNote}
                  onChange={(e) => setApproveLoanNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any notes about this approval"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setApproveLoanId(null);
                  setApproveLoanAmount("");
                  setApproveLoanNote("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleApproveLoanSubmit}
                disabled={!approveAmount || approveLoanMutation.isPending}
                isLoading={approveLoanMutation.isPending}
                className="flex-1"
              >
                Approve Loan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Disburse Loan Modal */}
      {disburseLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Disburse Loan Funds</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  You are about to disburse <span className="font-bold">₦{Number(disburseAmount).toLocaleString()}</span> to the user's wallet.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disbursement Note (optional)
                </label>
                <textarea
                  value={disburseNote}
                  onChange={(e) => setDisburseNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any notes about this disbursement"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setDisburseLoanId(null);
                  setDisburseAmount("");
                  setDisburseNote("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDisburseLoanSubmit}
                disabled={disburseLoanMutation.isPending}
                isLoading={disburseLoanMutation.isPending}
                className="flex-1"
              >
                Disburse Funds
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
