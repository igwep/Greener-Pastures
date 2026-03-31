import React from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { useAdminDashboardQuery } from "../../services/admin/hooks";
import {
  UsersIcon,
  TargetIcon,
  WalletIcon,
  AlertCircleIcon,
  ShoppingBagIcon,
} from "lucide-react";

// StatCard component - recreated based on the usage in AdminDashboardPage
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onClick?: () => void;
}

const StatCard = ({ icon: Icon, label, value, onClick }: StatCardProps) => (
  <Card
    className={`flex items-center gap-5 p-6 rounded-2xl border border-gray-100 shadow-sm ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-ink tracking-tight">{value}</p>
    </div>
  </Card>
);

export function Overview() {
  const { data: dashboard, isLoading } = useAdminDashboardQuery();
  const counts = dashboard?.counts;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <StatCard
        icon={UsersIcon}
        label="Total Users"
        value={counts?.users?.toLocaleString() ?? "0"}
      />
      <StatCard
        icon={TargetIcon}
        label="Pending Deposits"
        value={counts?.pendingDeposits?.toLocaleString() ?? "0"}
      />
      <StatCard
        icon={WalletIcon}
        label="Pending Withdrawals"
        value={counts?.pendingWithdrawals?.toLocaleString() ?? "0"}
      />
      <StatCard
        icon={AlertCircleIcon}
        label="Pending Payments"
        value={counts?.pendingContributionPayments?.toLocaleString() ?? "0"}
      />
      <StatCard
        icon={ShoppingBagIcon}
        label="Pending Product Listings"
        value={counts?.pendingProductListings?.toLocaleString() ?? "0"}
      />
    </motion.div>
  );
}
