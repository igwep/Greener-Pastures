import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, LogOutIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardSummaryQuery } from '../../services/dashboard/hooks';
import { clearSession } from '../../services/auth/session';
interface NavbarProps {
}
export function Navbar({}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { user: authUser, isAuthenticated } = useAuth();
  const { data: summary } = useDashboardSummaryQuery(isAuthenticated);

  const user = (summary as any)?.user ?? (authUser as any);
  const displayName = useMemo(() => {
    const fullName = user?.fullName ?? user?.name;
    const firstName = user?.firstName;
    const lastName = user?.lastName;

    if (typeof fullName === 'string' && fullName.trim()) return fullName.trim();
    if (typeof firstName === 'string' && firstName.trim()) {
      if (typeof lastName === 'string' && lastName.trim()) {
        return `${firstName.trim()} ${lastName.trim()}`;
      }
      return firstName.trim();
    }

    return 'User';
  }, [user]);

  const initials = useMemo(() => {
    const parts = displayName
      .split(' ')
      .map((p) => p.trim())
      .filter(Boolean);
    const first = parts[0]?.[0] ?? 'U';
    const second = (parts[1]?.[0] ?? parts[0]?.[1] ?? '').toString();
    return (first + second).toUpperCase();
  }, [displayName]);

  // Simple logic to get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/plans') return 'My Ajo Plans';
    if (path === '/calendar') return 'Daily Payments';
    if (path === '/wallet') return 'Wallet';
    if (path === '/withdraw') return 'Withdraw';
    if (path === '/marketplace') return 'Marketplace';
    if (path.startsWith('/product')) return 'Product Details';
    if (path === '/profile') return 'Profile Settings';
    return 'Dashboard';
  };
  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 text-ink-secondary hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => {
              setLogoutOpen(true);
            }}
            aria-label="Logout"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>

          <div className="hidden lg:flex items-center text-sm font-medium text-ink-muted">
            <span>Greener Pastures</span>
            <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-300" />
            <span className="text-ink">{getPageTitle()}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-gray-100">
              <Avatar initials={initials} size="sm" className="w-9 h-9" />
              <div className="hidden sm:block text-sm">
                <p className="font-semibold text-ink leading-none mb-1">
                  {displayName}
                </p>
                <p className="text-xs text-ink-muted leading-none">Saver</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Confirm Logout"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="ghost" className="flex-1" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                clearSession();
                setLogoutOpen(false);
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        }
      >
        <div className="text-sm text-ink-secondary">
          Are you sure you want to log out?
        </div>
      </Modal>
    </>
  );
}