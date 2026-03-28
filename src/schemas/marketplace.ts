import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Product title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  priceNaira: z.string().min(1, "Price is required").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Price must be a valid positive number"),
  listingDays: z.number().min(1, "Listing duration must be at least 1 day").max(365, "Listing duration cannot exceed 365 days"),
  imageUrls: z.array(z.string().url("Each image URL must be a valid URL").or(z.literal(""))).min(1, "At least one image is required").max(3, "Maximum 3 images allowed"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
  categoryId: z.string().min(1, "Category is required"),
  facebookUrl: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  tiktokUrl: z.string().url("Invalid TikTok URL").optional().or(z.literal("")),
  otherUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const adminCreateProductSchema = createProductSchema.omit({
  listingDays: true,
}).extend({
  phoneNumber: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
});

export const updateProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title must be less than 120 characters").optional(),
  description: z.string().min(3, "Description must be at least 3 characters").max(5000, "Description must be less than 5000 characters").optional(),
  priceNaira: z.union([z.number(), z.string()]).optional(),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 characters").max(20, "Phone number must be less than 20 characters").optional(),
  categoryId: z.string().optional(),
  imageUrls: z.array(z.string().url("Each image URL must be a valid URL")).min(1, "At least one image is required").max(6, "Maximum 6 images allowed").optional(),
  facebookUrl: z.union([z.string().url("Invalid Facebook URL"), z.literal("")]).optional(),
  tiktokUrl: z.union([z.string().url("Invalid TikTok URL"), z.literal("")]).optional(),
  instagramUrl: z.union([z.string().url("Invalid Instagram URL"), z.literal("")]).optional(),
  otherUrl: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
});

// Profile update schemas
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
}).refine((data) => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  // If currentPassword is provided, newPassword must also be provided
  if (data.currentPassword && !data.newPassword) {
    return false;
  }
  return true;
}, {
  message: "Both current password and new password must be provided when changing password",
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
});

export const extendProductSchema = z.object({
  listingDays: z.number().min(1, "Extension duration must be at least 1 day").max(365, "Extension duration cannot exceed 365 days"),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type AdminCreateProductFormData = z.infer<typeof adminCreateProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ExtendProductFormData = z.infer<typeof extendProductSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface Product {
  id: string;
  title: string;
  description: string;
  priceNaira: string;
  listingDays: number;
  imageUrls?: string[]; // For backward compatibility
  images?: Array<{ id: string; imagePath: string }>; // New API structure
  phoneNumber: string;
  categoryId?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  otherUrl?: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED" | "REJECTED";
  active: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  feeChargedNaira?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface MarketplaceSettings {
  dailyListingFeeNaira: string;
  updatedAt: string;
}

export interface CreateProductResponse {
  product: Product;
  feeChargedNaira: string;
  ledgerTxnId: string;
}

export interface ExtendProductResponse {
  product: Product;
  feeChargedNaira: string;
  ledgerTxnId: string;
}

export interface ProductsResponse {
  products: Product[];
  nextCursor?: string | null;
}
