import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import {
  UsersIcon,
  TargetIcon,
  WalletIcon,
  SproutIcon,
  CreditCardIcon,
  FileTextIcon,
  SettingsIcon,
  ShoppingBagIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { UserManagement } from "./admin/UserManagement";
import { Overview } from "./admin/Overview";
import { Loans } from "./admin/Loans";
import { DepositsPage } from "./admin/DepositsPage";
import { WithdrawalsPage } from "./admin/WithdrawalsPage";
import { Repayments } from "./admin/Repayments";
import { Settings } from "./admin/Settings";
import { Marketplace } from "./admin/Marketplace";
import { AddProductPage as AdminAddProductPage } from "./admin/AddProductPage";
import { AdminPlansPage } from "./admin/AdminPlansPage";
import { AdminCategoriesPage } from "./admin/AdminCategoriesPage";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "users"
    | "loans"
    | "deposits"
    | "withdrawals"
    | "repayments"
    | "settings"
    | "marketplace"
    | "marketplaceAdd"
    | "plans"
    | "categories"
  >("overview");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navItems = useMemo(
    () => [
      { label: "Dashboard", tab: "overview", icon: SproutIcon },
      { label: "Users", tab: "users", icon: UsersIcon },
      { label: "Loans", tab: "loans", icon: CreditCardIcon },
      { label: "Deposits", tab: "deposits", icon: WalletIcon },
      { label: "Withdrawals", tab: "withdrawals", icon: TargetIcon },
      { label: "Repayments", tab: "repayments", icon: FileTextIcon },
      { label: "Settings", tab: "settings", icon: SettingsIcon },
      { label: "Marketplace", tab: "marketplace", icon: ShoppingBagIcon },
      { label: "Categories", tab: "categories", icon: TargetIcon },
      { label: "Savings Plans", tab: "plans", icon: TargetIcon },
    ],
    [],
  );

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
    document.body.style.overflow = "unset";
    return;
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-ink text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800 shrink-0">
          <div className="w-8 h-8 bg-ajo-600 rounded-lg flex items-center justify-center shadow-sm">
            <SproutIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg leading-tight">
            Greener Pastures
            <br />
            <span className="text-gray-400 text-sm font-medium">Admin</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.tab
                  ? "bg-ajo-600 text-white shadow-lg shadow-ajo-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-800">
            {["Savings Plans", "Withdrawals", "Marketplace"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen ? (
          <div className="lg:hidden fixed inset-0" style={{ zIndex: 2147483640 }}>
            <motion.button
              type="button"
              aria-label="Close admin menu"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-ink text-white flex flex-col"
            >
              <div className="h-20 flex items-center justify-between gap-3 px-6 border-b border-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ajo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <SproutIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg leading-tight">
                    Greener Pastures
                    <br />
                    <span className="text-gray-400 text-sm font-medium">Admin</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab as any);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === item.tab
                        ? "bg-ajo-600 text-white shadow-lg shadow-ajo-600/20"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-800 shrink-0">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    handleLogoutClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="max-w-6xl mx-auto space-y-8 pb-12"
        >
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              <MenuIcon className="w-5 h-5 text-ink" />
            </button>
            <h1 className="text-3xl font-bold text-ink tracking-tight">
              {activeTab === "overview" && "Admin Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "loans" && "Loan Management"}
              {activeTab === "deposits" && "Deposits Management"}
              {activeTab === "withdrawals" && "Withdrawals Management"}
              {activeTab === "repayments" && "Loan Repayments"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "marketplace" && "Marketplace Management"}
              {activeTab === "marketplaceAdd" && "Add Marketplace Product"}
              {activeTab === "categories" && "Marketplace Categories"}
              {activeTab === "plans" && "Savings Plans"}
            </h1>
          </div>

          {activeTab === "overview" && <Overview />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "loans" && <Loans />}
          {activeTab === "deposits" && <DepositsPage />}
          {activeTab === "withdrawals" && <WithdrawalsPage />}
          {activeTab === "repayments" && <Repayments />}
          {activeTab === "settings" && <Settings />}
          {activeTab === "marketplace" && (
            <Marketplace onAddProduct={() => setActiveTab("marketplaceAdd")} />
          )}
          {activeTab === "marketplaceAdd" && (
            <AdminAddProductPage onBack={() => setActiveTab("marketplace")} />
          )}
          {activeTab === "categories" && <AdminCategoriesPage />}
          {activeTab === "plans" && <AdminPlansPage />}
        </motion.div>
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        title="Confirm Logout"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={handleCancelLogout}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <LogOutIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Are you sure you want to logout?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                You will need to login again to access the admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
