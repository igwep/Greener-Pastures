import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  CreditCardIcon, 
  UserIcon, 
  TargetIcon, 
  TrendingUpIcon, 
  FileTextIcon, 
  UploadIcon, 
  AlertCircleIcon, 
  CheckIcon, 
  XIcon, 
  HistoryIcon, 
  ArrowUpRightIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  XCircleIcon
} from 'lucide-react';
import { useMyLoansQuery, useRepayLoanMutation } from '../services/loans/hooks';
import { useDashboardSummaryQuery } from '../services/dashboard/hooks';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { loanRepaymentSchema, LoanRepaymentFormData } from '../schemas/auth';
import { z } from 'zod';
import { Skeleton } from '../components/ui/Skeleton';

export function MyLoansPage() {
  const { data, isLoading } = useMyLoansQuery();
  const { data: summary } = useDashboardSummaryQuery();
  const repayMutation = useRepayLoanMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Clear error when user starts typing
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Also clear server error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const transferAccount = summary?.transferAccount?.account ?? null;

  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [repayAmount, setRepayAmount] = useState('');
  const [repayReference, setRepayReference] = useState('');
  const [repayFile, setRepayFile] = useState<File | null>(null);
  const [repayFilePreview, setFilePreview] = useState<string | null>(null);

  const loanApplications = data?.loanApplications ?? [];
  const loanBalance = Number(data?.loanBalance?.amountNaira ?? 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // File validation using Zod-like logic
      if (!selectedFile.type.startsWith("image/")) {
        setFieldErrors(prev => ({ ...prev, proofUrl: "Please upload an image file (PNG, JPG, etc.)" }));
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, proofUrl: "File size must be less than 5MB" }));
        return;
      }

      setRepayFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Clear form error when valid file is selected
      if (fieldErrors.proofUrl) {
        clearFieldError('proofUrl');
      }
    }
  };

  const handleRepaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setErrorMessage('');

    try {
      // Validate form data with Zod
      const formData: LoanRepaymentFormData = {
        amountNaira: repayAmount,
        transferReference: repayReference || undefined,
        proofUrl: repayFilePreview || ''
      };

      const validatedData = loanRepaymentSchema.parse(formData);

      // Set loading state immediately
      setIsSubmitting(true);

      // Upload to Cloudinary
      const cloudinaryRes = await uploadImageToCloudinary(repayFile!);
      
      // Submit to backend
      await repayMutation.mutateAsync({
        amountNaira: validatedData.amountNaira,
        transferReference: validatedData.transferReference,
        proofUrl: cloudinaryRes.secure_url
      });
      
      // Success - reset form and close modal
      setIsRepayModalOpen(false);
      setRepayAmount('');
      setRepayReference('');
      setRepayFile(null);
      setFilePreview(null);
      setShowSuccessModal(true);
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
        
        if (errorMessage.includes('invalid proof') || 
            errorMessage.includes('invalid screenshot')) {
          setErrorMessage('Invalid payment proof. Please upload a clear screenshot of your payment.');
        } else if (errorMessage.includes('duplicate repayment') ||
                   errorMessage.includes('already processed')) {
          setErrorMessage('This repayment appears to have already been processed. Please check your loan history.');
        } else if (errorMessage.includes('insufficient balance') ||
                   errorMessage.includes('balance too low')) {
          setErrorMessage('Insufficient balance. Please check your wallet and try again.');
        } else if (errorMessage.includes('repayment limit') ||
                   errorMessage.includes('daily limit')) {
          setErrorMessage('You have reached your daily repayment limit. Please try again tomorrow.');
        } else {
          setErrorMessage('Failed to process repayment. Please try again later.');
        }
      } else {
        // Handle other errors (network errors, etc.)
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.error("Repayment submission failed:", error);
      }
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'DISBURSED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2Icon className="w-4 h-4" />;
      case 'DISBURSED': return <CheckCircle2Icon className="w-4 h-4" />;
      case 'PENDING': return <ClockIcon className="w-4 h-4" />;
      case 'REJECTED': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">Loans & Repayments</h1>
          <p className="text-ink-secondary mt-1">Manage your loan applications and track your repayments.</p>
        </div>
        <Button 
          className="rounded-xl flex items-center gap-2"
          onClick={() => setIsRepayModalOpen(true)}
          disabled={loanBalance <= 0}
        >
          <CreditCardIcon className="w-4 h-4" />
          Repay Loan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            <Skeleton className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            <Skeleton className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
          </>
        ) : (
          <>
            <Card className="p-6 rounded-3xl border-none shadow-sm bg-white flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                    <ArrowUpRightIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Loan Balance</span>
                </div>
                <div className="text-3xl font-bold text-ink mb-1 tracking-tight">₦{loanBalance.toLocaleString()}</div>
                <div className="text-sm text-ink-muted">Total outstanding amount</div>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-none shadow-sm bg-white flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-ajo-50 text-ajo-600 rounded-xl">
                    <HistoryIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Applications</span>
                </div>
                <div className="text-3xl font-bold text-ink mb-1 tracking-tight">{loanApplications.length}</div>
                <div className="text-sm text-ink-muted">Total loan requests</div>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-ink">Loan History</h2>
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />)
          ) : loanApplications.length === 0 ? (
            <Card className="p-12 rounded-3xl border-none shadow-sm bg-white text-center">
              <div className="w-16 h-16 bg-gray-50 text-ink-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8" />
              </div>
              <p className="text-ink font-medium">No loan history yet</p>
              <p className="text-sm text-ink-secondary mt-1">Your loan applications will appear here once you apply.</p>
              <Button 
                variant="secondary" 
                className="mt-6 rounded-xl"
                onClick={() => window.location.href = '/loan-application'}
              >
                Apply Now
              </Button>
            </Card>
          ) : (
            loanApplications.map((loan) => (
              <Card key={loan.id} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${loan.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-ajo-50 text-ajo-600'}`}>
                    <CreditCardIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink text-lg">₦{Number(loan.requestedAmountNaira).toLocaleString()}</p>
                      <Badge variant={getStatusVariant(loan.status)} className="flex items-center gap-1">
                        {getStatusIcon(loan.status)}
                        {loan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-ink-secondary mt-1">{loan.loanType.name} • Applied on {new Date(loan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right sm:block hidden">
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Interest Rate</p>
                    <p className="text-sm font-bold text-ink">{(loan.loanType.interestBps / 100).toFixed(1)}%</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100 mx-2 sm:block hidden"></div>
                  <Button variant="ghost" className="rounded-xl text-ajo-600 font-bold">View Details</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isRepayModalOpen}
        onClose={() => setIsRepayModalOpen(false)}
        title="Repay Loan"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="ghost" className="flex-1" onClick={() => setIsRepayModalOpen(false)}>Cancel</Button>
            <Button 
              className="flex-1 rounded-xl" 
              onClick={handleRepaySubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Proof
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-ajo-50 p-4 rounded-2xl border border-ajo-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-ajo-600 uppercase tracking-widest">Outstanding</p>
              <p className="text-2xl font-bold text-ajo-900">₦{loanBalance.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <CreditCardIcon className="w-6 h-6 text-ajo-600" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-surface p-4">
            <div className="text-sm text-ink-muted">Transfer Account</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink-secondary">Bank</span>
                <span className="text-sm font-semibold text-ink">
                  {transferAccount?.bankName ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink-secondary">Account name</span>
                <span className="text-sm font-semibold text-ink">
                  {transferAccount?.accountName ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink-secondary">Account number</span>
                <span className="text-sm font-bold text-ink tracking-widest">
                  {transferAccount?.accountNumber ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-2">Amount to Repay (₦)</label>
              <Input
                type="number"
                placeholder="e.g. 10,000"
                value={repayAmount}
                onChange={(e) => {
                  setRepayAmount(e.target.value);
                  clearFieldError('amountNaira');
                }}
                className="w-full h-12"
                error={fieldErrors.amountNaira}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-2">Transfer Reference (Optional)</label>
              <Input
                type="text"
                placeholder="Bank transfer reference"
                value={repayReference}
                onChange={(e) => {
                  setRepayReference(e.target.value);
                  clearFieldError('transferReference');
                }}
                className="w-full h-12"
                error={fieldErrors.transferReference}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink mb-2">Proof of Payment (Image files only)</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center ${repayFile ? 'border-ajo-500 bg-ajo-50/30' : 'border-gray-200 hover:border-ajo-300'}`}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                
                {repayFile ? (
                  <div className="space-y-2">
                    {repayFilePreview ? (
                      <img src={repayFilePreview} alt="Preview" className="max-h-32 rounded-lg mx-auto" />
                    ) : (
                      <FileTextIcon className="w-10 h-10 text-ajo-500 mx-auto" />
                    )}
                    <p className="text-xs font-bold text-ink truncate max-w-[200px]">{repayFile.name}</p>
                  </div>
                ) : (
                  <div>
                    <UploadIcon className="w-8 h-8 text-ink-muted mb-2" />
                    <p className="text-xs font-bold text-ink">Click to upload image screenshot</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">Repayment Submitted Successfully!</h3>
          <p className="text-gray-600 text-sm mt-1">
            Your repayment proof has been submitted and will be reviewed by our team. It typically takes 12-24 hours for approval.
          </p>
          <Button
            onClick={() => setShowSuccessModal(false)}
          >
            OK
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title=""
        footer={
          <Button onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        }
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Submission Failed</h3>
              <p className="text-gray-600 text-sm mt-1">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
