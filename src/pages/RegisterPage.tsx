import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useRegisterMutation } from '../services/auth/hooks';
import { usePlansQuery } from '../services/plans/hooks';
import { registerSchema, RegisterFormData } from '../schemas/auth';
import { z } from 'zod';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon } from
'lucide-react';
export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const plansQuery = usePlansQuery();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setServerError('');

    try {
      // Validate form data with Zod
      const formData: RegisterFormData = {
        email: email || undefined,
        phone: phone || undefined,
        password,
        fullName,
        selectedPlanId
      };

      const validatedData = registerSchema.parse(formData);

      // Extract first and last name from validated full name
      const nameParts = validatedData.fullName.trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      // Submit registration with validated data
      await registerMutation.mutateAsync({
        email: validatedData.email,
        phone: validatedData.phone,
        password: validatedData.password,
        firstName,
        lastName,
        selectedPlanId: validatedData.selectedPlanId
      });

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
        
        if (errorMessage.includes('user already exists') || 
            errorMessage.includes('email already registered') ||
            errorMessage.includes('account already exists')) {
          setServerError('An account with this email or phone number already exists. Please try logging in instead.');
        } else if (errorMessage.includes('phone already exists') || 
                   errorMessage.includes('phone number already registered')) {
          setServerError('An account with this phone number already exists. Please try logging in instead.');
        } else {
          setServerError('Registration failed. Please check your information and try again.');
        }
      } else {
        // Handle other errors (network errors, etc.)
        setServerError('An unexpected error occurred. Please try again.');
        console.error('Registration error:', error);
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
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ajo-600 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3"></div>

        {/* Centered Logo */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <span className="font-bold text-5xl lg:text-6xl tracking-tight text-white bg-gradient-to-r from-white to-secondary-200 bg-clip-text text-transparent leading-tight">
                Greener Pastures
                <br />
                Investment International Limited
              </span>
            </Link>
            <p className="text-lg lg:text-xl text-ajo-200 font-light italic leading-relaxed">
              building opportunities, securing futures.
            </p>
          </div>
        </div>

        {/* Bottom Content - Empty now since quote and stats are removed */}
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-ink-secondary text-lg">
              Start your savings journey today
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
              <form className="space-y-5" onSubmit={handleRegister}>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Adaeze Okonkwo"
                  icon={<UserIcon className="w-5 h-5" />}
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFullName(e.target.value);
                    clearFieldError('fullName');
                  }}
                  required
                  error={fieldErrors.fullName}
                />
                

                <Input
                  label="Email address"
                  type="email"
                  placeholder="adaeze@example.com"
                  icon={<MailIcon className="w-5 h-5" />}
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  required
                  error={fieldErrors.email}
                />
                

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="08012345678"
                  icon={<PhoneIcon className="w-5 h-5" />}
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPhone(e.target.value);
                    clearFieldError('phone');
                  }}
                  error={fieldErrors.phone}
                />
                

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
                

                <div className="space-y-1.5 pt-2">
                  <label className="text-sm font-medium text-ink">
                    Select Ajo Plan
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setSelectedPlanId(e.target.value);
                      // Clear error when user makes a selection
                      if (fieldErrors.selectedPlanId) {
                        setFieldErrors(prev => ({ ...prev, selectedPlanId: '' }));
                      }
                      // Also clear server error
                      if (serverError) {
                        setServerError('');
                      }
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 transition-all appearance-none ${
                      fieldErrors.selectedPlanId ? 'border-red-500' : 'border-gray-200 bg-white'
                    }`}
                    required>
                    <option value="">
                      {plansQuery.isLoading ? 'Loading plans...' : 'Select a plan'}
                    </option>
                    {plansQuery.data?.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {typeof plan.name === 'string' && plan.name.trim().length > 0
                          ? plan.name
                          : plan.id}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.selectedPlanId && (
                    <p className="text-sm text-red-600 mt-1">{fieldErrors.selectedPlanId}</p>
                  )}
                </div>

                {plansQuery.error && (
                  <p className="text-sm text-red-600">Failed to load plans.</p>
                )}

                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{serverError}</p>
                    {serverError.toLowerCase().includes('already exists') && (
                      <p className="text-sm text-red-600 mt-2">
                        Already have an account?{' '}
                        <Link
                          to="/login"
                          className="font-semibold text-red-700 hover:text-red-800 underline">
                          Sign In
                        </Link>
                      </p>
                    )}
                  </div>
                )}

                {registerMutation.error && !serverError && (
                  <p className="text-sm text-red-600">
                    {registerMutation.error.message}
                  </p>
                )}

                <Button
                  type="submit"
                  isLoading={registerMutation.isPending}
                  disabled={registerMutation.isPending}
                  className="w-full rounded-xl h-12 text-base mt-6">
                  
                  Create Account
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-ink-secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-ajo-600 hover:text-ajo-700 transition-colors">
                  
                  Sign In
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);

}