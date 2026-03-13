import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuIcon, BellIcon, SearchIcon, ChevronRightIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
interface NavbarProps {
  onMenuClick: () => void;
}
export function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
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
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-ink-secondary hover:bg-gray-100 rounded-xl transition-colors">
          
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center text-sm font-medium text-ink-muted">
          <span>Greener Pastures</span>
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-300" />
          <span className="text-ink">{getPageTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative w-72">
          <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search transactions, plans..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-transparent focus:border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-ajo-600/20 outline-none transition-all" />
          
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2.5 text-ink-secondary hover:bg-gray-100 rounded-xl transition-colors">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-gray-100">
            <Avatar initials="AO" size="sm" className="w-9 h-9" />
            <div className="hidden sm:block text-sm">
              <p className="font-semibold text-ink leading-none mb-1">
                Adaeze Okonkwo
              </p>
              <p className="text-xs text-ink-muted leading-none">Saver</p>
            </div>
          </div>
        </div>
      </div>
    </header>);

}