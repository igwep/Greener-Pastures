import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpRightIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  BanknoteIcon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
  EyeIcon
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { 
  useAdminWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
  useMarkWithdrawalAsPaidMutation
} from '../../services/admin/hooks'
import { showSuccessToast, showErrorToast } from '../../utils/toast'

const formatNaira = (amount: number) => `₦${amount.toLocaleString()}`

type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'

export function WithdrawalsPage() {
  const [selectedStatus, setSelectedStatus] = useState<WithdrawalStatus | 'ALL'>('ALL')
  
  const { data: withdrawalsData, isLoading } = useAdminWithdrawalsQuery();
  console.log('Admin Withdrawals Response:', withdrawalsData);
  const approveMutation = useApproveWithdrawalMutation()
  const rejectMutation = useRejectWithdrawalMutation()
  const markPaidMutation = useMarkWithdrawalAsPaidMutation()

  const withdrawals = withdrawalsData?.withdrawals || []
  
  const filteredWithdrawals = withdrawals.filter(withdrawal => 
    selectedStatus === 'ALL' || withdrawal.status === selectedStatus
  )

  const getStatusColor = (status: WithdrawalStatus) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'APPROVED':
        return 'info'
      case 'PAID':
        return 'success'
      case 'REJECTED':
        return 'error'
      default:
        return 'neutral'
    }
  }

  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="w-4 h-4" />
      case 'APPROVED':
        return <EyeIcon className="w-4 h-4" />
      case 'PAID':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'REJECTED':
        return <XCircleIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  const handleApprove = async (withdrawalId: string) => {
    try {
      await approveMutation.mutateAsync({
        withdrawalId,
        data: {
          amountNaira: withdrawals.find(w => w.id === withdrawalId)?.amountNaira || '0',
          note: ''
        }
      })
      showSuccessToast('Withdrawal approved successfully')
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to approve withdrawal')
    }
  }

  const handleReject = async (withdrawalId: string) => {
    try {
      await rejectMutation.mutateAsync({
        withdrawalId,
        data: { note: '' }
      })
      showSuccessToast('Withdrawal rejected successfully')
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to reject withdrawal')
    }
  }

  const handleMarkAsPaid = async (withdrawalId: string) => {
    try {
      await markPaidMutation.mutateAsync({
        withdrawalId,
        data: { note: '' }
      })
      showSuccessToast('Withdrawal marked as paid successfully')
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to mark withdrawal as paid')
    }
  }

  const statusCounts = {
    ALL: withdrawals.length,
    PENDING: withdrawals.filter(w => w.status === 'PENDING').length,
    APPROVED: withdrawals.filter(w => w.status === 'APPROVED').length,
    PAID: withdrawals.filter(w => w.status === 'PAID').length,
    REJECTED: withdrawals.filter(w => w.status === 'REJECTED').length,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals Management</h1>
        <p className="text-gray-600 mt-1">Manage and process withdrawal requests</p>
      </div>

      {/* Status Filter Tabs */}
      <Card className="p-0">
        <div className="flex flex-wrap gap-1 p-1">
          {(['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors relative ${
                selectedStatus === status
                  ? 'bg-ajo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(status as WithdrawalStatus)}
                <span>{status}</span>
                <Badge 
                  variant={selectedStatus === status ? 'neutral' : 'warning'}
                  className="text-xs"
                >
                  {statusCounts[status]}
                </Badge>
              </div>
              {selectedStatus === status && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-ajo-600 rounded-lg -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Withdrawals List */}
      <Card className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading withdrawals...
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No withdrawals found for {selectedStatus.toLowerCase()} status
          </div>
        ) : (
          filteredWithdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={getStatusColor(withdrawal.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(withdrawal.status)}
                        <span>{withdrawal.status}</span>
                      </div>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ID: {withdrawal.id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">User:</span>
                        <span className="text-sm font-medium">
                          {withdrawal.user?.firstName || withdrawal.user?.lastName
                            ? `${withdrawal.user?.firstName ?? ''} ${withdrawal.user?.lastName ?? ''}`.trim()
                            : withdrawal.userId}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium">
                          {withdrawal.user?.email ?? '—'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BanknoteIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="text-lg font-bold text-ajo-600">
                          {formatNaira(Number(withdrawal.amountNaira))}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Requested:</span>
                        <span className="text-sm">
                          {new Date(withdrawal.createdAt).toLocaleDateString()} • 
                          {new Date(withdrawal.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BuildingIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Bank:</span>
                        <span className="text-sm font-medium">{withdrawal.bankAccount.bankName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Account Name:</span>
                        <span className="text-sm font-medium">{withdrawal.bankAccount.accountName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ArrowUpRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Account Number:</span>
                        <span className="text-sm font-mono font-medium">
                          {withdrawal.bankAccount.accountNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col gap-2">
                  {withdrawal.status === 'PENDING' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(withdrawal.id)}
                        disabled={approveMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        {approveMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(withdrawal.id)}
                        disabled={rejectMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </>
                  )}
                  
                  {withdrawal.status === 'APPROVED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleMarkAsPaid(withdrawal.id)}
                      disabled={markPaidMutation.isPending}
                      className="whitespace-nowrap"
                    >
                      {markPaidMutation.isPending ? 'Marking...' : 'Mark as Paid'}
                    </Button>
                  )}
                  
                  {withdrawal.status === 'PAID' && (
                    <Badge variant="success" className="whitespace-nowrap">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  )}
                  
                  {withdrawal.status === 'REJECTED' && (
                    <Badge variant="error" className="whitespace-nowrap">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      Rejected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </motion.div>
  )
}
