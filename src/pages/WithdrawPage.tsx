import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { BuildingIcon, AlertCircleIcon } from "lucide-react";
import { useAuthMeQuery } from "../services/auth/hooks";
import { useDashboardSummaryQuery } from "../services/dashboard/hooks";
import { useCreateWithdrawalMutation, useUserWithdrawalsQuery } from "../services/withdrawals/hooks";
import { Skeleton } from "../components/ui/Skeleton";
import { withdrawalSchema, WithdrawalFormData } from "../schemas/auth";
import { z } from "zod";
export function WithdrawPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [showNoBankModal, setShowNoBankModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const { data: me, isLoading: isMeLoading } = useAuthMeQuery();
  const { data: summary, isLoading: isSummaryLoading } =
    useDashboardSummaryQuery();
  const createWithdrawalMutation = useCreateWithdrawalMutation();
  const { data: withdrawalsData } = useUserWithdrawalsQuery();

  // Clear error when user starts typing
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Also clear server error when user starts typing
    if (serverError) {
      setServerError('');
    }
  };

  const bankAccounts = me?.user?.bankAccounts ?? [];
  const defaultBankAccount =
    bankAccounts.find((acc) => acc.isDefault) ?? bankAccounts[0] ?? null;
  const walletBalanceNaira = Number(summary?.user?.wallet?.balanceNaira ?? 0);
  const withdrawals = withdrawalsData?.withdrawals ?? [];

  // Pagination logic
  const withdrawalsPerPage = 5;
  const totalPages = Math.ceil(withdrawals.length / withdrawalsPerPage);
  const paginatedWithdrawals = withdrawals.slice(
    (currentPage - 1) * withdrawalsPerPage,
    currentPage * withdrawalsPerPage
  );

  // Debug logging for button state
  const isButtonDisabled = !defaultBankAccount || !amount || Number(amount) <= 0 || Number(amount) > walletBalanceNaira || createWithdrawalMutation.isPending;
  
  console.log("Button state debug:", {
    isButtonDisabled,
    hasBankAccount: !!defaultBankAccount,
    hasAmount: !!amount,
    amount: amount,
    amountNumber: Number(amount),
    walletBalance: walletBalanceNaira,
    isPending: createWithdrawalMutation.isPending,
    bankAccountId: defaultBankAccount?.id
  });

  const handleWithdrawalSubmit = async () => {
    console.log("Withdrawal button clicked!");
    
    // Clear previous errors
    setFieldErrors({});
    setServerError('');

    try {
      // Validate form data with Zod
      const formData: WithdrawalFormData = {
        amountNaira: amount,
        bankAccountId: defaultBankAccount?.id || ''
      };

      const validatedData = withdrawalSchema.parse(formData);

      // Additional business logic validation
      if (Number(validatedData.amountNaira) > walletBalanceNaira) {
        setServerError('Insufficient balance. Please enter an amount less than or equal to your available balance.');
        return;
      }

      console.log("Validation passed - submitting withdrawal...");
      
      await createWithdrawalMutation.mutateAsync({
        amountNaira: validatedData.amountNaira,
        bankAccountId: validatedData.bankAccountId,
      });
      
      // Reset form
      setAmount("");
      
      // Show success modal
      setShowSuccessModal(true);
      
      console.log("Withdrawal request submitted:", {
        amountNaira: validatedData.amountNaira,
        bankAccountId: validatedData.bankAccountId,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
        setFieldErrors(errors);
      } else if (error instanceof Error) {
        // Handle server errors
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('insufficient balance') || 
            errorMessage.includes('balance too low')) {
          setServerError('Insufficient balance. Please enter an amount less than or equal to your available balance.');
        } else if (errorMessage.includes('withdrawal limit') ||
                   errorMessage.includes('daily limit')) {
          setServerError('You have reached your daily withdrawal limit. Please try again tomorrow.');
        } else if (errorMessage.includes('bank account') ||
                   errorMessage.includes('invalid bank')) {
          setServerError('Invalid bank account. Please update your bank details and try again.');
        } else if (errorMessage.includes('pending withdrawal') ||
                   errorMessage.includes('already requested')) {
          setServerError('You already have a pending withdrawal request. Please wait for it to be processed.');
        } else {
          setServerError('Failed to process withdrawal. Please try again later.');
        }
      } else {
        // Handle other errors (network errors, etc.)
        setServerError('An unexpected error occurred. Please try again.');
        console.error("Withdrawal error:", error);
      }
    }
  };

  // If no bank accounts, show modal on mount
  React.useEffect(() => {
    if (!isMeLoading && bankAccounts.length === 0) {
      setShowNoBankModal(true);
    }
  }, [isMeLoading, bankAccounts.length]);
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
      className="space-y-8 max-w-4xl mx-auto pb-12"
    >
      <h1 className="text-3xl font-bold text-ink tracking-tight">
        Withdraw Funds
      </h1>

      <div className="grid md:grid-cols-5 gap-8">
        <Card className="flex flex-col md:col-span-3 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-8 p-6 bg-surface rounded-2xl border border-gray-200">
            <p className="text-ink-secondary text-xs font-bold uppercase tracking-widest mb-2">
              Available Balance
            </p>
            {isSummaryLoading ? (
              <Skeleton className="h-10 w-48" />
            ) : (
              <h2 className="text-4xl font-black text-ink tracking-tight">
                ₦{walletBalanceNaira.toLocaleString()}
              </h2>
            )}
          </div>

          <form className="space-y-8 flex-1 flex flex-col" onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submitted - preventing default");
          handleWithdrawalSubmit();
        }}>
            <div className="relative">
              <span className="absolute left-5 top-10 text-ink font-bold text-xl">
                ₦
              </span>
              <Input
                label="Amount to withdraw"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  console.log("Input onChange triggered:", e.target.value);
                  setAmount(e.target.value);
                  clearFieldError('amountNaira');
                }}
                className="pl-10 text-2xl font-bold h-16 rounded-xl"
                error={fieldErrors.amountNaira}
              />
            </div>

            {isMeLoading ? (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ) : defaultBankAccount ? (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                    Destination Bank
                  </span>
                  {bankAccounts.length > 1 && (
                    <button
                      type="button"
                      className="text-sm font-bold text-ajo-600 hover:text-ajo-700 transition-colors"
                    >
                      Change
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-xl border border-gray-200 flex items-center justify-center text-ink-secondary">
                    <BuildingIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-ink text-base">
                      {defaultBankAccount.bankName}
                    </p>
                    <p className="text-sm text-ink-secondary mt-0.5">
                      {defaultBankAccount.accountNumber} •{" "}
                      {defaultBankAccount.accountName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-sm font-medium text-amber-800">
                  No bank account on file
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Add a bank account to withdraw funds.
                </p>
              </div>
            )}

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{serverError}</p>
                {serverError.toLowerCase().includes('bank account') && (
                  <p className="text-sm text-red-600 mt-2">
                    Need to update your bank details?{' '}
                    <button
                      type="button"
                      onClick={() => navigate("/profile?tab=bank")}
                      className="font-semibold text-red-700 hover:text-red-800 underline">
                      Update Bank Account
                    </button>
                  </p>
                )}
              </div>
            )}

            <div className="mt-auto pt-4">
              <Button
                type="submit"
                className="w-full rounded-xl h-14 text-lg"
                size="lg"
                disabled={isButtonDisabled}
              >
                Request Withdrawal
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-ink-secondary">
                <AlertCircleIcon className="w-4 h-4" />
                <span>Withdrawals are processed within 24 hours</span>
              </div>
            </div>
          </form>
        </Card>

        <div className="space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-6">
            Recent Withdrawals
          </h3>

          {withdrawals.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              No withdrawal history
            </Card>
          ) : (
            <>
              {paginatedWithdrawals.map((withdrawal) => (
                <Card
                  key={withdrawal.id}
                  className="p-5 flex items-center justify-between rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-bold text-ink text-lg">
                      ₦{Number(withdrawal.amountNaira).toLocaleString()}
                    </p>
                    <p className="text-sm text-ink-secondary mt-1">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={withdrawal.status === "PAID" ? "success" : "warning"}>
                    {withdrawal.status}
                  </Badge>
                </Card>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1"
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-ink-secondary px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* No bank details modal */}
      <Modal
        isOpen={showNoBankModal}
        onClose={() => setShowNoBankModal(false)}
        title="No Bank Details"
        footer={
          <Button
            onClick={() => {
              navigate("/profile?tab=bank");
              setShowNoBankModal(false);
            }}
          >
            Add Bank Details
          </Button>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-ajo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingIcon className="w-8 h-8 text-ajo-600" />
          </div>
          <p className="text-ink font-medium mb-2">No bank account on file</p>
          <p className="text-sm text-ink-secondary">
            Add a bank account to withdraw funds to your account.
          </p>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Withdrawal Successful"
        footer={
          <Button
            onClick={() => setShowSuccessModal(false)}
          >
            Done
          </Button>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-ink font-medium mb-2">Withdrawal Request Submitted!</p>
          <p className="text-sm text-ink-secondary">
            Your withdrawal request has been submitted successfully and will be processed within 24 hours.
          </p>
        </div>
      </Modal>
    </motion.div>
  );
}
