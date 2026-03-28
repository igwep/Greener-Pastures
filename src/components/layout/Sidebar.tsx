import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import {
  LayoutDashboardIcon,
  TargetIcon,
  CalendarIcon,
  WalletIcon,
  CreditCardIcon,
  ArrowDownToLineIcon,
  StoreIcon,
  SettingsIcon,
  LogOutIcon,
  BriefcaseIcon,
} from "lucide-react";
import { clearSession } from "../../services/auth/session";
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export function Sidebar(_props: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navGroups = [
    {
      label: "SAVINGS",
      links: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboardIcon,
        },
        {
          name: "My Ajo Plans",
          path: "/plans",
          icon: TargetIcon,
        },
        {
          name: "Daily Payments",
          path: "/calendar",
          icon: CalendarIcon,
        },
      ],
    },
    {
      label: "SERVICES",
      links: [
        {
          name: "Our Services",
          path: "/services",
          icon: BriefcaseIcon,
        },
      ],
    },
    {
      label: "FINANCE",
      links: [
        {
          name: "Wallet",
          path: "/wallet",
          icon: WalletIcon,
        },
        {
          name: "My Loans",
          path: "/my-loans",
          icon: CreditCardIcon,
        },
        {
          name: "Withdraw",
          path: "/withdraw",
          icon: ArrowDownToLineIcon,
        },
      ],
    },
    {
      label: "SHOP",
      links: [
        {
          name: "Marketplace",
          path: "/marketplace/my-listings",
          icon: StoreIcon,
        },
      ],
    },
    {
      label: "ACCOUNT",
      links: [
        {
          name: "Settings",
          path: "/profile",
          icon: SettingsIcon,
        },
      ],
    },
  ];

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:h-screen lg:flex lg:w-64 bg-ajo-900 text-white flex-col">
      <div className="h-20 flex items-center justify-between px-6 border-b border-ajo-800/50 shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="Greener Pastures"
            className="w-10 h-10 rounded-xl object-cover shadow-sm"
          />
          <span className="font-bold text-xl tracking-tight leading-tight text-ink bg-gradient-to-r from-ink to-secondary-700 bg-clip-text text-transparent">
            Greener
            <br />
            Pastures
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex > 0 ? "mt-8" : ""}>
            <h3 className="text-[10px] uppercase tracking-widest text-ajo-400/70 px-3 mb-3 font-semibold">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.links.map((link) => {
                const active = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? "bg-ajo-600/20 text-white font-medium" : "text-gray-400 hover:bg-ajo-800/50 hover:text-gray-200"}`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-ajo-400" : "text-gray-500"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-ajo-800/50 shrink-0">
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
          onClick={() => {
            setLogoutOpen(true);
          }}
        >
          <LogOutIcon className="w-4 h-4" />
          Logout
        </button>
        <div className="bg-gradient-to-br from-ajo-800/40 to-ajo-900/40 border border-ajo-700/30 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-ajo-600/20 rounded-full blur-xl"></div>
          <p className="text-sm font-medium text-white mb-1 relative z-10">
            Need help?
          </p>
          <p className="text-xs text-gray-400 mb-4 relative z-10">
            Chat with our support team
          </p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors relative z-10">
            Contact Support
          </button>
        </div>
      </div>

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
    </aside>
  );
}
