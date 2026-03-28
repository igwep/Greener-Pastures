import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { UploadIcon, XIcon } from "lucide-react";
import { uploadImageToCloudinary } from "../../services/cloudinary";
import { adminCreateProductSchema, type AdminCreateProductFormData } from "../../schemas/marketplace";
import { useCreateAdminProductMutation, useMarketplaceCategoriesQuery } from "../../services/marketplace/hooks";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { z } from "zod";

type Props = {
  onBack?: () => void;
};

export function AddProductPage({ onBack }: Props) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([false, false, false]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", "", ""]);

  const [formData, setFormData] = useState<AdminCreateProductFormData>({
    title: "",
    description: "",
    priceNaira: "",
    imageUrls: ["", "", ""],
    phoneNumber: "",
    categoryId: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    otherUrl: "",
  });

  const createAdminProductMutation = useCreateAdminProductMutation();
  const { data: categories } = useMarketplaceCategoriesQuery();

  const canSubmit = useMemo(() => {
    return !createAdminProductMutation.isPending && uploadingImages.every((x) => !x);
  }, [createAdminProductMutation.isPending, uploadingImages]);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const handleInputChange = (field: keyof AdminCreateProductFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
    clearFieldError(field);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setServerError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerError("Image size must be less than 5MB");
      return;
    }

    try {
      const newUploadingImages = [...uploadingImages];
      newUploadingImages[index] = true;
      setUploadingImages(newUploadingImages);

      const response = await uploadImageToCloudinary(file);

      const newImageUrls = [...formData.imageUrls];
      newImageUrls[index] = response.secure_url;
      setFormData((prev) => ({ ...prev, imageUrls: newImageUrls }));

      const newPreviews = [...imagePreviews];
      newPreviews[index] = response.secure_url;
      setImagePreviews(newPreviews);

      setServerError("");
    } catch (error) {
      setServerError("Failed to upload image. Please try again.");
      console.error(error);
    } finally {
      const newUploadingImages = [...uploadingImages];
      newUploadingImages[index] = false;
      setUploadingImages(newUploadingImages);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = "";
    setFormData((prev) => ({ ...prev, imageUrls: newImageUrls }));

    const newPreviews = [...imagePreviews];
    newPreviews[index] = "";
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});
    setServerError("");

    try {
      adminCreateProductSchema.parse(formData);
      setShowConfirmModal(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            errors[String(err.path[0])] = err.message;
          }
        });
        setFieldErrors(errors);
        return;
      }

      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  const handleConfirmSubmission = async () => {
    setShowConfirmModal(false);

    try {
      const filteredFormData: AdminCreateProductFormData = {
        ...formData,
        imageUrls: formData.imageUrls.filter((url) => url && url.trim() !== ""),
      };

      await createAdminProductMutation.mutateAsync(filteredFormData);
      showSuccessToast("Product created successfully!");
      onBack?.();
    } catch (error) {
      showErrorToast(error, "Failed to create product.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Add Product</h2>
          <p className="text-ink-secondary mt-1">Create a product listing as admin (no fees, no duration).</p>
        </div>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Product title"
              />
              {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Price (NGN)</label>
              <Input
                value={formData.priceNaira}
                onChange={(e) => handleInputChange("priceNaira", e.target.value)}
                placeholder="e.g. 50000"
              />
              {fieldErrors.priceNaira && <p className="text-xs text-red-600 mt-1">{fieldErrors.priceNaira}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the product"
              className="w-full min-h-32 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ajo-500 focus:border-transparent"
            />
            {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Phone number</label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="e.g. 070..."
              />
              {fieldErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{fieldErrors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Category</label>
              <select
                value={formData.categoryId ?? ""}
                onChange={(e) => handleInputChange("categoryId", e.target.value)}
                className="w-full h-12 px-4 rounded-xl border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-ajo-500 focus:border-transparent transition-all text-ink border-gray-200"
              >
                <option value="">Select a category</option>
                {categories?.categories?.map((category: { id: string; name: string }) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId && <p className="text-xs text-red-600 mt-1">{fieldErrors.categoryId}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-3">Images (up to 3)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="border border-gray-200 rounded-2xl p-4">
                  {imagePreviews[index] ? (
                    <div className="relative">
                      <img
                        src={imagePreviews[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-36 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="block w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-ajo-400 cursor-pointer flex flex-col items-center justify-center gap-2 text-ink-secondary">
                      <UploadIcon className="w-6 h-6" />
                      <span className="text-xs font-medium">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleImageUpload(index, file);
                        }}
                      />
                    </label>
                  )}

                  {uploadingImages[index] && (
                    <p className="text-xs text-ink-secondary mt-2">Uploading...</p>
                  )}
                </div>
              ))}
            </div>
            {fieldErrors.imageUrls && <p className="text-xs text-red-600 mt-1">{fieldErrors.imageUrls}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Facebook URL</label>
              <Input
                value={formData.facebookUrl ?? ""}
                onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/..."
              />
              {fieldErrors.facebookUrl && <p className="text-xs text-red-600 mt-1">{fieldErrors.facebookUrl}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Instagram URL</label>
              <Input
                value={formData.instagramUrl ?? ""}
                onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/..."
              />
              {fieldErrors.instagramUrl && <p className="text-xs text-red-600 mt-1">{fieldErrors.instagramUrl}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">TikTok URL</label>
              <Input
                value={formData.tiktokUrl ?? ""}
                onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                placeholder="https://tiktok.com/..."
              />
              {fieldErrors.tiktokUrl && <p className="text-xs text-red-600 mt-1">{fieldErrors.tiktokUrl}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Other URL</label>
              <Input
                value={formData.otherUrl ?? ""}
                onChange={(e) => handleInputChange("otherUrl", e.target.value)}
                placeholder="https://..."
              />
              {fieldErrors.otherUrl && <p className="text-xs text-red-600 mt-1">{fieldErrors.otherUrl}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {onBack && (
              <Button variant="ghost" type="button" onClick={onBack}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!canSubmit} isLoading={createAdminProductMutation.isPending}>
              Create Product
            </Button>
          </div>
        </form>
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Product Creation"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmission} isLoading={createAdminProductMutation.isPending}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <p className="text-ink-secondary">Create this product listing?</p>
        </div>
      </Modal>
    </motion.div>
  );
}
