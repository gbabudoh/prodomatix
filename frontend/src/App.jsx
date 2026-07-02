import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import BusinessDetailPage from './pages/BusinessDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import PlatformGuidePage from './pages/PlatformGuidePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DataPolicyPage from './pages/DataPolicyPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Overview from './pages/admin/sections/Overview.jsx';
import Businesses from './pages/admin/sections/Businesses.jsx';
import Users from './pages/admin/sections/Users.jsx';
import Orders from './pages/admin/sections/Orders.jsx';
import Audit from './pages/admin/sections/Audit.jsx';
import Security from './pages/admin/sections/Security.jsx';
import Insights from './pages/admin/sections/Insights.jsx';
import { useAuth } from './store/AuthContext.jsx';
import CookieBanner from './components/CookieBanner.jsx';
import Analytics from './components/Analytics.jsx';

// Scroll to top on every route change.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Authenticated app shell with header.
function Shell({ children }) {
  return (
    <div className="app">
      <Header />
      {children}
    </div>
  );
}

// Root: marketing homepage for visitors; redirect logged-in users to the marketplace.
function RootPage() {
  const { user, loading } = useAuth();
  if (loading) return <div className="full-loading">Loading…</div>;
  if (user) return <Navigate to="/browse" replace />;
  return <HowItWorksPage />;
}

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Analytics />
    <CookieBanner />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/how-it-works"   element={<PlatformGuidePage />} />
      <Route path="/about"          element={<AboutPage />} />
      <Route path="/verify-email"   element={<VerifyEmailPage />} />
      <Route path="/data-policy"    element={<DataPolicyPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/" element={<RootPage />} />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <Shell><BrowsePage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id"
        element={
          <ProtectedRoute>
            <Shell><BusinessDetailPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Shell><CheckoutPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/success/:purchaseId"
        element={
          <ProtectedRoute>
            <Shell><SuccessPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Shell><DashboardPage /></Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly loginPath="/admin/login">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="audit" element={<Audit />} />
        <Route path="security" element={<Security />} />
        <Route path="insights" element={<Insights />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
