import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowDownLeftIcon, ArrowUpRightIcon, PlusIcon, WalletIcon } from 'lucide-react';
import { useDashboardSummaryQuery } from '../services/dashboard/hooks';
import { useLoanRepaymentsQuery } from '../services/loans/hooks';
import { getStoredUser } from '../services/auth/session';
export function WalletPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  
  const { data: summary, isLoading } = useDashboardSummaryQuery();
  const { data: loanRepaymentsData } = useLoanRepaymentsQuery();
  const storedUser = getStoredUser();
  const user = summary?.user ?? storedUser;

  const isContributionTx = (tx: any) => {
    const kind = tx?.kind ?? tx?.transaction?.kind;
    return kind === 'AJO_CONTRIBUTION';
  };

  const isWithdrawalTx = (tx: any) => {
    const t = String(tx?.type ?? '').toUpperCase();
    return t === 'DEBIT' || t === 'WITHDRAW' || t === 'WITHDRAWAL' || t === 'WITHDRAW_REQUEST' || t === 'WITHDRAWAL_REQUEST';
  };

  const isDepositTx = (tx: any) => {
    const t = String(tx?.type ?? '').toUpperCase();
    return t === 'CREDIT' || t === 'DEPOSIT';
  };

  // Calculate wallet balance
  const walletBalanceNaira = useMemo(() => {
    const balanceRaw = (user as any)?.wallet?.balanceNaira;
    const balanceNumber = typeof balanceRaw === 'string' ? Number(balanceRaw) : NaN;
    return Number.isFinite(balanceNumber) ? balanceNumber : 0;
  }, [user]);

  // Get transactions from API
  const transactions = useMemo(() => {
    const regularTx = summary?.recentTransactions ?? [];
    const loanRepayments = loanRepaymentsData?.repayments ?? [];
    
    // Combine regular transactions with loan repayments
    const allTransactions = [
      ...regularTx,
      ...loanRepayments.map((repayment: any) => ({
        id: repayment.id,
        createdAt: repayment.createdAt,
        amountNaira: repayment.amountNaira,
        type: "DEBIT", // Loan repayments are debits from user's perspective
        transaction: {
          note: `Loan Repayment${repayment.status === 'PENDING' ? ' (Pending)' : repayment.status === 'REJECTED' ? ' (Rejected)' : ' (Approved)'}`,
          kind: "Loan Repayment"
        },
        isLoanRepayment: true,
        status: repayment.status
      }))
    ];
    
    // Sort by date (newest first)
    return allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [summary, loanRepaymentsData]);

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'deposits') return transactions.filter((tx: any) => isDepositTx(tx) && !isContributionTx(tx));
    if (activeTab === 'withdrawals') return transactions.filter((tx: any) => isWithdrawalTx(tx) && !isContributionTx(tx));
    if (activeTab === 'contributions') {
      return transactions
        .filter(isContributionTx)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return transactions;
  }, [transactions, activeTab]);

  // Pagination logic
  const paginatedTransactions = useMemo(() => {
    if (activeTab === 'all') {
      // For "all" tab, use all transactions in date order and apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      return transactions.slice(startIndex, startIndex + itemsPerPage);
    }
    return filteredTransactions.slice(0, 5);
  }, [transactions, filteredTransactions, currentPage, activeTab]);

  const totalPages = useMemo(() => {
    if (activeTab === 'all') {
      // Calculate based on all transactions in date order
      return Math.ceil(transactions.length / itemsPerPage);
    }
    return 1;
  }, [transactions, filteredTransactions, currentPage, activeTab]);

  // Format transaction data for display
  const formattedTransactions = useMemo(() => {
    // Use paginatedTransactions for "all" tab, filteredTransactions for other tabs
    const transactionsToFormat = activeTab === 'all' ? (paginatedTransactions || []) : filteredTransactions;

    return transactionsToFormat.map(tx => {
      const amount = Number(tx.amountNaira);
      const date = new Date(tx.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ' • ' + date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return {
        id: tx.id,
        desc: tx.transaction?.note || tx.transaction?.kind || 'Transaction',
        date: formattedDate,
        amount: isWithdrawalTx(tx) ? -amount : amount,
        status: tx.isLoanRepayment ? tx.status : 'Completed',
        type: (isDepositTx(tx) ? 'credit' : 'debit') as 'credit' | 'debit',
        ref: (tx.transaction as any)?.referenceId || tx.id,
        isLoanRepayment: tx.isLoanRepayment || false
      };
    });
  }, [paginatedTransactions, filteredTransactions, currentPage, activeTab]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="space-y-8 max-w-5xl mx-auto pb-12">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink tracking-tight">Wallet</h1>
      </div>

      <Card className="animated-border animated-border-dark bg-ajo-900 text-white relative overflow-visible flex flex-col justify-between p-8 rounded-3xl border-none shadow-lg">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-20 rounded-3xl"
          style={{
            backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-ajo-100">
            <WalletIcon className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Wallet Balance
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="text-5xl font-bold mb-1 tracking-tight">
              ₦{walletBalanceNaira.toLocaleString()}
            </div>
            <div className="text-sm text-ajo-200">
              Available for withdrawal
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-white text-ajo-900 hover:bg-gray-100 rounded-xl h-10 px-4 text-sm font-semibold"
              onClick={() => navigate('/dashboard')}>
              <PlusIcon className="w-4 h-4 mr-1.5" /> Add Money
            </Button>
            <Link to="/withdraw">
              <Button
                variant="secondary"
                className="bg-transparent border-ajo-700 text-white hover:bg-ajo-800 rounded-xl h-10 px-4 text-sm font-semibold">
                
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-8 flex gap-8 bg-gray-50">
          {['all', 'deposits', 'withdrawals', 'contributions'].map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-5 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-ajo-600' : 'text-gray-500 hover:text-gray-700'}`}>
            
              {tab}
              {activeTab === tab &&
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-ajo-600" />

            }
          </button>
          )}
        </div>
        
        {/* Transaction List */}
        <div className="divide-y divide-gray-200">
          {formattedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-6 sm:px-8 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                {tx.isLoanRepayment ? (
                  <ArrowUpRightIcon className="w-6 h-6" />
                ) : tx.type === 'credit' ? (
                  <ArrowDownLeftIcon className="w-6 h-6" />
                ) : (
                  <ArrowUpRightIcon className="w-6 h-6" />
                )}
                <div>
                  <p className="font-bold text-gray-900 text-base">{tx.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm text-gray-500">{tx.date}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                      {tx.ref}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-black text-xl tracking-tight ${tx.type === 'credit' ? 'text-ajo-600' : 'text-gray-900'}`}
                >
                  {tx.amount > 0 ? '+' : ''}₦
                  {Math.abs(tx.amount).toLocaleString()}
                </p>
                <Badge
                  variant={tx.status === 'Completed' ? 'success' : 'warning'}
                  className={`mt-2 ${
                    tx.isLoanRepayment 
                      ? tx.status === 'PENDING' 
                        ? "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200"
                        : tx.status === 'REJECTED'
                        ? "bg-red-100 text-red-700 group-hover:bg-red-200"
                        : "bg-green-100 text-green-700 group-hover:bg-green-200"
                      : ""
                  }`}
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination Controls - Only show for "all" tab */}
      {activeTab === 'all' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
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
    </motion.div>);

}