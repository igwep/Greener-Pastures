import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Product title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  priceNaira: z.string().min(1, "Price is required").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Price must be a valid positive number"),
  listingDays: z.number().min(1, "Listing duration must be at least 1 day").max(365, "Listing duration cannot exceed 365 days"),
  imageUrls: z.array(z.string().url("Each image URL must be a valid URL")).min(1, "At least one image URL is required").max(3, "Maximum 3 images allowed"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
  categoryId: z.string().min(1, "Category is required"),
  facebookUrl: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid Instagram URL").nullable().optional(),
  tiktokUrl: z.string().url("Invalid TikTok URL").nullable().optional(),
  otherUrl: z.string().url("Invalid URL").nullable().optional(),
});

export const extendProductSchema = z.object({
  listingDays: z.number().min(1, "Extension duration must be at least 1 day").max(365, "Extension duration cannot exceed 365 days"),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type ExtendProductFormData = z.infer<typeof extendProductSchema>;

export interface Product {
  id: string;
  title: string;
  description: string;
  priceNaira: string;
  listingDays: number;
  imageUrls: string[];
  phoneNumber: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  otherUrl?: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED";
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
}
