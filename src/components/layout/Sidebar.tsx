import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  TargetIcon,
  CalendarIcon,
  WalletIcon,
  CreditCardIcon,
  ArrowDownToLineIcon,
  StoreIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  XIcon,
  SproutIcon,
  BriefcaseIcon,
} from "lucide-react";
import { clearSession } from "../../services/auth/session";
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
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
          path: "/marketplace",
          icon: StoreIcon,
        },
      ],
    },
    {
      label: "ACCOUNT",
      links: [
        {
          name: "Profile",
          path: "/profile",
          icon: UserIcon,
        },
        {
          name: "Settings",
          path: "/profile",
          icon: SettingsIcon,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-ajo-900 text-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-ajo-800/50 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ajo-600 rounded-xl flex items-center justify-center shadow-sm">
              <SproutIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight leading-tight">
              Greener
              <br />
              Pastures
            </span>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex > 0 ? "mt-8" : ""}>
              <h3 className="text-[10px] uppercase tracking-widest text-ajo-400/70 px-3 mb-3 font-semibold">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? "bg-ajo-600/20 text-white font-medium" : "text-gray-400 hover:bg-ajo-800/50 hover:text-gray-200"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-ajo-400" : "text-gray-500"}`}
                      />

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
              clearSession();
              setIsOpen(false);
              navigate("/login");
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
      </aside>
    </>
  );
}
