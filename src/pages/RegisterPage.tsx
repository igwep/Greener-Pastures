import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  SproutIcon } from
'lucide-react';
export function RegisterPage() {
  const navigate = useNavigate();
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
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
            "Start your savings journey. It only takes 2 minutes."
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-ajo-900 bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=4" alt="User" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-ajo-900 bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=5" alt="User" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-ajo-900 bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=6" alt="User" />
              </div>
            </div>
            <p className="text-ajo-200 font-medium">
              Join 10,000+ active savers
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto">
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
                  required />
                

                <Input
                  label="Email address"
                  type="email"
                  placeholder="adaeze@example.com"
                  icon={<MailIcon className="w-5 h-5" />}
                  required />
                

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="08012345678"
                  icon={<PhoneIcon className="w-5 h-5" />}
                  required />
                

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<LockIcon className="w-5 h-5" />}
                  required />
                

                <div className="space-y-1.5 pt-2">
                  <label className="text-sm font-medium text-ink">
                    Select Ajo Plan
                  </label>
                  <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 transition-all appearance-none">
                    <option value="starter">Starter Plan (₦500 daily)</option>
                    <option value="growth">Growth Plan (₦1,000 daily)</option>
                    <option value="premium">Premium Plan (₦5,000 daily)</option>
                  </select>
                </div>

                <Button
                  type="submit"
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