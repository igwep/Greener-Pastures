import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { MetricCardSkeleton } from '../components/ui/Skeleton';
import { useDashboardSummaryQuery } from '../services/dashboard/hooks';
import {
  CalendarIcon,
  TargetIcon,
  TrendingUpIcon,
  ClockIcon,
  SproutIcon } from
'lucide-react';
export function AjoPlanPage() {
  const { data: summary, isLoading } = useDashboardSummaryQuery();

  // Get active plan data
  const activePlan = summary?.activePlan;
  const cycle = summary?.cycle;
  
  // Calculate dynamic values - using available properties
  const dailyContribution = Number(activePlan?.contributionAmountNaira || 0);
  const currentSaved = Number(cycle?.currentCyclePaidAmountNaira || 0);
  // Calculate total target based on daily contribution * 30 days
  const totalTarget = dailyContribution * 30;
  const progress = totalTarget > 0 ? (currentSaved / totalTarget) * 100 : 0;
  
  // Date calculations
  const startDate = cycle?.planStartedAt ? new Date(cycle.planStartedAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) : 'Not started';
  
  const endDate = cycle?.planExpiresAt ? new Date(cycle.planExpiresAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) : 'Not set';
  
  const daysCompleted = cycle?.currentCyclePaidDays || 0;
  const totalDays = 30; // Assuming 30-day cycle
  const daysRemaining = Math.max(0, totalDays - daysCompleted);

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
      className="space-y-8 max-w-4xl mx-auto pb-12">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink tracking-tight">
          My Ajo Plan
        </h1>
        <Link to="/calendar">
          <Button className="rounded-xl">View Calendar</Button>
        </Link>
      </div>

      {isLoading ? (
        <MetricCardSkeleton />
      ) : (
        <div>
          <Card className="overflow-hidden p-0 rounded-[2rem] border-none shadow-lg">
            <div className="bg-ajo-900 p-10 text-white relative overflow-hidden">
              {/* Decorative watermark */}
              <SproutIcon className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5 transform -rotate-12" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                      <TargetIcon className="w-6 h-6 text-ajo-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{activePlan?.name || 'Growth Plan'}</h2>
                      <p className="text-ajo-200 text-sm">
                        Consistent daily savings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-ajo-300" />
                      <span className="text-sm font-medium">{daysRemaining} days to payout</span>
                    </div>
                    <Badge
                      variant="success"
                      className="bg-ajo-500 text-white border-none px-3 py-1.5">
                      
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-ajo-200 text-sm font-medium uppercase tracking-wider mb-2">
                      Total Target
                    </p>
                    <p className="text-4xl font-bold tracking-tight">₦{totalTarget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-ajo-200 text-sm font-medium uppercase tracking-wider mb-2">
                      Amount Saved
                    </p>
                    <p className="text-4xl font-bold text-ajo-300 tracking-tight">
                      ₦{currentSaved.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <ProgressBar progress={progress} className="text-white" />
                </div>
              </div>
            </div>
          </Card>

          <div className="p-10 grid sm:grid-cols-2 md:grid-cols-3 gap-10 bg-white">
            <div>
              <div className="flex items-center gap-2 text-ink-secondary mb-2">
                <TrendingUpIcon className="w-5 h-5 text-ajo-600" />
                <span className="text-sm font-bold uppercase tracking-widest text-ink-muted">
                  Daily Contribution
                </span>
              </div>
              <p className="text-2xl font-bold text-ink">₦{dailyContribution.toLocaleString()}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-ink-secondary mb-2">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold uppercase tracking-widest text-ink-muted">
                  Duration
                </span>
              </div>
              <p className="text-2xl font-bold text-ink">{totalDays} Days</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-ink-secondary mb-2">
                <CalendarIcon className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-bold uppercase tracking-widest text-ink-muted">
                  Payout Date
                </span>
              </div>
              <p className="text-2xl font-bold text-ink">{endDate}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-2">
                Start Date
              </p>
              <p className="text-lg font-semibold text-ink">{startDate}</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-2">
                Days Completed
              </p>
              <p className="text-lg font-semibold text-ink">{daysCompleted} Days</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-2">
                Days Remaining
              </p>
              <p className="text-lg font-semibold text-ink">{daysRemaining} Days</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}