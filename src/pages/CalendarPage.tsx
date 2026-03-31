import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { MetricCardSkeleton } from "../components/ui/Skeleton";
import {
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  CalendarIcon,
  XIcon,
} from "lucide-react";
import { useDashboardSummaryQuery } from "../services/dashboard/hooks";
import {
  usePaymentDaysCalendarQuery,
  usePayPaymentDaysMutation,
} from "../services/paymentDays/hooks";
export function CalendarPage() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const { data: summary } = useDashboardSummaryQuery();
  const payMutation = usePayPaymentDaysMutation();

  const todayIso = useMemo(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
      .toISOString()
      .slice(0, 10);
  }, []);

  const cycleFrom = useMemo(() => {
    const startedAt = summary?.cycle?.planStartedAt;
    if (!startedAt) return todayIso;
    const d = new Date(startedAt);
    if (!Number.isFinite(d.getTime())) return todayIso;
    return d.toISOString().slice(0, 10);
  }, [summary, todayIso]);

  const cycleTo = useMemo(() => {
    const expiresAt = summary?.cycle?.planExpiresAt;
    if (!expiresAt) {
      const start = new Date(`${cycleFrom}T00:00:00.000Z`);
      const startMs = Number.isFinite(start.getTime())
        ? start.getTime()
        : Date.now();
      const dayMs = 1000 * 60 * 60 * 24;
      const end = new Date(startMs + dayMs * 29);
      return end.toISOString().slice(0, 10);
    }
    const d = new Date(expiresAt);
    if (!Number.isFinite(d.getTime())) {
      const start = new Date(`${cycleFrom}T00:00:00.000Z`);
      const startMs = Number.isFinite(start.getTime())
        ? start.getTime()
        : Date.now();
      const dayMs = 1000 * 60 * 60 * 24;
      const end = new Date(startMs + dayMs * 29);
      return end.toISOString().slice(0, 10);
    }
    return d.toISOString().slice(0, 10);
  }, [summary, cycleFrom]);

  const { data: calendarData, isLoading: isCalendarLoading } =
    usePaymentDaysCalendarQuery({ from: cycleFrom, to: cycleTo });

  const cycleDates = useMemo(() => {
    if (!cycleFrom || !cycleTo) return [] as string[];

    const start = new Date(`${cycleFrom}T00:00:00.000Z`);
    const end = new Date(`${cycleTo}T00:00:00.000Z`);
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()))
      return [] as string[];

    const dayMs = 1000 * 60 * 60 * 24;
    const dates: string[] = [];

    for (let t = start.getTime(); t <= end.getTime(); t += dayMs) {
      const d = new Date(t);
      dates.push(d.toISOString().slice(0, 10));
    }

    return dates;
  }, [cycleFrom, cycleTo]);

  const paidDaysSet = useMemo(() => {
    const set = new Set<string>();
    const missedSet = new Set<string>();
    for (const item of calendarData?.days ?? []) {
      if (item?.date) {
        // Convert ISO date to YYYY-MM-DD format for comparison
        const dateStr = new Date(item.date).toISOString().slice(0, 10);

        // Handle both cases: with status field and without status field
        // If status field exists, use it; if not, assume paid if paidVia exists
        if (
          item.status === "PAID" ||
          (item.status === undefined && item.paidVia)
        ) {
          set.add(dateStr);
        } else if (item.status === "MISSED") {
          missedSet.add(dateStr);
        }
      }
    }

    // Proactively mark days as missed if they are in the past and not paid
    // and not already explicitly marked as missed by the backend
    const today = new Date();
    const todayStr = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
    )
      .toISOString()
      .slice(0, 10);

    if (cycleDates.length > 0) {
      for (const date of cycleDates) {
        if (date < todayStr && !set.has(date) && !missedSet.has(date)) {
          missedSet.add(date);
        }
      }
    }

    return { paid: set, missed: missedSet };
  }, [calendarData, cycleDates]);

  const walletBalanceNaira = useMemo(() => {
    const raw = summary?.user?.wallet?.balanceNaira;
    const n = typeof raw === "string" ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : 0;
  }, [summary]);

  const contributionAmountNaira = useMemo(() => {
    const raw =
      summary?.activePlan?.contributionAmountNaira ??
      summary?.user?.planContributionAmountNaira;
    const n = typeof raw === "string" ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : 0;
  }, [summary]);

  const paidCount = useMemo(() => {
    let count = 0;
    for (const d of cycleDates) {
      if (paidDaysSet.paid.has(d)) count += 1;
    }
    return count;
  }, [cycleDates, paidDaysSet]);

  const totalDays = cycleDates.length;

  const daysPassed = useMemo(() => {
    let count = 0;
    for (const d of cycleDates) {
      if (d <= todayIso) count += 1;
    }
    return count;
  }, [cycleDates, todayIso]);

  const daysLeft = Math.max(0, totalDays - daysPassed);

  // Missed are days that passed but were not paid
  const missedCount = Math.max(0, daysPassed - paidCount);

  // Completion is (paid + missed) vs the whole cycle length (totalDays)
  // e.g. (2 paid + 2 missed) / 31 = 12.9%
  const completionPercent =
    totalDays > 0
      ? Number((((paidCount + missedCount) / totalDays) * 100).toFixed(1))
      : 0;

  const overallProgressPercent = completionPercent;

  const days = useMemo(() => {
    return cycleDates.map((date, idx) => {
      const isPaid = paidDaysSet.paid.has(date);
      const isMissed = paidDaysSet.missed.has(date);
      let status: "paid" | "upcoming" | "missed" = "upcoming";

      if (isPaid) {
        status = "paid";
      } else if (isMissed) {
        status = "missed";
      } else {
        status = "upcoming";
      }

      const dateObj = new Date(date);
      const monthDay = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        date,
        dayNumber: idx + 1,
        status,
        monthDay,
      } as const;
    });
  }, [cycleDates, paidDaysSet]);

  const isPayModalOpen = selectedDates.length > 0;

  const closePayModal = () => {
    setSelectedDates([]);
  };

  const toggleSelectDate = (date: string) => {
    if (paidDaysSet.paid.has(date) || paidDaysSet.missed.has(date)) return;
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  const totalToPayNaira = contributionAmountNaira * selectedDates.length;
  const canWalletPay =
    walletBalanceNaira >= totalToPayNaira && totalToPayNaira > 0;

  const handlePay = async () => {
    if (selectedDates.length === 0) return;

    await payMutation.mutateAsync({
      dates: selectedDates,
      paymentMethod: "WALLET",
    });

    closePayModal();
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Daily Savings Tracker
          </h1>
          <p className="text-ink-secondary mt-1">
            {summary?.activePlan?.name ?? "Your plan"}
          </p>
        </div>

        {selectedDates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-blue-600 text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-blue-200"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none mb-1">
                Selected
              </span>
              <span className="text-sm font-black leading-none">
                {selectedDates.length} day(s)
              </span>
            </div>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none mb-1">
                Total
              </span>
              <span className="text-sm font-black leading-none">
                ₦
                {(
                  contributionAmountNaira * selectedDates.length
                ).toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-4 text-sm font-medium bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-ajo-500"></div>
            <span className="text-ink">Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span className="text-ink">Unpaid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
            <span className="text-ink">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-200"></div>
            <span className="text-ink">Missed</span>
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        {isCalendarLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6">
            {Array.from({ length: 35 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-gray-100"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6">
            {days.map((d) => {
              const isMostRecentPaid =
                d.status === "paid" && d.dayNumber === paidCount;
              const isSelected = selectedDates.includes(d.date);
              return (
                <motion.div
                  key={d.date}
                  whileHover={
                    d.status !== "paid"
                      ? {
                          scale: 1.05,
                        }
                      : {}
                  }
                  whileTap={
                    d.status !== "paid"
                      ? {
                          scale: 0.95,
                        }
                      : {}
                  }
                  onClick={() => toggleSelectDate(d.date)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all ${
                    d.status === "paid"
                      ? "bg-ajo-50 border-2 border-ajo-200 cursor-default"
                      : d.status === "missed"
                        ? "bg-red-50 border-2 border-red-200 cursor-not-allowed"
                        : isSelected
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-surface border-2 border-transparent hover:border-gray-200"
                  }`}
                >
                  {/* Pulse animation for most recent paid day */}
                  {isMostRecentPaid && (
                    <span className="absolute flex h-3 w-3 top-2 right-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ajo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-ajo-500"></span>
                    </span>
                  )}

                  <span
                    className={`text-xl font-bold mb-1 ${
                      d.status === "paid"
                        ? "text-ajo-700"
                        : d.status === "missed"
                          ? "text-red-700"
                          : isSelected
                            ? "text-blue-700"
                            : "text-ink-secondary"
                    }`}
                  >
                    {d.dayNumber}
                  </span>

                  <span className="text-xs text-ink-muted">{d.monthDay}</span>

                  {d.status === "paid" && (
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircleIcon className="w-6 h-6 text-ajo-500" />
                      <span className="text-[10px] font-bold text-ajo-600 uppercase">
                        Paid
                      </span>
                    </div>
                  )}
                  {d.status === "missed" && (
                    <div className="flex flex-col items-center gap-1">
                      <XIcon className="w-6 h-6 text-red-500" />
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        Missed
                      </span>
                    </div>
                  )}
                  {d.status === "upcoming" && !isSelected && (
                    <div className="w-6 h-1.5 bg-gray-200 rounded-full mt-2"></div>
                  )}
                  {isSelected && (
                    <ClockIcon className="w-6 h-6 text-blue-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-ajo-50 flex items-center justify-center text-ajo-600">
            <FlameIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Days Paid
            </p>
            <p className="text-xl font-bold text-ink">{paidCount}</p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <XIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Missed Days
            </p>
            <p className="text-xl font-bold text-ink">{missedCount}</p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Days Left
            </p>
            <p className="text-xl font-bold text-ink">{daysLeft}</p>
          </div>
        </Card>
        <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="4"
              />

              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  completionPercent >= 100
                    ? "#16A34A"
                    : completionPercent >= 50
                      ? "#EAB308"
                      : "#DC2626"
                }
                strokeWidth="4"
                strokeDasharray={`${Math.min(100, completionPercent)}, 100`}
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-0.5">
              Completion
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-ink">{completionPercent}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isPayModalOpen}
        onClose={closePayModal}
        title={`Pay for ${selectedDates.length} day(s)`}
        footer={
          <>
            <Button variant="ghost" onClick={closePayModal}>
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              className="rounded-xl"
              isLoading={payMutation.isPending}
              disabled={!canWalletPay}
            >
              Pay Now
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="text-center bg-surface py-6 rounded-2xl border border-gray-100">
            <p className="text-ink-secondary font-medium mb-1">Amount to pay</p>
            <p className="text-5xl font-black text-ink tracking-tight">
              ₦{totalToPayNaira.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-4">
              Wallet payment
            </p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-ink">Wallet balance</div>
                <div className="text-xs text-ink-muted mt-1">
                  ₦{walletBalanceNaira.toLocaleString()}
                </div>
              </div>
              {!canWalletPay && totalToPayNaira > 0 ? (
                <div className="text-xs text-red-600 font-semibold">
                  Insufficient balance
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
