import React, { useState, useMemo } from "react";
import { Input } from "../../components/ui/Input";
import {
  useAdminUsersQuery,
  useAdminUserFullDataQuery,
} from "../../services/admin/hooks";
import {
  AdminUserSummary,
  AdminUserFullData,
  LedgerEntry,
} from "../../services/admin/actions";
import { useDebounce } from "../../hooks/useDebounce";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { formatNaira } from "../../utils/formatters";

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading } = useAdminUsersQuery({
    q: debouncedSearchTerm,
    limit: 20,
  });

  const users = useMemo(() => data?.users ?? [], [data]);

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
          />
        ))}
      </div>

      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

function UserCard({
  user,
  onClick,
}: {
  user: AdminUserSummary;
  onClick: () => void;
}) {
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
  const { data, isLoading } = useAdminUserFullDataQuery(userId);

  const user = data?.user;

  // Log user full details to console when modal opens
  console.log('User Full Details:', user);

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
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
            {/* User Basic Info */}
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={user.isActive ? 'success' : 'error'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Plan Information */}
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-3">Plan Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Selected Plan</p>
                  <p className="font-medium">{user.selectedPlan?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contribution Amount</p>
                  <p className="font-medium">{formatNaira(user.planContributionAmountNaira)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan Started</p>
                  <p className="font-medium">{user.planStartedAt ? new Date(user.planStartedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan Expires</p>
                  <p className="font-medium">{user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </Card>

            {/* Balance Information */}
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-3">Balance Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Main Balance</p>
                  <p className="font-medium text-green-600">{formatNaira(user.mainBalanceNaira)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loan Balance</p>
                  <p className="font-medium text-red-600">{formatNaira(user.loanBalanceNaira)}</p>
                </div>
              </div>
            </Card>

            {/* Payment Statistics */}
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-3">Payment Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Cycle Paid Days</p>
                  <p className="font-medium">{user.currentCyclePaidDays || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Cycle Paid Amount</p>
                  <p className="font-medium">{formatNaira(user.currentCyclePaidAmountNaira)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Paid Days</p>
                  <p className="font-medium">{user.totalPaidDays || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Paid Amount</p>
                  <p className="font-medium">{formatNaira(user.totalPaidAmountNaira)}</p>
                </div>
              </div>
            </Card>

            {/* Recent Deposits */}
            <Card className="p-4">
              <h3 className="text-lg font-bold mb-3">Recent Deposits ({user.deposits?.length || 0})</h3>
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
                      {user.deposits.slice(0, 5).map((deposit, index) => (
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
            </Card>

            {/* Recent Loan Applications */}
            <Card className="p-4">
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

function LedgerTable({ entries }: { entries: LedgerEntry[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {entries.map((entry, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {entry.description}
            </td>
            <td
              className={`px-6 py-4 whitespace-nowrap text-sm text-right ${entry.amount > 0 ? "text-green-500" : "text-red-500"}`}
            >
              {formatNaira(entry.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
