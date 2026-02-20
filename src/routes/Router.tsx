import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthGuard from './AuthGuard';
import AppShellLayout from '@components/layout/AppShell';
import { ApiHelpProvider } from '@contexts/ApiHelpContext';
import PageLoading from '@components/loader/PageLoading';

const LandingPage = lazy(() => import('@pages/landing/LandingPage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const LibrariesPage = lazy(() => import('@pages/crud/LibrariesPage'));
const ProductsPage = lazy(() => import('@pages/crud/ProductsPage'));
const CollectionsPage = lazy(() => import('@pages/products/CollectionsPage'));
const InventoryPage = lazy(() => import('@pages/products/InventoryPage'));
const ProductDetailPage = lazy(() => import('@pages/products/ProductDetailPage'));
const MenuItemsPage = lazy(() => import('@pages/crud/MenuItemsPage'));
const MenuItemDetailPage = lazy(() => import('@pages/menu/MenuItemDetailPage'));
const OrdersPage = lazy(() => import('@pages/crud/OrdersPage'));
const CustomersPage = lazy(() => import('@pages/crud/CustomersPage'));
const DeliveriesPage = lazy(() => import('@pages/crud/DeliveriesPage'));
const ReservationsPage = lazy(() => import('@pages/crud/ReservationsPage'));
const KioskPage = lazy(() => import('@pages/kiosk/KioskPage'));
const KitchenTicketsPage = lazy(() => import('@pages/crud/KitchenTicketsPage'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<Suspense fallback={<PageLoading />}><AuthGuard /></Suspense>}>
        <Route element={<ApiHelpProvider><AppShellLayout /></ApiHelpProvider>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/libraries" element={<LibrariesPage />} />
          <Route path="/dashboard/products" element={<ProductsPage />} />
          <Route path="/dashboard/products/collections" element={<CollectionsPage />} />
          <Route path="/dashboard/products/collections/:categoryId" element={<CollectionsPage />} />
          <Route path="/dashboard/products/inventory" element={<InventoryPage />} />
          <Route path="/dashboard/products/:id" element={<ProductDetailPage />} />
          <Route path="/dashboard/menu-items" element={<MenuItemsPage />} />
          <Route path="/dashboard/menu-items/:id" element={<MenuItemDetailPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route path="/dashboard/deliveries" element={<DeliveriesPage />} />
          <Route path="/dashboard/reservations" element={<ReservationsPage />} />
          <Route path="/dashboard/kiosk" element={<KioskPage />} />
          <Route path="/dashboard/kitchen-tickets" element={<KitchenTicketsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

export default router;
