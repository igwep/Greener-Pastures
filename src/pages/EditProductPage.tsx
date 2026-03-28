import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EditProductSkeleton } from '../components/skeleton/EditProductSkeleton';
import { XIcon, UploadIcon } from 'lucide-react';
import { useUpdateProductMutation, useMarketplaceSettingsQuery, useMarketplaceCategoriesQuery, useMyProductsQuery } from '../services/marketplace/hooks';
import { useDashboardSummaryQuery } from '../services/dashboard/hooks';
import { getStoredUser } from '../services/auth/session';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { updateProductSchema, UpdateProductFormData, CreateProductFormData } from '../schemas/marketplace';

// Form state type that includes fields needed for UI but not sent to API
type EditProductFormState = UpdateProductFormData & {
  listingDays: number;
  imageUrls: string[];
};
import { z } from 'zod';

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([false, false, false]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '', '']);

  const { data: myProductsData, isLoading: productLoading } = useMyProductsQuery();
  const updateProductMutation = useUpdateProductMutation();
  const { data: settings } = useMarketplaceSettingsQuery();
  const { data: categories } = useMarketplaceCategoriesQuery();
  const { data: dashboardSummary } = useDashboardSummaryQuery();
  const storedUser = getStoredUser();
  const user = dashboardSummary?.user ?? storedUser;

  // Find the specific product from my products
  const product = myProductsData?.products?.find(p => p.id === id);

  // Form state
  const [formData, setFormData] = useState<EditProductFormState>({
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

  // Reset form
  const resetForm = () => {
    setFormData({
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
  };

  // Initialize form with product data
  useEffect(() => {
    console.log('=== EDIT PRODUCT - PREFILLED DATA ===');
    console.log('Product object:', product);
    console.log('Product keys:', product ? Object.keys(product) : 'Product is null');
    console.log('Product ID:', product?.id);
    console.log('Product title:', product?.title);
    console.log('Product description:', product?.description);
    console.log('Product price:', product?.priceNaira);
    console.log('Product phone:', product?.phoneNumber);
    console.log('Product categoryId:', product?.categoryId);
    console.log('Product social media:', {
      facebook: product?.facebookUrl,
      instagram: product?.instagramUrl,
      tiktok: product?.tiktokUrl,
      other: product?.otherUrl
    });
    console.log('Product images:', product?.images);
    console.log('Product imageUrls:', product?.imageUrls);
    console.log('Full product structure:', JSON.stringify(product, null, 2));
    console.log('=== END PREFILLED DATA ===');
    
    if (product) {
      // Calculate listing duration from createdAt and expiresAt
      const listingDays = product.createdAt && product.expiresAt 
        ? Math.ceil((new Date(product.expiresAt).getTime() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      
      console.log('=== CALCULATED LISTING DURATION ===');
      console.log('createdAt:', product.createdAt);
      console.log('expiresAt:', product.expiresAt);
      console.log('Calculated listingDays:', listingDays);
      console.log('=== END CALCULATION ===');
      
      setFormData({
        title: product.title || '',
        description: product.description || '',
        priceNaira: product.priceNaira || '',
        listingDays: listingDays, // Use calculated duration
        imageUrls: product.images?.map(img => img.imagePath) || ['', '', ''], // Convert images to imageUrls
        phoneNumber: product.phoneNumber || '',
        categoryId: product.categoryId || '',
        facebookUrl: product.facebookUrl || '',
        instagramUrl: product.instagramUrl || '',
        tiktokUrl: product.tiktokUrl || '',
        otherUrl: product.otherUrl || ''
      });
      setImagePreviews(product.images?.map(img => img.imagePath) || ['', '', '']);
      
      console.log('=== FORM DATA SET ===');
      console.log('Form data after setting:', {
        title: product.title || '',
        description: product.description || '',
        priceNaira: product.priceNaira || '',
        phoneNumber: product.phoneNumber || '',
        categoryId: product.categoryId || '',
        facebookUrl: product.facebookUrl || '',
        instagramUrl: product.instagramUrl || '',
        tiktokUrl: product.tiktokUrl || '',
        otherUrl: product.otherUrl || '',
        imageUrls: product.images?.map(img => img.imagePath) || ['', '', ''],
        listingDays: listingDays // Show calculated duration
      });
      
      const initialImageUrls = product.images?.map(img => img.imagePath) || ['', '', ''];
      console.log('Initial image URLs from product.images:', initialImageUrls);
      setImagePreviews(initialImageUrls);
      console.log('Image previews set to:', initialImageUrls);
      console.log('=== END FORM DATA ===');
    }
  }, [product]);

  // Fallback settings when API fails
  const fallbackSettings = {
    dailyListingFeeNaira: '100.00',
    updatedAt: new Date().toISOString()
  };

  const currentSettings = settings || fallbackSettings;

  // Calculate fees
  const listingFee = useState(() => {
    if (!currentSettings?.dailyListingFeeNaira) return 0;
    const dailyFee = Number(currentSettings.dailyListingFeeNaira);
    return dailyFee * formData.listingDays;
  })[0];

  const walletBalance = useState(() => {
    const balanceRaw = (user as any)?.wallet?.balanceNaira;
    const balanceNumber = typeof balanceRaw === 'string' ? Number(balanceRaw) : NaN;
    return Number.isFinite(balanceNumber) ? balanceNumber : 0;
  })[0];

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
      
      console.log('=== IMAGE UPLOAD DEBUG ===');
      console.log('Uploading image for index:', index);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      console.log('Current formData.imageUrls before upload:', formData.imageUrls);
      console.log('Current imagePreviews before upload:', imagePreviews);
      
      // Upload to Cloudinary
      const response = await uploadImageToCloudinary(file);
      
      console.log('Cloudinary response:', response);
      console.log('New secure_url:', response.secure_url);
      
      // Update form data with the new URL
      const newImageUrls = [...formData.imageUrls];
      newImageUrls[index] = response.secure_url;
      console.log('newImageUrls after update:', newImageUrls);
      setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
      
      // Update preview
      const newPreviews = [...imagePreviews];
      newPreviews[index] = response.secure_url;
      console.log('newPreviews after update:', newPreviews);
      setImagePreviews(newPreviews);
      
      console.log('Final formData.imageUrls (after state update):', newImageUrls);
      console.log('=== END IMAGE UPLOAD DEBUG ===');
      
      // Clear any previous errors
      setServerError('');
    } catch (error) {
      setServerError('Failed to upload image. Please try again.');
    } finally {
      // Reset uploading state
      const newUploadingImages = [...uploadingImages];
      newUploadingImages[index] = false;
      setUploadingImages(newUploadingImages);
    }
  };

  const handleImageRemove = (index: number) => {
    console.log('=== IMAGE REMOVE DEBUG ===');
    console.log('Removing image at index:', index);
    console.log('Current formData.imageUrls before removal:', formData.imageUrls);
    console.log('Current imagePreviews before removal:', imagePreviews);
    
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = '';
    console.log('newImageUrls after removal:', newImageUrls);
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = '';
    console.log('newPreviews after removal:', newPreviews);
    setImagePreviews(newPreviews);
    
    console.log('=== END IMAGE REMOVE DEBUG ===');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // Clear previous errors
    setFieldErrors({});
    setServerError('');

    try {
      // Validate form data with Zod using update schema
      console.log('=== VALIDATION DEBUG ===');
      console.log('Validating data:', {
        title: formData.title,
        description: formData.description,
        priceNaira: formData.priceNaira,
        phoneNumber: formData.phoneNumber,
        categoryId: formData.categoryId,
        imageUrls: formData.imageUrls.filter(url => url && url.trim() !== ''), // Filter empty URLs for validation
        facebookUrl: formData.facebookUrl,
        instagramUrl: formData.instagramUrl,
        tiktokUrl: formData.tiktokUrl,
        otherUrl: formData.otherUrl
      });
      console.log('Schema being used:', updateProductSchema);
      console.log('=== END VALIDATION DEBUG ===');
      
      // Filter out empty image URLs for validation
      const validImageUrls = formData.imageUrls.filter(url => url && url.trim() !== '');
      
      updateProductSchema.parse({
        title: formData.title,
        description: formData.description,
        priceNaira: formData.priceNaira,
        phoneNumber: formData.phoneNumber,
        categoryId: formData.categoryId,
        imageUrls: validImageUrls,
        facebookUrl: formData.facebookUrl,
        tiktokUrl: formData.tiktokUrl || "",
        instagramUrl: formData.instagramUrl || "",
        otherUrl: formData.otherUrl || ""
      });

      // Check if user can afford the listing fee (only if changing duration)
      if (!canAfford) {
        setServerError('Insufficient wallet balance to cover the listing fee.');
        return;
      }

      // Show confirmation modal
      setShowConfirmModal(true);
    } catch (error) {
      console.error('=== VALIDATION ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error details:', error);
      
      if (error instanceof z.ZodError) {
        console.error('Zod validation errors:', error.issues);
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(fieldErrors);
        console.error('Field errors set:', fieldErrors);
      } else {
        console.error('Non-validation error:', error);
        setServerError('Invalid product data. Please check all fields and try again.');
      }
      console.error('=== END VALIDATION ERROR ===');
    }
  };

  const handleConfirmSubmission = async () => {
    if (!id) return;
    
    try {
      // Create API data object with all required fields
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Current formData.imageUrls:', formData.imageUrls);
      console.log('Current imagePreviews:', imagePreviews);
      
      // Filter out empty image URLs for API call (backend expects only valid URLs)
      const validImageUrls = formData.imageUrls.filter(url => url && url.trim() !== '');
      console.log('Filtered valid image URLs:', validImageUrls);
      console.log('Number of valid images:', validImageUrls.length);
      
      const updateData: UpdateProductFormData = {
        title: formData.title,
        description: formData.description,
        priceNaira: formData.priceNaira,
        phoneNumber: formData.phoneNumber,
        facebookUrl: formData.facebookUrl,
        tiktokUrl: formData.tiktokUrl || "",
        instagramUrl: formData.instagramUrl || "",
        otherUrl: formData.otherUrl || "",
        categoryId: formData.categoryId,
        imageUrls: validImageUrls
      };
      
      console.log('Final update data being sent:', updateData);
      console.log('=== END FORM SUBMISSION DEBUG ===');
      
      await updateProductMutation.mutateAsync({ productId: id, data: updateData });
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('=== PRODUCT UPDATE ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        
        // Handle specific API errors
        switch (apiError.status) {
          case 400:
            setServerError('Invalid product data. Please check all fields and try again.');
            break;
          case 401:
            setServerError('You are not authorized. Please log in again.');
            break;
          case 402:
            setServerError('Payment required. Insufficient wallet balance for listing fee.');
            break;
          case 403:
            setServerError('Access denied. You do not have permission to edit this product.');
            break;
          case 404:
            setServerError('Product not found.');
            break;
          case 429:
            setServerError('Too many requests. Please wait a moment and try again.');
            break;
          case 500:
            setServerError('Server error. Please try again later.');
            break;
          default:
            if (apiError.payload?.error) {
              setServerError(apiError.payload.error);
            } else if (apiError.message) {
              setServerError(apiError.message);
            } else {
              setServerError(`Failed to update product (${apiError.status}). Please try again.`);
            }
        }
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('Failed to update product. Please try again.');
      }
    }
  };

  if (productLoading) {
    return <EditProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12 text-center">
        <h1 className="text-2xl font-bold text-ink">Product not found</h1>
        <Button onClick={() => navigate('/marketplace')}>
          Back to Marketplace
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Edit Product
          </h1>
          <p className="text-ink-secondary mt-1">
            Update your product listing
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/marketplace/my-listings')}
        >
          Back to My Products
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note: Listing duration cannot be changed for existing listings
                  </label>
                  <div className="h-12 px-4 rounded-xl border bg-gray-100 flex items-center text-gray-600">
                    {formData.listingDays} days (fixed)
                  </div>
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
                  value={formData.tiktokUrl || ''}
                  onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                  placeholder="https://tiktok.com/@yourusername"
                  error={fieldErrors.tiktokUrl}
                />

                <Input
                  label="Instagram URL"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                  error={fieldErrors.instagramUrl}
                />

                <Input
                  label="Other URL"
                  value={formData.otherUrl || ''}
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
                isLoading={updateProductMutation.isPending}
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Listing Information Card */}
          <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-ink mb-4">Listing Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Current Duration:</span>
                <span className="font-medium">{formData.listingDays} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Status:</span>
                <span className="font-medium">{product.status}</span>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-ink-secondary">
                  Note: Listing duration cannot be changed for existing listings. To extend your listing, use the "Extend Listing" option from your products page.
                </p>
              </div>
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
            <h3 className="text-lg font-semibold text-ink mb-4">Tips for Better Listings</h3>
            <div className="space-y-3 text-sm text-ink-secondary">
              <p>• Use high-quality images from multiple angles</p>
              <p>• Write detailed, honest descriptions</p>
              <p>• Set competitive prices based on market research</p>
              <p>• Include all relevant product specifications</p>
              <p>• Respond promptly to buyer inquiries</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Product Update"
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
              isLoading={updateProductMutation.isPending}
              className="flex-1"
            >
              Update Product
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Product:</span>
              <span className="font-medium">{formData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Price:</span>
              <span className="font-medium">₦{Number(formData.priceNaira).toLocaleString()}</span>
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
        title="Product Updated Successfully!"
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
          <p className="text-ink font-medium mb-2">Your product has been updated successfully!</p>
          <p className="text-sm text-ink-secondary">
            Your changes are now live on the marketplace.
          </p>
        </div>
      </Modal>
    </motion.div>
  );
}
