import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import {
  WalletCardSkeleton,
  MetricCardSkeleton,
  ChartSkeleton,
  ActivitySkeleton,
} from "../components/ui/Skeleton";
import {
  WalletIcon,
  TargetIcon,
  TrendingUpIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  PlusIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getUserFirstName } from "../services/auth/session";
import { useDashboardSummaryQuery } from "../services/dashboard/hooks";
import { useLocation } from "react-router-dom";
import { useCreateDepositMutation } from "../services/deposits/hooks";
import { useLoanRepaymentsQuery } from "../services/loans/hooks";
import { ProductManagement } from "../components/marketplace/ProductManagement";
import { depositSchema, DepositFormData } from "../schemas/auth";
import { z } from "zod";

// Storage functions for dashboard summary
const getStoredDashboardSummary = () => {
  try {
    const stored = localStorage.getItem("dashboard_summary");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storeDashboardSummary = (summary: any) => {
  try {
    localStorage.setItem("dashboard_summary", JSON.stringify(summary));
  } catch {
    // Silently fail
  }
};

const isOnline = () => {
  return navigator.onLine === true;
};

export function DashboardPage() {
  const location = useLocation();
  const { user: authUser, isAuthenticated } = useAuth();
  const [chartPeriod, setChartPeriod] = useState("30D");
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [depositScreenshotUrl, setDepositScreenshotUrl] = useState<
    string | null
  >(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositTransferReference, setDepositTransferReference] = useState("");
  const [depositScreenshotFile, setDepositScreenshotFile] =
    useState<File | null>(null);
  const [depositFieldErrors, setDepositFieldErrors] = useState<Record<string, string>>({});
  const [depositServerError, setDepositServerError] = useState<string>('');
  const storedUser = authUser;
  const { data: summary, isLoading, isFetching } = useDashboardSummaryQuery(isAuthenticated);
  const { data: loanRepaymentsData } = useLoanRepaymentsQuery();
  const createDepositMutation = useCreateDepositMutation();

  // Show loading state only on initial load, not on refetch
  const isInitialLoading = isLoading && !isFetching;

  // Use stored summary as fallback when query fails
  const storedSummary = getStoredDashboardSummary();
  const isOnlineStatus = useMemo(() => isOnline(), []);
  const effectiveSummary = summary || storedSummary;

  const user = effectiveSummary?.user ?? (storedUser as any);
  const firstName = useMemo(() => getUserFirstName(user), [user]);

  // Store successful summary data for future fallbacks
  useMemo(() => {
    if (summary && !isLoading && isOnlineStatus) {
      storeDashboardSummary(summary);
    }
  }, [summary, isLoading, isOnlineStatus]);

  const today = useMemo(() => new Date(), []);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const transferAccount = effectiveSummary?.transferAccount?.account ?? null;

  // Clear deposit errors when user starts typing
  const clearDepositFieldError = (field: string) => {
    if (depositFieldErrors[field]) {
      setDepositFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Also clear server error when user starts typing
    if (depositServerError) {
      setDepositServerError('');
    }
  };

  const handleOpenDepositDialog = () => {
    setIsDepositDialogOpen(true);
  };

  const handleCloseDepositDialog = () => {
    setIsDepositDialogOpen(false);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    setDepositScreenshotFile(file);
    const nextUrl = URL.createObjectURL(file);
    setDepositScreenshotUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
  };

  const handleDepositSubmit = async () => {
    // Clear previous errors
    setDepositFieldErrors({});
    setDepositServerError('');

    try {
      // Validate form data with Zod
      const formData: DepositFormData = {
        amountNaira: depositAmount,
        transferReference: depositTransferReference || undefined,
        proof: depositScreenshotFile!
      };

      const validatedData = depositSchema.parse(formData);

      await createDepositMutation.mutateAsync({
        amountNaira: validatedData.amountNaira,
        paymentMethod: "BANK_TRANSFER",
        transferReference: validatedData.transferReference,
        proof: validatedData.proof,
      });

      // Reset form
      setDepositAmount("");
      setDepositTransferReference("");
      setDepositScreenshotFile(null);
      setDepositScreenshotUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setIsDepositDialogOpen(false);

      alert("Deposit submitted successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
        setDepositFieldErrors(errors);
      } else if (error instanceof Error) {
        // Handle server errors
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('deposit limit') || 
            errorMessage.includes('daily limit')) {
          setDepositServerError('You have reached your daily deposit limit. Please try again tomorrow.');
        } else if (errorMessage.includes('invalid proof') ||
                   errorMessage.includes('invalid screenshot')) {
          setDepositServerError('Invalid payment proof. Please upload a clear screenshot of your payment.');
        } else if (errorMessage.includes('duplicate deposit') ||
                   errorMessage.includes('already processed')) {
          setDepositServerError('This deposit appears to have already been processed. Please check your balance.');
        } else if (errorMessage.includes('file too large') ||
                   errorMessage.includes('file size')) {
          setDepositServerError('File size too large. Please upload an image smaller than 5MB.');
        } else {
          setDepositServerError('Failed to submit deposit. Please try again later.');
        }
      } else {
        // Handle other errors (network errors, etc.)
        setDepositServerError('An unexpected error occurred. Please try again.');
        console.error("Deposit submission failed:", error);
      }
    }
  };

  const walletBalanceNaira = useMemo(() => {
    const balanceRaw = (user as any)?.wallet?.balanceNaira;
    const balanceNumber =
      typeof balanceRaw === "string" ? Number(balanceRaw) : NaN;
    return Number.isFinite(balanceNumber) ? balanceNumber : 0;
  }, [user]);

  const loanBalanceNaira = useMemo(() => {
    const loanRaw = (user as any)?.wallet?.loanBalanceNaira;
    const loanNumber = typeof loanRaw === "string" ? Number(loanRaw) : NaN;
    return Number.isFinite(loanNumber) ? loanNumber : 0;
  }, [user]);

  const totalSavedNaira = useMemo(() => {
    const totalRaw = (effectiveSummary as any)?.cycle?.totalPaidAmountNaira;
    const totalNumber = typeof totalRaw === "string" ? Number(totalRaw) : NaN;
    return Number.isFinite(totalNumber) ? totalNumber : 0;
  }, [effectiveSummary]);

  const weeklySavedNaira = useMemo(() => {
    const txs = effectiveSummary?.recentTransactions ?? [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let weeklyTotal = 0;
    for (const tx of txs) {
      const txDate = new Date(tx.createdAt);
      if (txDate >= weekAgo && tx.type === "CREDIT") {
        const amount = Number(tx.amountNaira);
        if (Number.isFinite(amount)) {
          weeklyTotal += amount;
        }
      }
    }
    return weeklyTotal;
  }, [effectiveSummary]);

  const todayIso = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
      .toISOString()
      .slice(0, 10);
  }, []);

  const cycleMetrics = useMemo(() => {
    const cycle = (effectiveSummary as any)?.cycle;
    if (!cycle)
      return { consistency: 100, progress: 0, paid: 0, passed: 0, total: 0 };

    const startedAtRaw = cycle.planStartedAt;
    const expiresAtRaw = cycle.planExpiresAt;
    const startedAt =
      typeof startedAtRaw === "string" ? new Date(startedAtRaw) : null;
    const expiresAt =
      typeof expiresAtRaw === "string" ? new Date(expiresAtRaw) : null;

    const startedAtMs =
      startedAt && Number.isFinite(startedAt.getTime())
        ? startedAt.getTime()
        : NaN;
    const expiresAtMs =
      expiresAt && Number.isFinite(expiresAt.getTime())
        ? expiresAt.getTime()
        : NaN;

    if (!Number.isFinite(startedAtMs) || !Number.isFinite(expiresAtMs)) {
      return { consistency: 100, progress: 0, paid: 0, passed: 0, total: 0 };
    }

    const dayMs = 1000 * 60 * 60 * 24;
    const totalDays = Math.max(
      1,
      Math.ceil((expiresAtMs - startedAtMs) / dayMs) + 1,
    );

    const now = new Date();
    const todayMs = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    ).getTime();
    const daysPassed = Math.max(
      1,
      Math.min(totalDays, Math.ceil((todayMs - startedAtMs) / dayMs) + 1),
    );

    const totalPaidDays = Number(cycle.totalPaidDays) || 0;
    const missedDays = Math.max(0, daysPassed - totalPaidDays);

    // Completion is (paid + missed) vs the whole cycle length (total)
    // e.g. (2 paid + 2 missed) / 31 = 12.9%
    const progress = Math.min(
      100,
      totalDays > 0
        ? Number((((totalPaidDays + missedDays) / totalDays) * 100).toFixed(1))
        : 0,
    );

    // Consistency/Performance relative to today
    const consistency = Math.min(
      100,
      daysPassed > 0 ? Math.round((totalPaidDays / daysPassed) * 100) : 100,
    );

    return {
      consistency,
      progress,
      paid: totalPaidDays,
      passed: daysPassed,
      total: totalDays,
    };
  }, [effectiveSummary]);

  const activePlanProgressPercent = cycleMetrics.progress;
  const performancePercent = cycleMetrics.consistency;

  const chartData = useMemo(() => {
    const txs = effectiveSummary?.recentTransactions ?? [];
    const last = txs.slice(0, 7).slice().reverse();
    let running = 0;
    return last.map((tx: any, idx: number) => {
      const amount = Number(tx.amountNaira);
      const signed = tx.type === "CREDIT" ? amount : -amount;
      running += Number.isFinite(signed) ? signed : 0;
      const d = new Date(tx.createdAt);
      const label =
        chartPeriod === "7D"
          ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : `Tx ${idx + 1}`;
      return { day: label, amount: Math.max(0, running) };
    });
  }, [effectiveSummary, chartPeriod]);

  const recentActivity = useMemo(() => {
    const txs = effectiveSummary?.recentTransactions ?? [];
    const loanRepayments = loanRepaymentsData?.repayments ?? [];
    const now = new Date();

    // Combine regular transactions with loan repayments
    const allActivities = [
      ...txs.map((tx: any) => ({
        ...tx,
        isLoanRepayment: false,
      })),
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
    allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allActivities.slice(0, 5).map((activity: any) => {
      const d = new Date(activity.createdAt);
      const isValidDate = Number.isFinite(d.getTime());

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfToday.getDate() - 1);

      let group: "Today" | "Yesterday" | "Older" = "Older";
      if (isValidDate && d >= startOfToday) group = "Today";
      else if (isValidDate && d >= startOfYesterday) group = "Yesterday";

      const note = activity.transaction?.note ?? "";
      const desc = note || activity.transaction?.kind || "Transaction";

      const amountNumber = Number(activity.amountNaira);
      const signedAmount = activity.type === "CREDIT" ? amountNumber : -amountNumber;

      return {
        id: activity.id,
        desc,
        date: d,
        amount: Number.isFinite(signedAmount) ? signedAmount : 0,
        type: activity.type === "CREDIT" ? "credit" : "debit",
        group,
        isLoanRepayment: activity.isLoanRepayment,
        status: activity.status
      };
    });
  }, [effectiveSummary, loanRepaymentsData]);
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {location.pathname === '/marketplace' ? (
        <ProductManagement />
      ) : isInitialLoading ? (
        // Loading skeleton while fetching fresh data
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wallet Card Skeleton */}
            <div className="md:col-span-2">
              <div className="bg-ajo-900 text-white relative overflow-visible flex flex-col justify-between p-8 rounded-3xl border-none shadow-lg">
                <div className="absolute inset-0 opacity-20 rounded-3xl"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                ></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="w-24 h-8 flex items-end gap-1 opacity-70">
                    {[4, 6, 5, 8, 7, 10, 12].map((h, i) => (
                      <div
                        key={i}
                        className="w-full bg-gray-600 rounded-t-sm animate-pulse"
                        style={{ height: `${h * 8}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-600 rounded w-2/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-600 rounded-xl w-28 animate-pulse"></div>
                    <div className="h-10 bg-gray-600 rounded-xl w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Balance Card Skeleton */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>

            {/* Active Plan Card Skeleton */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>

            {/* Total Saved Card Skeleton */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-ajo-50 rounded-xl animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart and Activity Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Skeleton */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-[300px] flex items-end justify-around">
                  {[1, 2, 3, 4, 5, 6, 7].map((height) => (
                    <div 
                      key={height} 
                      className="w-8 bg-gray-200 rounded-md animate-pulse"
                      style={{ height: `${height * 30}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink tracking-tight">
                {firstName ? `${getGreeting()}, ${firstName}` : getGreeting()} 👋
                {!isOnlineStatus && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Offline Mode
                  </span>
                )}
              </h1>
              <p className="text-ink-secondary mt-1">
                {today.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                className="rounded-xl shadow-sm"
                onClick={handleOpenDepositDialog}
              >
                Make Deposit
              </Button>
            </div>
          </div>

          {isDepositDialogOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={handleCloseDepositDialog}
                aria-label="Close deposit dialog"
              />
              <div className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col">
                <Card className="p-6 rounded-3xl border-none shadow-lg bg-white flex-1 overflow-y-auto">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-ink">Make a Deposit</h2>
                      <p className="text-sm text-ink-secondary mt-1">
                        Transfer to the account below and upload your screenshot.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={handleCloseDepositDialog}
                    >
                      Close
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-surface p-4 mb-6">
                    <div className="text-sm text-ink-muted">Transfer Account</div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-ink-secondary">Bank</span>
                        <span className="text-sm font-semibold text-ink">
                          {transferAccount?.bankName ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-ink-secondary">
                          Account name
                        </span>
                        <span className="text-sm font-semibold text-ink">
                          {transferAccount?.accountName ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-ink-secondary">
                          Account number
                        </span>
                        <span className="text-sm font-bold text-ink tracking-widest">
                          {transferAccount?.accountNumber ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Amount (₦)
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => {
                          setDepositAmount(e.target.value);
                          clearDepositFieldError('amountNaira');
                        }}
                        className="w-full"
                        error={depositFieldErrors.amountNaira}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Transfer Reference (optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter transfer reference"
                        value={depositTransferReference}
                        onChange={(e) => {
                          setDepositTransferReference(e.target.value);
                          clearDepositFieldError('transferReference');
                        }}
                        className="w-full"
                        error={depositFieldErrors.transferReference}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-dashed border-ajo-200 bg-ajo-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-ink">
                          Upload screenshot
                        </div>
                        <div className="text-xs text-ink-muted mt-0.5">
                          Image files only (PNG, JPG, etc.)
                        </div>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                        <span className="inline-flex items-center justify-center rounded-xl bg-ajo-600 text-white text-sm font-semibold px-4 h-10">
                          Choose file
                        </span>
                      </label>
                    </div>

                    {depositScreenshotUrl ? (
                      <div className="mt-4">
                        <img
                          src={depositScreenshotUrl}
                          alt="Deposit screenshot preview"
                          className="w-full rounded-2xl border border-ajo-200 object-cover max-h-48"
                        />
                      </div>
                    ) : null}
                  </div>

                  {depositFieldErrors.proof && (
                    <p className="text-sm text-red-600 mt-2">{depositFieldErrors.proof}</p>
                  )}

                  {depositServerError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-red-600">{depositServerError}</p>
                      {depositServerError.toLowerCase().includes('invalid proof') && (
                        <p className="text-sm text-red-600 mt-2">
                          Please upload a clear screenshot showing your payment details and amount.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleDepositSubmit}
                      disabled={
                        !depositAmount ||
                        !depositScreenshotFile ||
                        createDepositMutation.isPending
                      }
                      className="flex-1"
                    >
                      {createDepositMutation.isPending && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      )}
                      I have made the payment
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCloseDepositDialog}
                      disabled={createDepositMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ) : null}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wallet Card - Spans 2 columns */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              {isLoading ? (
                <WalletCardSkeleton />
              ) : (
                <Card className="animated-border animated-border-dark bg-ajo-900 text-white relative overflow-visible flex flex-col justify-between p-8 rounded-3xl border-none shadow-lg h-full">
                  <div
                    className="absolute inset-0 opacity-20 rounded-3xl"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  ></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>

                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-ajo-100">
                      <WalletIcon className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">
                        Wallet Balance
                      </span>
                    </div>
                    <div className="w-24 h-8 flex items-end gap-1 opacity-70">
                      {[4, 6, 5, 8, 7, 10, 12].map((h, i) => (
                        <div
                          key={i}
                          className="w-full bg-ajo-400 rounded-t-sm"
                          style={{
                            height: `${h * 8}%`,
                          }}
                        ></div>
                      ))}
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
                        className="bg-secondary text-ajo-900 hover:bg-secondary/90 rounded-xl h-10 px-4 text-sm font-semibold shadow-sm"
                        onClick={handleOpenDepositDialog}
                      >
                        <PlusIcon className="w-4 h-4 mr-1.5" /> Add Money
                      </Button>
                      <Link to="/withdraw">
                        <Button
                          variant="secondary"
                          className="bg-white/10 border border-white/20 text-white hover:bg-white/15 rounded-xl h-10 px-4 text-sm font-semibold"
                        >
                          Withdraw
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Loan Balance Card - Only shown if balance > 0 */}
            {loanBalanceNaira > 0 && (
              <motion.div variants={itemVariants}>
                {isLoading ? (
                  <MetricCardSkeleton />
                ) : (
                  <Card className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                        <ArrowUpRightIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                        Loan Balance
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-ink mb-2 tracking-tight">
                      ₦{loanBalanceNaira.toLocaleString()}
                    </div>
                    <div className="text-sm text-ink-muted">Outstanding amount</div>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Active Plan */}
            <motion.div
              variants={itemVariants}
              className={loanBalanceNaira > 0 ? "" : ""}
            >
              {isLoading ? (
                <MetricCardSkeleton />
              ) : (
                <Card className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <TargetIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                      Active Plan
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#F3F4F6"
                          strokeWidth="3"
                        />

                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={
                            performancePercent >= 100
                              ? "#16A34A"
                              : performancePercent >= 50
                                ? "#EAB308"
                                : "#DC2626"
                          }
                          strokeWidth="3"
                          strokeDasharray={`${activePlanProgressPercent}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-ink">
                        {activePlanProgressPercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-ink">
                        {effectiveSummary?.activePlan?.name ?? "No Active Plan"}
                      </div>
                      <div className="text-xs text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-ajo-600">
                          {performancePercent}% consistency
                        </span>
                        <span className="opacity-30">•</span>
                        <span>
                          {cycleMetrics.paid}/{cycleMetrics.total} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                      Status
                    </div>
                    <Badge
                      variant={
                        performancePercent >= 100
                          ? "success"
                          : performancePercent >= 50
                            ? "warning"
                            : "error"
                      }
                      className="rounded-lg text-[10px]"
                    >
                      {performancePercent >= 100
                        ? "EXCELLENT"
                        : performancePercent >= 50
                          ? "GOOD"
                          : "POOR"}
                    </Badge>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Total Saved */}
            <motion.div variants={itemVariants}>
              {isLoading ? (
                <MetricCardSkeleton />
              ) : (
                <Card className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2.5 bg-ajo-50 text-ajo-600 rounded-xl">
                      <TrendingUpIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                      Total Saved
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-ink mb-2 tracking-tight">
                    ₦{totalSavedNaira.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="flex items-center text-ajo-600 font-medium bg-ajo-50 px-1.5 py-0.5 rounded-md">
                      <ArrowUpRightIcon className="w-3 h-3 mr-0.5" /> +₦
                      {weeklySavedNaira.toLocaleString()}
                    </span>
                    <span className="text-ink-muted">this week</span>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <Card className="animated-border p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-ink">
                        Savings Progress
                      </h2>
                      <p className="text-sm text-ink-secondary mt-1">
                        {effectiveSummary?.activePlan?.name
                          ? `${effectiveSummary.activePlan.name} performance`
                          : "Plan performance"}
                      </p>
                    </div>
                    <div className="flex bg-surface p-1 rounded-xl border border-gray-100">
                      {["7D", "30D", "All"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setChartPeriod(period)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${chartPeriod === period ? "bg-white text-ink shadow-sm" : "text-ink-secondary hover:text-ink"}`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorAmount"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#16A34A"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#16A34A"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#F3F4F6"
                        />

                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#9CA3AF",
                            fontSize: 12,
                          }}
                          dy={10}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#9CA3AF",
                            fontSize: 12,
                          }}
                          tickFormatter={(val) => `₦${val}`}
                          dx={-10}
                        />

                        <Tooltip
                          contentStyle={{
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value: number) => [`₦${value}`, "Saved"]}
                        />

                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#16A34A"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorAmount)"
                          activeDot={{
                            r: 6,
                            strokeWidth: 0,
                            fill: "#16A34A",
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Recent Transactions */}
            <motion.div variants={itemVariants}>
              {isLoading ? (
                <ActivitySkeleton />
              ) : (
                <Card className="animated-border flex flex-col p-6 rounded-3xl border-none shadow-sm overflow-visible bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-ink">Recent Activity</h2>
                    <Link
                      to="/wallet"
                      className="text-sm font-semibold text-ajo-600 hover:text-ajo-700 bg-ajo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {recentActivity.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-sm text-ink-muted font-medium">
                          No activities yet
                        </div>
                      </div>
                    ) : (
                      <div>
                        {["Today", "Yesterday", "Older"].map((group) => {
                          const groupActivities = recentActivity.filter(
                            (tx) => tx.group === group
                          );
                          if (groupActivities.length === 0) return null;

                          return (
                            <div key={group} className="mb-6 last:mb-0">
                              <div className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
                                {group}
                              </div>
                              <div className="space-y-3">
                                {groupActivities.map((tx) => (
                                  <div
                                    key={tx.id}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group"
                                  >
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        tx.isLoanRepayment
                                          ? tx.status === 'PENDING'
                                            ? "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100"
                                            : tx.status === 'REJECTED'
                                              ? "bg-red-50 text-red-600 group-hover:bg-red-100"
                                              : "bg-green-50 text-green-600 group-hover:bg-green-100"
                                          : tx.type === "credit" 
                                            ? "bg-ajo-50 text-ajo-600 group-hover:bg-ajo-100" 
                                            : "bg-surface text-ink-secondary group-hover:bg-gray-200"
                                      }`}
                                    >
                                      {tx.isLoanRepayment ? (
                                        <ArrowUpRightIcon className="w-4 h-4" />
                                      ) : tx.type === "credit" ? (
                                        <ArrowDownLeftIcon className="w-4 h-4" />
                                      ) : (
                                        <ArrowUpRightIcon className="w-4 h-4" />
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-ink truncate">
                                        {tx.desc}
                                      </p>
                                      <p className="text-xs text-ink-muted mt-0.5">
                                        {tx.date.toLocaleDateString("en-US", {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <p
                                        className={`text-sm font-bold ${tx.type === "credit" ? "text-ajo-600" : "text-ink"}`}
                                      >
                                        {tx.amount > 0 ? "+" : ""}₦
                                        {Math.abs(tx.amount).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
