import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAdminLoginMutation } from '../services/auth/hooks';
import { MailIcon, LockIcon, SproutIcon } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useAdminLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await loginMutation.mutateAsync({
      email: email || undefined,
      password
    });

    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('auth_user', JSON.stringify(res.admin));

    const next = (location.state as any)?.from?.pathname;
    navigate(typeof next === 'string' ? next : '/admin');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink relative overflow-hidden flex-col justify-between p-12 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ajo-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <SproutIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Greener Pastures</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-6">Admin access</h1>
          <p className="text-gray-300 font-medium">Sign in to approve deposits and manage payments.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ajo-600 rounded-xl flex items-center justify-center shadow-sm">
                <SproutIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-ink">Greener Pastures</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink tracking-tight">Admin Login</h2>
            <p className="mt-2 text-ink-secondary text-lg">Sign in to continue</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-gray-100 shadow-lg rounded-2xl p-8">
              <form className="space-y-6" onSubmit={handleLogin}>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="admin@example.com"
                  icon={<MailIcon className="w-5 h-5" />}
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<LockIcon className="w-5 h-5" />}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />

                {loginMutation.error ? (
                  <p className="text-sm text-red-600">{loginMutation.error.message}</p>
                ) : null}

                <Button
                  type="submit"
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  className="w-full rounded-xl h-12 text-base mt-4">
                  Sign In
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
