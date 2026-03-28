import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AjoPlanPage } from "./pages/AjoPlanPage";
import { CalendarPage } from "./pages/CalendarPage";
import { WalletPage } from "./pages/WalletPage";
import { WithdrawPage } from "./pages/WithdrawPage";
import { ProductPage } from "./pages/ProductPage";
import { MarketplaceInventoryPage } from "./pages/MarketplaceInventoryPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { AddProductPage } from "./pages/AddProductPage";
import { EditProductPage } from "./pages/EditProductPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ServicesPage } from "./pages/ServicesPage";
import { LoanApplicationPage } from "./pages/LoanApplicationPage";
import { MyLoansPage } from "./pages/MyLoansPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AboutPage } from "./pages/AboutPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";
export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes - These should be checked first */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/product/:id" element={<ProductPage />} />

            {/* Admin Route */}
            <Route element={<ProtectedRoute redirectTo="/admin/login" />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>

            {/* User Dashboard Routes - These should be checked after public routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/plans" element={<AjoPlanPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/marketplace/my-listings" element={<MarketplaceInventoryPage />} />
                <Route path="/marketplace/add-product" element={<AddProductPage />} />
                <Route path="/marketplace/edit-product/:id" element={<EditProductPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/loan-application" element={<LoanApplicationPage />} />
                <Route path="/my-loans" element={<MyLoansPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
