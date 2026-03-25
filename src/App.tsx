import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AjoPlanPage } from "./pages/AjoPlanPage";
import { CalendarPage } from "./pages/CalendarPage";
import { WalletPage } from "./pages/WalletPage";
import { WithdrawPage } from "./pages/WithdrawPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ProductPage } from "./pages/ProductPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ServicesPage } from "./pages/ServicesPage";
import { LoanApplicationPage } from "./pages/LoanApplicationPage";
import { MyLoansPage } from "./pages/MyLoansPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
export function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Route */}
        <Route element={<ProtectedRoute redirectTo="/admin/login" />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/plans" element={<AjoPlanPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/loan-application" element={<LoanApplicationPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
