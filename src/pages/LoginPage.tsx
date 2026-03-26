import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useLoginMutation } from '../services/auth/hooks';
import { loginSchema, LoginFormData } from '../schemas/auth';
import { z } from 'zod';
import { MailIcon, LockIcon, SproutIcon } from 'lucide-react';
export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  // Clear error when user starts typing
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Also clear server error when user starts typing
    if (serverError) {
      setServerError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setServerError('');

    try {
      // Validate form data with Zod
      const formData: LoginFormData = {
        email: email || '',
        password
      };

      const validatedData = loginSchema.parse(formData);

      // Submit login with validated data
      const res = await loginMutation.mutateAsync({
        email: validatedData.email,
        password: validatedData.password
      });

      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));

      navigate('/dashboard');
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
      } else if (error instanceof Error) {
        // Handle server errors
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('invalid credentials') || 
            errorMessage.includes('incorrect password') ||
            errorMessage.includes('user not found') ||
            errorMessage.includes('email or password is incorrect')) {
          setServerError('Invalid email or password. Please check your credentials and try again.');
        } else if (errorMessage.includes('account not verified') ||
                   errorMessage.includes('email not verified')) {
          setServerError('Your account has not been verified. Please check your email for verification instructions.');
        } else if (errorMessage.includes('account suspended') ||
                   errorMessage.includes('account blocked')) {
          setServerError('Your account has been suspended. Please contact support for assistance.');
        } else {
          setServerError('Login failed. Please check your credentials and try again.');
        }
      } else {
        // Handle other errors (network errors, etc.)
        setServerError('An unexpected error occurred. Please try again.');
        console.error('Login error:', error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Brand Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-ajo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ajo-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <SproutIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              Greener Pastures
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-6">
            "Every naira saved today is a step toward tomorrow."
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-ajo-900 bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=1" alt="User" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-ajo-900 bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=2" alt="User" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-ajo-900 bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=3" alt="User" />
              </div>
            </div>
            <p className="text-ajo-200 font-medium">
              Join 10,000+ active savers
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ajo-600 rounded-xl flex items-center justify-center shadow-sm">
                <SproutIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-ink">
                Greener Pastures
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-ink-secondary text-lg">
              Sign in to your account to continue
            </p>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
            <Card className="border border-gray-100 shadow-lg rounded-2xl p-8">
              <form className="space-y-6" onSubmit={handleLogin}>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<MailIcon className="w-5 h-5" />}
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  required
                  error={fieldErrors.email}
                />
                

                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={<LockIcon className="w-5 h-5" />}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                    required
                    error={fieldErrors.password}
                  />
                  
                  <div className="flex justify-end mt-2">
                    <a
                      href="#"
                      className="text-sm font-medium text-ajo-600 hover:text-ajo-700 transition-colors">
                      
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{serverError}</p>
                    {serverError.toLowerCase().includes('not verified') && (
                      <p className="text-sm text-red-600 mt-2">
                        Need to verify your account?{' '}
                        <Link
                          to="/register"
                          className="font-semibold text-red-700 hover:text-red-800 underline">
                          Register again
                        </Link>
                      </p>
                    )}
                  </div>
                )}

                {loginMutation.error && !serverError && (
                  <p className="text-sm text-red-600">
                    {loginMutation.error.message}
                  </p>
                )}

                <Button
                  type="submit"
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  className="w-full rounded-xl h-12 text-base mt-4">
                  
                  Sign In
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-ink-secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-ajo-600 hover:text-ajo-700 transition-colors">
                  
                  Register now
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);

}