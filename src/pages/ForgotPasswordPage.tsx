import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Mail, ArrowLeft, CheckCircle, Sprout } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgotPasswordSchema, ForgotPasswordInput } from '../schemas/auth';

export function ForgotPasswordPage() {
  console.log('🚀 ForgotPassword: Component mounted');
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    console.log('🔄 ForgotPassword: Component state updated', {
      isLoading,
      email: email ? `${email.substring(0, 3)}***` : '',
      hasErrors: Object.keys(errors).length > 0,
      isSuccess
    });
  }, [isLoading, email, errors, isSuccess]);

  const validateEmail = (email: string) => {
    console.log('🔍 ForgotPassword: Validating email:', email);
    
    try {
      forgotPasswordSchema.parse({ email });
      console.log('✅ ForgotPassword: Email validation successful');
      setErrors({});
      return true;
    } catch (error) {
      console.log('❌ ForgotPassword: Email validation failed', error);
      if (error instanceof Error) {
        const zodError = error as any;
        const errorMessage = zodError.errors?.[0]?.message || 'Invalid email format';
        console.log('📝 ForgotPassword: Validation error message:', errorMessage);
        setErrors({ email: errorMessage });
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('⌨️ ForgotPassword: Email input changed:', value);
    setEmail(value);
    if (errors.email) {
      console.log('🧹 ForgotPassword: Clearing previous email error');
      validateEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 ForgotPassword: Form submission started');
    console.log('📧 ForgotPassword: Email being submitted:', email);
    
    if (!validateEmail(email)) {
      console.log('❌ ForgotPassword: Email validation failed');
      return;
    }

    console.log('✅ ForgotPassword: Email validation passed');
    setIsLoading(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const endpoint = `${API_BASE_URL}/api/v1/auth/forgot-password`;
      
      console.log('🌐 ForgotPassword: Making API call to:', endpoint);
      console.log('📤 ForgotPassword: Request payload:', { email });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('📥 ForgotPassword: Response received');
      console.log('📊 ForgotPassword: Response status:', response.status);
      console.log('📋 ForgotPassword: Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📦 ForgotPassword: Response body:', result);

      if (response.ok && result.ok) {
        console.log('🎉 ForgotPassword: API call successful');
        setIsSuccess(true);
        toast.success('Password reset link sent to your email!');
        setEmail('');
        setErrors({});
      } else {
        console.log('⚠️ ForgotPassword: API call failed');
        console.log('❌ ForgotPassword: Error details:', {
          status: response.status,
          statusText: response.statusText,
          body: result
        });
        toast.error(result.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.log('💥 ForgotPassword: Network error occurred');
      console.log('🔍 ForgotPassword: Error details:', error);
      console.log('📞 ForgotPassword: Error stack:', error instanceof Error ? error.stack : 'No stack available');
      toast.error('Network error. Please try again.');
    } finally {
      console.log('🏁 ForgotPassword: Form submission completed');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    console.log('🎉 ForgotPassword: Showing success state');
    
    const handleRetry = () => {
      console.log('🔄 ForgotPassword: User clicked retry');
      setIsSuccess(false);
    };

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
              <h1 className="text-3xl font-bold text-ink mb-2">Reset Link Sent!</h1>
              <p className="text-ink-secondary mb-6 max-w-sm">
                We've sent a password reset link to your email address.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-ink-secondary flex items-center justify-center">
                  <Mail className="w-4 h-4 text-ajo-500 mr-2" />
                  Check your inbox and click the link to reset your password.
                </p>
                <p className="text-sm text-ink-secondary flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-ajo-500 mr-2" />
                  If you don't receive an email within a few minutes, please check your spam folder.
                </p>
                <p className="text-sm text-ink-secondary flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-ajo-500 mr-2" />
                  Didn't receive the email?{' '}
                  <button
                    onClick={handleRetry}
                    className="text-ajo-600 hover:text-ajo-700 font-medium underline"
                  >
                    Try again
                  </button>
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
              <Mail className="w-10 h-10 text-ajo-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink mb-2">Forgot Password</h1>
            <p className="text-ink-secondary max-w-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-300 bg-red-50' : ''}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
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
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Link</span>
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
                <span>Secure password recovery powered by Greener Pastures</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
