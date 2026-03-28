import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  DownloadIcon,
  UploadIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
} from "lucide-react";
import {
  useLoanTypesQuery,
  useApplyLoanMutation,
  useMyLoansQuery,
} from "../services/loans/hooks";
import { uploadFileToCloudinary, uploadImageToCloudinary } from "../services/cloudinary";
import { loanApplicationSchema, LoanApplicationFormData } from "../schemas/auth";
import { z } from "zod";

export function LoanApplicationPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get("type");

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [selectedLoanTypeId, setSelectedLoanTypeId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [guarantorFile, setGuarantorFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

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

  const handleGuarantorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, guarantorFormUrl: "File size must be less than 10MB" }));
        return;
      }

      setGuarantorFile(selectedFile);

      if (fieldErrors.guarantorFormUrl) {
        clearFieldError('guarantorFormUrl');
      }
    }
  };

  const { data: loanTypesData, isLoading: isLoanTypesLoading } =
    useLoanTypesQuery();
  const { data: myLoansData, isLoading: isMyLoansLoading } = useMyLoansQuery();
  const applyMutation = useApplyLoanMutation();

  const loanTypes = useMemo(
    () => loanTypesData?.loanTypes ?? [],
    [loanTypesData],
  );

  // Check if user has any active loan (pending, approved, or with balance)
  const hasActiveLoan = useMemo(() => {
    const hasPending = myLoansData?.loanApplications?.some(
      loan => loan.status === 'PENDING' || loan.status === 'APPROVED'
    ) || false;
    const hasBalance = Number(myLoansData?.loanBalance?.amountNaira ?? 0) > 0;
    return hasPending || hasBalance;
  }, [myLoansData]);

  // Get the status of the active loan for messaging
  const activeLoanStatus = useMemo(() => {
    const pendingLoan = myLoansData?.loanApplications?.find(
      loan => loan.status === 'PENDING'
    );
    if (pendingLoan) return 'PENDING';
    
    const approvedLoan = myLoansData?.loanApplications?.find(
      loan => loan.status === 'APPROVED'
    );
    if (approvedLoan) return 'APPROVED';
    
    const hasBalance = Number(myLoansData?.loanBalance?.amountNaira ?? 0) > 0;
    if (hasBalance) return 'ACTIVE';
    
    return null;
  }, [myLoansData]);

  useEffect(() => {
    if (loanTypes.length > 0 && typeParam) {
      const match = loanTypes.find((t) =>
        t.name.toLowerCase().includes(typeParam.toLowerCase()),
      );
      if (match) setSelectedLoanTypeId(match.id);
    }
  }, [loanTypes, typeParam]);

  const selectedLoanType = useMemo(
    () => loanTypes.find((t) => t.id === selectedLoanTypeId),
    [loanTypes, selectedLoanTypeId],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // File validation using Zod-like logic
      if (!selectedFile.type.startsWith("image/")) {
        setFieldErrors(prev => ({ ...prev, formUrl: "Please upload an image file (PNG, JPG, etc.)" }));
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, formUrl: "File size must be less than 5MB" }));
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Clear form error when valid file is selected
      if (fieldErrors.formUrl) {
        clearFieldError('formUrl');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setServerError('');

    // Check if user already has an active loan
    if (hasActiveLoan) {
      setShowPendingModal(true);
      return;
    }

    try {
      // Validate form data with Zod
      const formData: LoanApplicationFormData = {
        loanTypeId: selectedLoanTypeId,
        requestedAmountNaira: amount,
        reason,
        formUrl: filePreview || '',
        guarantorFormUrl: guarantorFile ? 'https://example.com/guarantor-form' : ''
      };

      const validatedData = loanApplicationSchema.parse(formData);

      // Additional business logic validation
      if (selectedLoanType) {
        const min = Number(selectedLoanType.minAmountNaira ?? 0);
        const max = Number(selectedLoanType.maxAmountNaira);
        const req = Number(validatedData.requestedAmountNaira);
        if (req < min || req > max) {
          setServerError(`Amount must be between ₦${min.toLocaleString()} and ₦${max.toLocaleString()} for this loan type.`);
          return;
        }
      }

      // Set loading state immediately
      setIsSubmitting(true);

      // 1. Upload to Cloudinary
      const cloudinaryRes = await uploadImageToCloudinary(file!);
      const guarantorCloudinaryRes = await uploadFileToCloudinary(guarantorFile!);

      // 2. Submit to backend
      await applyMutation.mutateAsync({
        loanTypeId: validatedData.loanTypeId,
        requestedAmountNaira: validatedData.requestedAmountNaira,
        reason: validatedData.reason,
        formUrl: cloudinaryRes.secure_url,
        guarantorFormUrl: guarantorCloudinaryRes.secure_url,
      });

      setIsSuccess(true);
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
        
        if (errorMessage.includes('loan limit') || 
            errorMessage.includes('maximum loan')) {
          setServerError('You have reached your maximum loan limit. Please repay existing loans first.');
        } else if (errorMessage.includes('income verification') ||
                   errorMessage.includes('income required')) {
          setServerError('Income verification required. Please update your profile information.');
        } else if (errorMessage.includes('credit score') ||
                   errorMessage.includes('poor credit')) {
          setServerError('Loan application declined due to credit score. Please improve your repayment history.');
        } else if (errorMessage.includes('document verification') ||
                   errorMessage.includes('invalid document')) {
          setServerError('Document verification failed. Please upload a clear, valid signed document.');
        } else if (errorMessage.includes('duplicate application') ||
                   errorMessage.includes('already submitted')) {
          setServerError('You already have a pending loan application. Please wait for it to be processed.');
        } else {
          setServerError('Failed to submit loan application. Please try again later.');
        }
      } else {
        // Handle other errors (network errors, etc.)
        setServerError('An unexpected error occurred. Please try again.');
        console.error("Loan application failed:", error);
      }
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  const handleDownloadForm = () => {
    // In a real app, this would be a link to a PDF
    alert("Downloading application form...");
  };

  const handleDownloadGuarantorForm = () => {
    // In a real app, this would be a link to a PDF
    alert("Downloading guarantor form...");
  };

  // Show loading state while checking for pending loans
  if (isMyLoansLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-ajo-50 text-ajo-600 rounded-full flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-ajo-600 border-t-transparent"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Checking Loan Status
          </h1>
          <p className="text-ink-secondary max-w-md">
            Please wait while we check your loan application status...
          </p>
        </div>
      </div>
    );
  }

  // If user has an active loan, show appropriate message instead of application form
  if (hasActiveLoan) {
    const getLoanMessage = () => {
      switch (activeLoanStatus) {
        case 'PENDING':
          return {
            title: "Loan Application Pending",
            message: "You already have a loan application in process. You can only have one active loan at a time.",
            subtext: "Application under review"
          };
        case 'APPROVED':
          return {
            title: "Loan Approved", 
            message: "You have an approved loan. You can only have one active loan at a time.",
            subtext: "Loan ready for disbursement"
          };
        case 'ACTIVE':
          return {
            title: "Active Loan Balance",
            message: "You have an existing loan balance. You can only have one active loan at a time.",
            subtext: "Loan currently active"
          };
        default:
          return {
            title: "Active Loan",
            message: "You have an active loan. You can only have one active loan at a time.",
            subtext: "Loan in progress"
          };
      }
    };

    const loanMessage = getLoanMessage();

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-ajo-50 text-ajo-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircleIcon className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            {loanMessage.title}
          </h1>
          <p className="text-ink-secondary max-w-md mb-4">
            {loanMessage.message}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-ajo-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-ajo-600 border-t-transparent"></div>
            <span>{loanMessage.subtext}</span>
          </div>
        </div>
        <Button
          className="mt-8 rounded-xl"
          onClick={() => window.history.back()}
        >
          Back to Services
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-ajo-50 text-ajo-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2Icon className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-2">
          Application Submitted!
        </h1>
        <p className="text-ink-secondary max-w-md">
          Your loan application has been received successfully. Our team will
          review your request and get back to you shortly.
        </p>
        <Button
          className="mt-8 rounded-xl"
          onClick={() => window.history.back()}
        >
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Loan Application
          </h1>
          <p className="text-ink-secondary mt-1">
            Complete the form below to apply for a Quick or Salary Loan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            className="rounded-xl flex items-center gap-2 border-ajo-200 text-ajo-700 hover:bg-ajo-50"
            onClick={handleDownloadForm}
          >
            <DownloadIcon className="w-4 h-4" />
            Download Loan Form
          </Button>
          <Button
            variant="secondary"
            className="rounded-xl flex items-center gap-2 border-ajo-200 text-ajo-700 hover:bg-ajo-50"
            onClick={handleDownloadGuarantorForm}
          >
            <DownloadIcon className="w-4 h-4" />
            Download Guarantor Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8 rounded-3xl border-none shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Loan Type
                </label>
                <div className="relative">
                  <select
                    value={selectedLoanTypeId}
                    onChange={(e) => {
                      setSelectedLoanTypeId(e.target.value);
                      clearFieldError('loanTypeId');
                    }}
                    className={`w-full h-12 px-4 rounded-xl border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all text-ink ${
                      fieldErrors.loanTypeId ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="" disabled>
                      Select a loan type
                    </option>
                    {isLoanTypesLoading ? (
                      <option disabled>Loading...</option>
                    ) : (
                      loanTypes?.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                </div>
                {fieldErrors.loanTypeId && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.loanTypeId}</p>
                )}
                {selectedLoanType && (
                  <p className="mt-2 text-xs text-ink-secondary flex items-center gap-1">
                    <AlertCircleIcon className="w-3 h-3" />
                    Limit: ₦
                    {Number(
                      selectedLoanType.minAmountNaira ?? 0,
                    ).toLocaleString()}{" "}
                    - ₦
                    {Number(selectedLoanType.maxAmountNaira).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Loan Amount (₦)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 50,000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    clearFieldError('requestedAmountNaira');
                  }}
                  className="w-full h-12 text-lg font-medium"
                  required
                  error={fieldErrors.requestedAmountNaira}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Reason for Loan
                </label>
                <textarea
                  placeholder="Please provide a brief explanation for the loan request..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    clearFieldError('reason');
                  }}
                  className={`w-full min-h-[120px] p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all ${
                    fieldErrors.reason ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {fieldErrors.reason && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.reason}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Upload Signed Document (Image only)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center ${file ? "border-ajo-500 bg-ajo-50/30" : "border-gray-200 hover:border-ajo-300"}`}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />

                  {file ? (
                    <div className="space-y-4">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-h-48 rounded-lg mx-auto border border-ajo-100"
                        />
                      ) : (
                        <FileTextIcon className="w-16 h-16 text-ajo-500 mx-auto" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-ink">
                          {file.name}
                        </p>
                        <p className="text-xs text-ink-secondary mt-1">
                          Click or drag to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-50 text-ink-muted rounded-full flex items-center justify-center mb-4">
                        <UploadIcon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-ink">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-ink-secondary mt-1">
                        Upload the filled and signed document (Image files only)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {fieldErrors.formUrl && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.formUrl}</p>
              )}

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Upload Guarantor Form
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center ${guarantorFile ? "border-ajo-500 bg-ajo-50/30" : "border-gray-200 hover:border-ajo-300"}`}
                >
                  <input
                    type="file"
                    onChange={handleGuarantorFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*,application/pdf"
                  />

                  {guarantorFile ? (
                    <div className="space-y-4">
                      <FileTextIcon className="w-16 h-16 text-ajo-500 mx-auto" />
                      <div>
                        <p className="text-sm font-bold text-ink">
                          {guarantorFile.name}
                        </p>
                        <p className="text-xs text-ink-secondary mt-1">
                          Click or drag to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-50 text-ink-muted rounded-full flex items-center justify-center mb-4">
                        <UploadIcon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-ink">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-ink-secondary mt-1">
                        Upload the filled guarantor form (PDF or image)
                      </p>
                    </>
                  )}
                </div>
                {fieldErrors.guarantorFormUrl && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.guarantorFormUrl}</p>
                )}
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-red-600">{serverError}</p>
                  {serverError.toLowerCase().includes('income verification') && (
                    <p className="text-sm text-red-600 mt-2">
                      Need to update your profile?{' '}
                      <button
                        type="button"
                        onClick={() => window.location.href = '/profile'}
                        className="font-semibold text-red-700 hover:text-red-800 underline">
                          Update Profile
                        </button>
                      </p>
                  )}
                  {serverError.toLowerCase().includes('document verification') && (
                    <p className="text-sm text-red-600 mt-2">
                      Please upload a clear, high-quality image of your signed document.
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-ajo-500/20"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Application
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="animated-border animated-border-dark bg-ajo-900 text-white relative overflow-visible p-8 rounded-3xl border-none shadow-lg">
            <div
              className="absolute inset-0 opacity-20 rounded-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-ajo-500 rounded-full blur-[80px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>

            <h3 className="text-xl font-bold mb-6 relative z-10 tracking-tight">
              Application Guide
            </h3>
            <ul className="space-y-5 relative z-10">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  1
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Download the official loan application form and guarantor form.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  2
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Print and fill out both forms with accurate details.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  3
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Sign the documents and take a clear photo/scan of the loan form and guarantor form.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  4
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Upload both documents and submit your application.
                </p>
              </li>
            </ul>
          </Card>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
            <AlertCircleIcon className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">Important Note</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Ensure all details match your profile information. Incomplete
                applications may result in processing delays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
