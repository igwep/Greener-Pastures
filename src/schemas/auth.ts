import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string()
    .regex(/^0[789][01]\d{8}$/, "Please enter a valid Nigerian phone number (e.g., 08012345678)")
    .optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  selectedPlanId: z.string()
    .min(1, "Please select a savings plan")
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required")
    .max(100, "Password must be less than 100 characters")
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Financial Operations Schemas
export const depositSchema = z.object({
  amountNaira: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid amount greater than 0"
    })
    .refine((val) => Number(val) >= 100, {
      message: "Minimum deposit amount is ₦100"
    })
    .refine((val) => Number(val) <= 10000000, {
      message: "Maximum deposit amount is ₦10,000,000"
    }),
  transferReference: z.string()
    .max(50, "Transfer reference must be less than 50 characters")
    .optional(),
  proof: z.instanceof(File, {
    message: "Payment proof is required"
  })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB"
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: "Only JPEG, PNG, and WebP images are allowed"
    })
});

export type DepositFormData = z.infer<typeof depositSchema>;

export const withdrawalSchema = z.object({
  amountNaira: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid amount greater than 0"
    })
    .refine((val) => Number(val) >= 100, {
      message: "Minimum withdrawal amount is ₦100"
    })
    .refine((val) => Number(val) <= 10000000, {
      message: "Maximum withdrawal amount is ₦10,000,000"
    }),
  bankAccountId: z.string()
    .min(1, "Bank account is required")
});

export type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

// Loan Application Schema
export const loanApplicationSchema = z.object({
  loanTypeId: z.string()
    .min(1, "Please select a loan type"),
  requestedAmountNaira: z.string()
    .min(1, "Loan amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid loan amount greater than 0"
    }),
  reason: z.string()
    .min(5, "Reason must be at least 5 characters long")
    .max(500, "Reason must be less than 500 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Please provide a reason for the loan"
    }),
  formUrl: z.string()
    .min(1, "Signed document is required")
    .url("Please upload a valid document")
});

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

// Loan Repayment Schema
export const loanRepaymentSchema = z.object({
  amountNaira: z.string()
    .min(1, "Repayment amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid repayment amount greater than 0"
    })
    .refine((val) => Number(val) >= 100, {
      message: "Minimum repayment amount is ₦100"
    })
    .refine((val) => Number(val) <= 10000000, {
      message: "Maximum repayment amount is ₦10,000,000"
    }),
  transferReference: z.string()
    .max(50, "Transfer reference must be less than 50 characters")
    .optional(),
  proofUrl: z.string()
    .min(1, "Payment proof is required")
    .url("Please upload a valid payment proof")
});

export type LoanRepaymentFormData = z.infer<typeof loanRepaymentSchema>;
