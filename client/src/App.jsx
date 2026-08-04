import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyerOnboarding from './pages/BuyerOnboarding';
import SupplierOnboarding from './pages/SupplierOnboarding';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import Inventory from './pages/Inventory';
import SupplierOrders from './pages/SupplierOrders';
import SupplierProfile from './pages/SupplierProfile';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'supplier' ? '/supplier' : '/'} replace />;
  return children;
}

function OnboardingGuard({ children, role }) {
  const { user } = useAuth();
  const profile = role === 'buyer' ? user?.buyerProfile : user?.supplierProfile;
  if (profile?.onboardingComplete) {
    return <Navigate to={role === 'buyer' ? '/dashboard' : '/supplier'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="onboarding/buyer" element={
          <ProtectedRoute role="buyer">
            <OnboardingGuard role="buyer"><BuyerOnboarding /></OnboardingGuard>
          </ProtectedRoute>
        } />
        <Route path="onboarding/supplier" element={
          <ProtectedRoute role="supplier">
            <OnboardingGuard role="supplier"><SupplierOnboarding /></OnboardingGuard>
          </ProtectedRoute>
        } />

        <Route path="cart" element={<ProtectedRoute role="buyer"><Cart /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>} />
        <Route path="order-confirmation" element={<ProtectedRoute role="buyer"><OrderConfirmation /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />

        <Route path="supplier" element={<ProtectedRoute role="supplier"><SupplierDashboard /></ProtectedRoute>} />
        <Route path="supplier/inventory" element={<ProtectedRoute role="supplier"><Inventory /></ProtectedRoute>} />
        <Route path="supplier/orders" element={<ProtectedRoute role="supplier"><SupplierOrders /></ProtectedRoute>} />
        <Route path="supplier/profile" element={<ProtectedRoute role="supplier"><SupplierProfile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
