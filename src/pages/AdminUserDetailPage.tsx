import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  ArrowLeftIcon,
  CalendarIcon,
  WalletIcon,
  CheckCircleIcon,
  UserIcon,
  SproutIcon
} from 'lucide-react';
import { useAdminUserFullDataQuery } from '../services/admin/hooks';

export function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: userDetail, isLoading, error } = useAdminUserFullDataQuery(userId ?? '');

  // Log the user detail response to console
  console.log('Admin User Detail Response:', userDetail);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (Number.isFinite(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      // Invalid date
    }
    return 'Invalid date';
  };

  const formatAmount = (amount?: string) => {
    if (!amount) return '₦0';
    const num = Number(amount);
    return Number.isFinite(num) ? `₦${num.toLocaleString()}` : '₦0';
  };

  const planStartedAt = formatDate(userDetail?.planStartedAt);
  const planExpiresAt = formatDate(userDetail?.planExpiresAt);
  const isExpired = userDetail?.planExpiresAt
    ? new Date(userDetail.planExpiresAt) < new Date()
    : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-ajo-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-ink-secondary">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !userDetail) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">Failed to load user details.</p>
          <Button onClick={() => navigate('/admin')} variant="secondary">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const user = userDetail;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-ink text-white hidden lg:flex flex-col">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800 shrink-0">
          <div className="w-8 h-8 bg-ajo-600 rounded-lg flex items-center justify-center shadow-sm">
            <SproutIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg leading-tight">
            Greener Pastures
            <br />
            <span className="text-gray-400 text-sm font-medium">Admin</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { name: 'Dashboard', path: '/admin' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Savings Plans', path: '#' },
            { name: 'Payments', path: '#' },
            { name: 'Withdrawals', path: '#' },
            { name: 'Marketplace', path: '#' }
          ].map((item, i) => (
            <a
              key={i}
              href={item.path}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.name === 'Users'
                  ? 'bg-ajo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 pb-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/admin')}
                variant="secondary"
                size="sm"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-ink tracking-tight">
                  User Details
                </h1>
                <p className="text-ink-secondary mt-1">View user plan and payment information</p>
              </div>
            </div>
            {isExpired && (
              <Badge variant="error" className="px-3 py-1.5 rounded-lg font-bold">
                Plan Expired
              </Badge>
            )}
          </div>

          {/* User Info Card */}
          <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <UserIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink mb-4">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      User ID
                    </p>
                    <p className="text-ink font-mono text-sm">{userId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      Status
                    </p>
                    <Badge variant={isExpired ? 'error' : 'success'} className="text-sm">
                      {isExpired ? 'Expired' : 'Active'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Plan Information */}
          <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink mb-4">Plan Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      Plan Duration
                    </p>
                    <p className="text-ink font-semibold">
                      {planStartedAt} → {planExpiresAt}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                        Plan Started
                      </p>
                      <p className="text-ink">{planStartedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                        Plan Expires
                      </p>
                      <p className="text-ink">{planExpiresAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Statistics */}
          <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-ajo-50 text-ajo-600 rounded-2xl">
                <WalletIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink mb-4">Payment Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      Current Cycle Paid Days
                    </p>
                    <p className="text-3xl font-black text-ink tracking-tight">
                      {user.currentCyclePaidDays ?? 0}
                    </p>
                    <p className="text-sm text-ink-secondary mt-1">
                      {formatAmount(user.currentCyclePaidAmountNaira)} paid this cycle
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">
                      Total Paid Days
                    </p>
                    <p className="text-3xl font-black text-ink tracking-tight">
                      {user.totalPaidDays ?? 0}
                    </p>
                    <p className="text-sm text-ink-secondary mt-1">
                      {formatAmount(user.totalPaidAmountNaira)} paid overall
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-ink mb-4">Payment Summary</h2>
                <div className="bg-surface p-6 rounded-2xl border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-2xl font-black text-ink">{user.currentCyclePaidDays ?? 0}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mt-1">
                        Days This Cycle
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-ink">{user.totalPaidDays ?? 0}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mt-1">
                        Total Days
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-ajo-600">
                        {formatAmount(user.totalPaidAmountNaira)}
                      </p>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mt-1">
                        Total Paid
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
