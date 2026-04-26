import React, { useState, useMemo } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Pagination } from "../../components/ui/Pagination";
import {
  useAdminUsersQuery,
  useAdminUserFullDataQuery,
  useDeleteAdminUserMutation,
} from "../../services/admin/hooks";
import {
  AdminUserSummary,
} from "../../services/admin/actions";
import { useDebounce } from "../../hooks/useDebounce";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { formatNaira } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { useQueryClient } from '@tanstack/react-query';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const deleteMutation = useDeleteAdminUserMutation();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data, isLoading } = useAdminUsersQuery({
    q: debouncedSearchTerm,
    limit: itemsPerPage,
    page: currentPage,
  });

  const users = useMemo(() => data?.users ?? [], [data]);
  const pagination = data?.pagination;
  
  // Fallback pagination data if backend doesn't return it
  const fallbackPagination = {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    page: currentPage,
    totalCount: users.length,
    totalPages: Math.max(1, Math.ceil(users.length / itemsPerPage)),
    hasNextPage: false,
    hasPreviousPage: currentPage > 1
  };
  
  const paginationData = pagination || fallbackPagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete, {
        onSuccess: () => {
          toast.success('User deleted successfully');
          setUserToDelete(null);
          // Refresh current page to update the list
          queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
        onError: (error) => {
          toast.error('Failed to delete user');
          console.error('Delete user error:', error);
        }
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p>Loading users...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() => setSelectedUserId(user.id)}
            onDelete={() => handleDeleteUser(user.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {(paginationData || users.length > 0) && (
        <Pagination
          currentPage={paginationData?.page ?? currentPage}
          totalPages={paginationData?.totalPages ?? 1}
          totalItems={paginationData?.totalCount ?? users.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {userToDelete && (
        <DeleteConfirmModal
          userId={userToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setUserToDelete(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

function UserCard({
  user,
  onClick,
  onDelete,
}: {
  user: AdminUserSummary;
  onClick: () => void;
  onDelete: () => void;
}) {
  const canDelete = user.email !== 'marketplace-admin@system.local';
  
  return (
    <Card className="p-4 cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="font-bold">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <div className="text-xs text-gray-500">Main Balance</div>
          <div className="font-bold">{formatNaira(user.mainBalanceNaira)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Loan Balance</div>
          <div className="font-bold text-red-500">
            {formatNaira(user.loanBalanceNaira)}
          </div>
        </div>
      </div>
      {canDelete && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-full"
          >
            Delete User
          </Button>
        </div>
      )}
    </Card>
  );
}

function UserDetailModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [depositsCursor, setDepositsCursor] = useState<string | null>(null);
  const [withdrawalsCursor, setWithdrawalsCursor] = useState<string | null>(null);
  const [depositsLimit] = useState(20);
  const [withdrawalsLimit] = useState(20);

  const { data, isLoading, isFetching } = useAdminUserFullDataQuery(userId, {
    depositsLimit,
    withdrawalsLimit,
    depositsCursor: depositsCursor || undefined,
    withdrawalsCursor: withdrawalsCursor || undefined,
  });

  const user = data?.user;
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="User Details">
        <div className="p-6">
          <p>Loading user details...</p>
        </div>
      </Modal>
    );
  }

  if (!user) {
    return (
      <Modal isOpen={true} onClose={onClose} title="User Details">
        <div className="p-6">
          <p>No user data available.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="User Details">
      <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto max-w-4xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
            {/* User Basic Info */}
            <Card className="p-3 sm:p-4">
              <h3 className="text-lg font-bold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-base">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium text-base break-all">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium text-base">{user.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Status</p>
                  <Badge variant={user.isActive ? 'success' : 'error'} className="text-sm">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Plan Information */}
            <Card className="p-3 sm:p-4">
              <h3 className="text-lg font-bold mb-4">Plan Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Selected Plan</p>
                  <p className="font-medium text-base">{user.selectedPlan?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contribution Amount</p>
                  <p className="font-medium text-base">{formatNaira(user.planContributionAmountNaira)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Plan Started</p>
                  <p className="font-medium text-base">{user.planStartedAt ? new Date(user.planStartedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Plan Expires</p>
                  <p className="font-medium text-base">{user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </Card>

            {/* Balance Information */}
            <Card className="p-3 sm:p-4">
              <h3 className="text-lg font-bold mb-4">Balance Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Main Balance</p>
                  <p className="font-medium text-base text-green-600">{formatNaira(user.mainBalanceNaira)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Loan Balance</p>
                  <p className="font-medium text-base text-red-600">{formatNaira(user.loanBalanceNaira)}</p>
                </div>
              </div>
            </Card>

            {/* Payment Statistics */}
            <Card className="p-3 sm:p-4">
              <h3 className="text-lg font-bold mb-4">Payment Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Cycle Paid Days</p>
                  <p className="font-medium text-base">{user.currentCyclePaidDays || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Cycle Paid Amount</p>
                  <p className="font-medium text-base">{formatNaira(user.currentCyclePaidAmountNaira)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Paid Days</p>
                  <p className="font-medium text-base">{user.totalPaidDays || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Paid Amount</p>
                  <p className="font-medium text-base">{formatNaira(user.totalPaidAmountNaira)}</p>
                </div>
              </div>
            </Card>

            {/* Recent Deposits */}
            <Card className="p-3 sm:p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Recent Deposits ({user.deposits?.length || 0})</h3>
                {pagination?.deposits?.nextCursor && (
                  <Button
                    size="sm"
                    onClick={() => setDepositsCursor(pagination.deposits.nextCursor)}
                    disabled={isFetching}
                    className="text-xs"
                  >
                    {isFetching ? 'Loading...' : 'Load More'}
                  </Button>
                )}
              </div>
              {user.deposits && user.deposits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.deposits.map((deposit, index) => (
                        <tr key={deposit.id || index}>
                          <td className="px-4 py-2 text-sm">{deposit.createdAt ? new Date(deposit.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">{deposit.amountNaira ? formatNaira(deposit.amountNaira) : 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant={deposit.status === 'APPROVED' ? 'success' : deposit.status === 'REJECTED' ? 'error' : 'warning'}>
                              {deposit.status || 'UNKNOWN'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No deposits found</p>
              )}
              {depositsCursor && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDepositsCursor(null)}
                    disabled={isFetching}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </Card>

            {/* Recent Withdrawals */}
            <Card className="p-3 sm:p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Recent Withdrawals ({user.withdrawals?.length || 0})</h3>
                {pagination?.withdrawals?.nextCursor && (
                  <Button
                    size="sm"
                    onClick={() => setWithdrawalsCursor(pagination.withdrawals.nextCursor)}
                    disabled={isFetching}
                    className="text-xs"
                  >
                    {isFetching ? 'Loading...' : 'Load More'}
                  </Button>
                )}
              </div>
              {user.withdrawals && user.withdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.withdrawals.map((withdrawal, index) => (
                        <tr key={withdrawal.id || index}>
                          <td className="px-4 py-2 text-sm">{withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">{withdrawal.amountNaira ? formatNaira(withdrawal.amountNaira) : 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant={withdrawal.status === 'APPROVED' ? 'success' : withdrawal.status === 'PAID' ? 'neutral' : withdrawal.status === 'REJECTED' ? 'error' : 'warning'}>
                              {withdrawal.status || 'UNKNOWN'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No withdrawals found</p>
              )}
              {withdrawalsCursor && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setWithdrawalsCursor(null)}
                    disabled={isFetching}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </Card>

            {/* Recent Loan Applications */}
            <Card className="p-3 sm:p-4">
              <h3 className="text-lg font-bold mb-3">Loan Applications ({user.loanApplications?.length || 0})</h3>
              {user.loanApplications && user.loanApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.loanApplications.slice(0, 5).map((loan, index) => (
                        <tr key={loan.id || index}>
                          <td className="px-4 py-2 text-sm">{loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">{loan.requestedAmountNaira ? formatNaira(loan.requestedAmountNaira) : 'N/A'}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant={loan.status === 'APPROVED' ? 'success' : loan.status === 'DISBURSED' ? 'neutral' : 'warning'}>
                              {loan.status || 'UNKNOWN'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No loan applications found</p>
              )}
            </Card>
          </div>
      </div>
    </Modal>
  );
}

function DeleteConfirmModal({
  userId,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  userId: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const { data } = useAdminUsersQuery({ q: '', limit: 1 });
  const user = data?.users?.find(u => u.id === userId);

  return (
    <Modal
      isOpen={true}
      onClose={isDeleting ? () => undefined : onCancel}
      title="Confirm Delete User"
      footer={
        <div className="flex gap-3 w-full">
          <Button 
            variant="ghost" 
            className="flex-1" 
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </Button>
        </div>
      }
    >
      <div className="text-sm text-ink-secondary">
        Are you sure you want to delete this user? This action cannot be undone.
        {user && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-ink">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        )}
      </div>
    </Modal>
  );
}
