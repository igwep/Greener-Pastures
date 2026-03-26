import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import {
  UsersIcon,
  TargetIcon,
  WalletIcon,
  AlertCircleIcon,
  CheckIcon,
  XIcon,
  SproutIcon,
  CreditCardIcon,
  FileTextIcon,
  SearchIcon,
  ChevronDownIcon,
  SettingsIcon,
  ShoppingBagIcon,
  LogOutIcon,
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

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "users"
    | "loans"
    | "deposits"
    | "withdrawals"
    | "repayments"
    | "settings"
    | "marketplace"
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

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-ink text-white hidden lg:flex flex-col">
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
          {[
            { label: "Dashboard", tab: "overview", icon: SproutIcon },
            { label: "Users", tab: "users", icon: UsersIcon },
            { label: "Loans", tab: "loans", icon: CreditCardIcon },
            { label: "Deposits", tab: "deposits", icon: WalletIcon },
            { label: "Withdrawals", tab: "withdrawals", icon: TargetIcon },
            { label: "Repayments", tab: "repayments", icon: FileTextIcon },
            { label: "Settings", tab: "settings", icon: SettingsIcon },
            { label: "Marketplace", tab: "marketplace", icon: ShoppingBagIcon },
          ].map((item) => (
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

      <main className="flex-1 p-8 overflow-y-auto">
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-ink tracking-tight">
              {activeTab === "overview" && "Admin Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "loans" && "Loan Management"}
              {activeTab === "deposits" && "Deposits Management"}
              {activeTab === "withdrawals" && "Withdrawals Management"}
              {activeTab === "repayments" && "Loan Repayments"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "marketplace" && "Marketplace Management"}
            </h1>
          </div>

          {activeTab === "overview" && <Overview />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "loans" && <Loans />}
          {activeTab === "deposits" && <DepositsPage />}
          {activeTab === "withdrawals" && <WithdrawalsPage />}
          {activeTab === "repayments" && <Repayments />}
          {activeTab === "settings" && <Settings />}
          {activeTab === "marketplace" && <Marketplace />}
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
