import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { XIcon, AlertCircleIcon, WalletIcon, UploadIcon } from 'lucide-react';
import { useCreateProductMutation, useMarketplaceSettingsQuery, useMarketplaceCategoriesQuery } from '../services/marketplace/hooks';
import { useDashboardSummaryQuery } from '../services/dashboard/hooks';
import { getStoredUser } from '../services/auth/session';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { createProductSchema, CreateProductFormData } from '../schemas/marketplace';
import { z } from 'zod';

export function AddProductPage() {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([false, false, false]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '', '']);

  // Form state
  const [formData, setFormData] = useState<CreateProductFormData>({
    title: '',
    description: '',
    priceNaira: '',
    listingDays: 30,
    imageUrls: ['', '', ''],
    phoneNumber: '',
    categoryId: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    otherUrl: ''
  });

  // API calls
  const createProductMutation = useCreateProductMutation();
  const { data: settings } = useMarketplaceSettingsQuery();
  const { data: categories } = useMarketplaceCategoriesQuery();
  const { data: dashboardSummary } = useDashboardSummaryQuery();
  const storedUser = getStoredUser();
  const user = dashboardSummary?.user ?? storedUser;

  // Fallback settings when API fails
  const fallbackSettings = {
    dailyListingFeeNaira: '100.00',
    updatedAt: new Date().toISOString()
  };

  const currentSettings = settings || fallbackSettings;

  // Calculate fees
  const listingFee = useMemo(() => {
    if (!currentSettings?.dailyListingFeeNaira) return 0;
    const dailyFee = Number(currentSettings.dailyListingFeeNaira);
    return dailyFee * formData.listingDays;
  }, [currentSettings, formData.listingDays]);

  const walletBalance = useMemo(() => {
    const balanceRaw = (user as any)?.wallet?.balanceNaira;
    const balanceNumber = typeof balanceRaw === 'string' ? Number(balanceRaw) : NaN;
    return Number.isFinite(balanceNumber) ? balanceNumber : 0;
  }, [user]);

  const canAfford = walletBalance >= listingFee;

  // Clear error when user starts typing
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleInputChange = (field: keyof CreateProductFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setServerError('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setServerError('Image size must be less than 5MB');
      return;
    }
    
    try {
      // Set uploading state
      const newUploadingImages = [...uploadingImages];
      newUploadingImages[index] = true;
      setUploadingImages(newUploadingImages);
      
      // Upload to Cloudinary
      const response = await uploadImageToCloudinary(file);
      
      console.log('=== IMAGE UPLOAD SUCCESS ===');
      console.log('Image index:', index);
      console.log('Cloudinary response:', response);
      console.log('Secure URL:', response.secure_url);
      console.log('Public ID:', response.public_id);
      console.log('=== END IMAGE UPLOAD SUCCESS ===');
      
      // Update form data with the new URL
      const newImageUrls = [...formData.imageUrls];
      newImageUrls[index] = response.secure_url;
      setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
      
      // Update preview
      const newPreviews = [...imagePreviews];
      newPreviews[index] = response.secure_url;
      setImagePreviews(newPreviews);
      
      // Clear any previous errors
      setServerError('');
    } catch (error) {
      console.error('=== IMAGE UPLOAD ERROR ===');
      console.error('Image index:', index);
      console.error('File being uploaded:', file);
      console.error('File type:', file.type);
      console.error('File size:', file.size);
      console.error('Error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'No message available');
      console.error('=== END IMAGE UPLOAD ERROR ===');
      
      setServerError('Failed to upload image. Please try again.');
    } finally {
      // Reset uploading state
      const newUploadingImages = [...uploadingImages];
      newUploadingImages[index] = false;
      setUploadingImages(newUploadingImages);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = '';
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = '';
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    setServerError('');

    try {
      // Validate form data with Zod
      createProductSchema.parse(formData);

      // Check if user can afford the listing fee
      if (!canAfford) {
        setServerError('Insufficient wallet balance to cover the listing fee.');
        return;
      }

      // Show confirmation modal
      setShowConfirmModal(true);
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
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleConfirmSubmission = async () => {
    setShowConfirmModal(false);
    
    try {
      // Filter out empty image URLs before sending to API
      const filteredFormData = {
        ...formData,
        imageUrls: formData.imageUrls.filter(url => url && url.trim() !== '')
      };
      
      /* console.log('=== SUBMITTING PRODUCT ===');
      console.log('Original imageUrls:', formData.imageUrls);
      console.log('Filtered imageUrls:', filteredFormData.imageUrls);
      console.log('=== END SUBMIT DEBUG ==='); */
      
      await createProductMutation.mutateAsync(filteredFormData);

      setShowSuccessModal(true);
    } catch (error) {
     /*  console.error('=== PRODUCT CREATION ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'No message available');
      console.error('Form data being submitted:', formData); */
      
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
     /*    console.error('API Error Status:', apiError.status);
        console.error('API Error Payload:', apiError.payload);
        console.error('API Error Message:', apiError.message); */
        
        // Handle specific API errors
        switch (apiError.status) {
          case 400:
            console.error('400 Bad Request - Validation failed');
            setServerError('Invalid product data. Please check all fields and try again.');
            break;
          case 401:
            console.error('401 Unauthorized - Authentication failed');
            setServerError('You are not authorized. Please log in again.');
            break;
          case 402:
            console.error('402 Payment Required - Insufficient balance');
            setServerError('Payment required. Insufficient wallet balance for listing fee.');
            break;
          case 403:
            console.error('403 Forbidden - Permission denied');
            setServerError('Access denied. You do not have permission to create products.');
            break;
          case 429:
            console.error('429 Too Many Requests - Rate limited');
            setServerError('Too many requests. Please wait a moment and try again.');
            break;
          case 500:
            console.error('500 Internal Server Error');
            setServerError('Server error. Please try again later.');
            break;
          default:
            console.error(`Unhandled error status: ${apiError.status}`);
            if (apiError.payload?.error) {
              console.error('Using payload error message:', apiError.payload.error);
              setServerError(apiError.payload.error);
            } else if (apiError.message) {
              console.error('Using error message:', apiError.message);
              setServerError(apiError.message);
            } else {
              console.error('Using generic error message');
              setServerError(`Failed to create product (${apiError.status}). Please try again.`);
            }
        }
      } else if (error instanceof Error) {
        console.error('JavaScript Error - Using error message:', error.message);
        console.error('Error stack:', error.stack);
        setServerError(error.message);
      } else {
        console.error('Unknown error type - Using generic message');
        setServerError('Failed to create product. Please try again.');
      }
      console.error('=== END PRODUCT CREATION ERROR ===');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Add Product
          </h1>
          <p className="text-ink-secondary mt-1">
            List your product on the community marketplace
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/marketplace/my-listings')}
        >
          Back to Marketplace
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8 rounded-3xl border-none shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Product Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter product title"
                  error={fieldErrors.title}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Product Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product in detail..."
                  className={`w-full min-h-[120px] p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all ${
                    fieldErrors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {fieldErrors.description && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Price (₦)"
                    type="number"
                    value={formData.priceNaira}
                    onChange={(e) => handleInputChange('priceNaira', e.target.value)}
                    placeholder="0.00"
                    error={fieldErrors.priceNaira}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Listing Duration (days)
                  </label>
                  <select
                    value={formData.listingDays}
                    onChange={(e) => handleInputChange('listingDays', Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all text-ink border-gray-200"
                  >
                    <option value={7}>7 days</option>
                    <option value={15}>15 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all text-ink border-gray-200"
                >
                  <option value="">Select a category</option>
                  {categories?.categories?.map((category: { id: string; name: string }) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.categoryId && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  Product Images (Max 3 images)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      {imagePreviews[index] || url ? (
                        <div className="relative group">
                          <img
                            src={imagePreviews[index] || url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleImageRemove(index)}
                              className="text-white hover:bg-white/20"
                            >
                              <XIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-ajo-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingImages[index]}
                          />
                          <div className="text-center pointer-events-none">
                            {uploadingImages[index] ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-ajo-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs text-ink-secondary">Uploading...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <UploadIcon className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-ink-secondary">Click to upload</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-ink-secondary mt-1 text-center">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-secondary mt-2">
                  Upload high-quality images. Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
                </p>
                {fieldErrors.imageUrls && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.imageUrls}</p>
                )}
              </div>

              <div>
                <Input
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+2348000000000"
                  error={fieldErrors.phoneNumber}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ink">Social Media Links (Optional)</h3>
                
                <Input
                  label="Facebook URL"
                  value={formData.facebookUrl}
                  onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  error={fieldErrors.facebookUrl}
                />

                <Input
                  label="TikTok URL"
                  value={formData.tiktokUrl}
                  onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                  placeholder="https://tiktok.com/@yourusername"
                  error={fieldErrors.tiktokUrl}
                />

                <Input
                  label="Instagram URL"
                  value={formData.instagramUrl}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                  error={fieldErrors.instagramUrl}
                />

                <Input
                  label="Other URL"
                  value={formData.otherUrl}
                  onChange={(e) => handleInputChange('otherUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  error={fieldErrors.otherUrl}
                />
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{serverError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-ajo-500/20"
                isLoading={createProductMutation.isPending}
                disabled={createProductMutation.isPending || !canAfford}
              >
                {createProductMutation.isPending ? 'Creating...' : 'Create Product Listing'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-none shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-ink mb-4">Listing Fee Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Daily Fee:</span>
                <span className="font-medium">₦{Number(currentSettings?.dailyListingFeeNaira || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Listing Duration:</span>
                <span className="font-medium">{formData.listingDays} days</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-ink">Total Fee:</span>
                  <span className="text-xl font-bold text-ajo-600">₦{listingFee.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-6 rounded-3xl border-none shadow-sm ${
            canAfford ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <WalletIcon className={`w-5 h-5 ${canAfford ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className="font-semibold text-ink">Wallet Balance</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Available:</span>
                <span className="font-medium">₦{walletBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Fee Required:</span>
                <span className="font-medium">₦{listingFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-ink">Remaining:</span>
                  <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    ₦{(walletBalance - listingFee).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {!canAfford && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <p className="text-sm text-red-700">
                  <AlertCircleIcon className="w-4 h-4 inline mr-1" />
                  Insufficient balance. Please fund your wallet to create this listing.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Product Listing"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmission}
              isLoading={createProductMutation.isPending}
              className="flex-1"
            >
              Confirm & Pay Fee
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <WalletIcon className="w-5 h-5" />
              <span className="font-semibold">Payment Confirmation</span>
            </div>
            <p className="text-amber-700 text-sm">
              This amount will be charged from your wallet balance to create the product listing.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Product:</span>
              <span className="font-medium">{formData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Listing Duration:</span>
              <span className="font-medium">{formData.listingDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Total Fee:</span>
              <span className="font-bold text-ajo-600">₦{listingFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/marketplace/my-listings');
        }}
        title="Product Listed Successfully!"
        footer={
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/marketplace/my-listings');
            }}
          >
            View My Products
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
          <p className="text-ink font-medium mb-2">Your product has been listed successfully!</p>
          <p className="text-sm text-ink-secondary">Your listing is now live on the marketplace.</p>
        </div>
      </Modal>

    </motion.div>
  );
}
