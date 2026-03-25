import { apiRequest } from '../apiClient';

export type DashboardSummaryUser = {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  selectedPlanId: string | null;
  planContributionAmountNaira: string | null;
  planStartedAt: string | null;
  planExpiresAt: string | null;
  currentCyclePaidDays: number;
  currentCyclePaidAmountNaira: string;
  totalPaidDays: number;
  totalPaidAmountNaira: string;
  wallet: {
    id: string;
    balanceNaira: string;
    loanBalanceNaira?: string;
    availableNaira?: string;
    lockedAmountNaira: string;
  };
};

export type DashboardSummaryActivePlan = {
  id: string;
  name: string;
  contributionAmountNaira: string;
  isActive: boolean;
} | null;

export type DashboardSummaryCycle = {
  selectedPlanId: string | null;
  planStartedAt: string | null;
  planExpiresAt: string | null;
  isExpired: boolean;
  currentCyclePaidDays: number;
  currentCyclePaidAmountNaira: string;
  totalPaidDays: number;
  totalPaidAmountNaira: string;
};

export type DashboardSummaryTransaction = {
  id: string;
  createdAt: string;
  type: 'DEBIT' | 'CREDIT';
  amountNaira: string;
  transaction: {
    id: string;
    createdAt: string;
    kind: string;
    referenceId: string | null;
    note: string | null;
  };
  isLoanRepayment?: boolean;
  status?: string;
};

export type DashboardSummaryResponse = {
  user: DashboardSummaryUser;
  activePlan: DashboardSummaryActivePlan;
  cycle: DashboardSummaryCycle;
  transferAccount?: {
    account: {
      bankName: string;
      accountName: string;
      accountNumber: string;
    };
    updatedAt: string;
  } | null;
  recentTransactions: DashboardSummaryTransaction[];
};

export async function getDashboardSummary(signal?: AbortSignal): Promise<DashboardSummaryResponse> {
  return apiRequest<DashboardSummaryResponse>('/api/v1/dashboard/summary', { signal });
}
