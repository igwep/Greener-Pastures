import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import {
  LayoutDashboardIcon,
  MoreHorizontalIcon,
  StoreIcon,
  TargetIcon,
  WalletIcon,
  CalendarIcon,
  BriefcaseIcon,
  ArrowDownToLineIcon,
  CreditCardIcon,
  SettingsIcon,
} from 'lucide-react';

export function DashboardLayout() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const bottomNavItems = useMemo(
    () => [
      { label: 'Home', to: '/dashboard', icon: LayoutDashboardIcon },
      { label: 'Plans', to: '/plans', icon: TargetIcon },
      { label: 'Wallet', to: '/wallet', icon: WalletIcon },
      { label: 'Shop', to: '/marketplace/my-listings', icon: StoreIcon },
    ],
    [],
  );

  const moreItems = useMemo(
    () => [
      { label: 'Daily Payments', to: '/calendar', icon: CalendarIcon },
      { label: 'Our Services', to: '/services', icon: BriefcaseIcon },
      { label: 'My Loans', to: '/my-loans', icon: CreditCardIcon },
      { label: 'Withdraw', to: '/withdraw', icon: ArrowDownToLineIcon },
      { label: 'Settings', to: '/profile', icon: SettingsIcon },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar isOpen={false} setIsOpen={() => {}} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-2">
            <div className="h-16 grid grid-cols-5">
              {bottomNavItems.map((item) => {
                const active =
                  location.pathname === item.to ||
                  (item.to === '/marketplace/my-listings' &&
                    location.pathname.startsWith('/marketplace'));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${active ? 'text-ajo-700' : 'text-ink-muted'}`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-ajo-600' : 'text-ink-muted'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-ink-muted"
              >
                <MoreHorizontalIcon className="w-5 h-5" />
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile More Sheet */}
        <AnimatePresence>
          {moreOpen ? (
            <div className="lg:hidden fixed inset-0 z-50">
              <motion.button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-4"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="grid grid-cols-2 gap-3">
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() => {
                          setMoreOpen(false);
                          navigate(item.to);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                          <Icon className="w-5 h-5 text-ajo-700" />
                        </div>
                        <div className="text-sm font-semibold text-ink">{item.label}</div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}