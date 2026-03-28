import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, CheckCircle, ArrowLeft, Sprout } from 'lucide-react';
import { toast } from 'react-toastify';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas/auth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function ResetPasswordPage() {
  console.log('🔑 ResetPassword: Component mounted');
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState<ResetPasswordInput>({
    token: searchParams.get('token') || '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState<{
    token?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  useEffect(() => {
    console.log('🔄 ResetPassword: Component state updated', {
      isLoading,
      token: formData.token ? `${formData.token.substring(0, 8)}...` : 'none',
      hasNewPassword: !!formData.newPassword,
      hasConfirmPassword: !!formData.confirmNewPassword,
      hasErrors: Object.keys(errors).length > 0,
      isSuccess
    });
  }, [isLoading, formData, errors, isSuccess]);

  const validateForm = (data: ResetPasswordInput) => {
    console.log('🔍 ResetPassword: Validating form data');
    
    try {
      resetPasswordSchema.parse(data);
      console.log('✅ ResetPassword: Form validation successful');
      setErrors({});
      return true;
    } catch (error) {
      console.log('❌ ResetPassword: Form validation failed', error);
      if (error instanceof Error) {
        const zodError = error as any;
        const fieldErrors: any = {};
        zodError.errors?.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        console.log('📝 ResetPassword: Validation errors:', fieldErrors);
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof ResetPasswordInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`⌨️ ResetPassword: ${field} input changed:`, field === 'token' ? `${value.substring(0, 8)}...` : value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      console.log(`🧹 ResetPassword: Clearing ${field} error`);
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔑 ResetPassword: Form submission started');
    console.log('📧 ResetPassword: Form data being submitted:', {
      token: formData.token ? `${formData.token.substring(0, 8)}...` : 'none',
      hasNewPassword: !!formData.newPassword,
      hasConfirmPassword: !!formData.confirmNewPassword
    });
    
    if (!validateForm(formData)) {
      console.log('❌ ResetPassword: Form validation failed');
      return;
    }

    console.log('✅ ResetPassword: Form validation passed');
    setIsLoading(true);
    
    try {
      // API call to reset password
      const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/reset-password`;
      
      console.log('🌐 ResetPassword: Making API call to:', endpoint);
      console.log('📤 ResetPassword: Request payload:', {
        token: formData.token ? `${formData.token.substring(0, 8)}...` : 'none',
        newPassword: '***',
        confirmNewPassword: '***'
      });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 ResetPassword: Response received');
      console.log('📊 ResetPassword: Response status:', response.status);
      console.log('📋 ResetPassword: Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📦 ResetPassword: Response body:', result);

      if (response.ok && result.ok) {
        console.log('🎉 ResetPassword: API call successful');
        setIsSuccess(true);
        toast.success('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        console.log('⚠️ ResetPassword: API call failed');
        console.log('❌ ResetPassword: Error details:', {
          status: response.status,
          statusText: response.statusText,
          body: result
        });
        toast.error(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.log('💥 ResetPassword: Network error occurred');
      console.log('🔍 ResetPassword: Error details:', error);
      console.log('📞 ResetPassword: Error stack:', error instanceof Error ? error.stack : 'No stack available');
      toast.error('Network error. Please try again.');
    } finally {
      console.log('🏁 ResetPassword: Form submission completed');
      setIsLoading(false);
    }
  };

  // Redirect if no token
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      console.log('❌ ResetPassword: No token found in URL');
      toast.error('Invalid reset link. Please request a new password reset.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  if (isSuccess) {
    console.log('🎉 ResetPassword: Showing success state');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-ajo-50 via-white to-ajo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/95 backdrop-blur-sm border border-ajo-200/20 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-ajo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-ajo-600" />
              </div>
              <h1 className="text-3xl font-bold text-ink mb-2">Password Reset Successful!</h1>
              <p className="text-ink-secondary mb-6 max-w-sm">
                Your password has been successfully reset. You can now login with your new password.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-ink-secondary flex items-center justify-center">
                  <Lock className="w-4 h-4 text-ajo-500 mr-2" />
                  Your password has been updated securely
                </p>
                <p className="text-sm text-ink-secondary flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-ajo-500 mr-2" />
                  Redirecting to login page in a moment...
                </p>
              </div>
              <div className="w-16 h-16 bg-ajo-100 rounded-full mx-auto animate-pulse" />
            </div>
            
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-ajo-600 hover:text-ajo-700 font-medium bg-ajo-50 px-6 py-3 rounded-xl transition-all duration-200 hover:bg-ajo-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajo-50 via-white to-ajo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm border border-ajo-200/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-ajo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-ajo-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink mb-2">Reset Password</h1>
            <p className="text-ink-secondary max-w-sm">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token Field - Hidden */}
            <input type="hidden" value={formData.token} />

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-ink mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ajo-500 focus:border-transparent transition-all ${
                    errors.newPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ajo-500 hover:text-ajo-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>{errors.newPassword}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-ink mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange('confirmNewPassword')}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ajo-500 focus:border-transparent transition-all ${
                    errors.confirmNewPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ajo-500 hover:text-ajo-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>{errors.confirmNewPassword}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ajo-600 text-white hover:bg-ajo-700 disabled:bg-ajo-400 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resetting Password...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Reset Password</span>
                </div>
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center space-y-4">
              <p className="text-sm text-ink-secondary">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-ajo-600 hover:text-ajo-700 font-medium"
                >
                  Back to Login
                </Link>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-ink-muted">
                <Sprout className="w-4 h-4 text-ajo-500" />
                <span>Secure password reset powered by Greener Pastures</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
