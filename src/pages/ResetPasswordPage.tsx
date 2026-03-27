import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas/auth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function ResetPasswordPage() {
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

  const validateForm = (data: ResetPasswordInput) => {
    try {
      resetPasswordSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as any;
        const fieldErrors: any = {};
        zodError.errors?.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof ResetPasswordInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);
    try {
      // API call to reset password
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        setIsSuccess(true);
        toast.success('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if no token
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">Password Reset Successful!</h1>
            <p className="text-ink-secondary mb-6">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </p>
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto animate-pulse" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">Reset Password</h1>
          <p className="text-ink-secondary">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token (hidden) */}
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
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.newPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
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
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.confirmNewPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-ink-secondary mb-2">
              Password must contain at least 8 characters with uppercase, lowercase, and numbers.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
