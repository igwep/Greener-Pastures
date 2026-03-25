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
import { uploadImageToCloudinary } from "../services/cloudinary";

export function LoanApplicationPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get("type");

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [selectedLoanTypeId, setSelectedLoanTypeId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const { data: loanTypesData, isLoading: isLoanTypesLoading } =
    useLoanTypesQuery();
  const { data: myLoansData } = useMyLoansQuery();
  const applyMutation = useApplyLoanMutation();

  const loanTypes = useMemo(
    () => loanTypesData?.loanTypes ?? [],
    [loanTypesData],
  );

  // Check if user has pending loan applications
  const hasPendingLoan = useMemo(() => {
    return myLoansData?.loanApplications?.some(
      loan => loan.status === 'PENDING'
    ) || false;
  }, [myLoansData]);

  // Check if user has existing loan balance
  const hasLoanBalance = useMemo(() => {
    const loanBalance = Number(myLoansData?.loanBalance?.amountNaira ?? 0);
    return loanBalance > 0;
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
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please upload an image file (PNG, JPG, etc.)");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user already has a pending loan application
    if (hasPendingLoan) {
      setShowPendingModal(true);
      return;
    }

    if (!selectedLoanTypeId) {
      alert("Please select a loan type.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid loan amount.");
      return;
    }

    if (selectedLoanType) {
      const min = Number(selectedLoanType.minAmountNaira ?? 0);
      const max = Number(selectedLoanType.maxAmountNaira);
      const req = Number(amount);
      if (req < min || req > max) {
        alert(
          `Amount must be between ₦${min.toLocaleString()} and ₦${max.toLocaleString()} for this loan type.`,
        );
        return;
      }
    }

    if (!reason || reason.length < 5) {
      alert("Please provide a reason (at least 5 characters).");
      return;
    }

    if (!file) {
      alert("Please upload required signed document image.");
      return;
    }

    // Set loading state immediately
    setIsSubmitting(true);

    try {
      // 1. Upload to Cloudinary
      const cloudinaryRes = await uploadImageToCloudinary(file);

      // 2. Submit to backend
      await applyMutation.mutateAsync({
        loanTypeId: selectedLoanTypeId,
        requestedAmountNaira: amount,
        reason,
        formUrl: cloudinaryRes.secure_url,
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Loan application failed:", error);
      alert(
        error.message || "Failed to submit loan application. Please try again.",
      );
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  const handleDownloadForm = () => {
    // In a real app, this would be a link to a PDF
    alert("Downloading application form...");
  };

  // If user has existing loan balance, show message instead of application form
  if (hasLoanBalance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-ajo-50 text-ajo-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircleIcon className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Active Loan Balance
          </h1>
          <p className="text-ink-secondary max-w-md">
            You have an existing loan balance. Please repay your current loan before applying for a new one.
          </p>
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

  // If user has pending loan, show pending modal instead of application form
  if (hasPendingLoan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-ajo-50 text-ajo-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircleIcon className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Loan Application Pending
          </h1>
          <p className="text-ink-secondary max-w-md">
            You already have a loan application in PENDING status. Please wait for it to be processed before submitting a new one.
          </p>
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
        <Button
          variant="secondary"
          className="rounded-xl flex items-center gap-2 border-ajo-200 text-ajo-700 hover:bg-ajo-50"
          onClick={handleDownloadForm}
        >
          <DownloadIcon className="w-4 h-4" />
          Download Loan Form
        </Button>
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
                    onChange={(e) => setSelectedLoanTypeId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all text-ink"
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
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-12 text-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Reason for Loan
                </label>
                <textarea
                  placeholder="Please provide a brief explanation for the loan request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all"
                  required
                />
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
                  Download the official loan application form.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  2
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Print and fill out the form with accurate details.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  3
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Sign the document and take a clear photo or scan it.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-ajo-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm border border-ajo-500/50">
                  4
                </div>
                <p className="text-sm text-ajo-100 leading-relaxed">
                  Upload the document and submit your application.
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
