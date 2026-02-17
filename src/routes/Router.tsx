import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthGuard from './AuthGuard';
import PageLoading from '@components/loader/PageLoading';

const LandingPage = lazy(() => import('@pages/landing/LandingPage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public marketing site */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected app */}
      <Route
        element={
          <Suspense fallback={<PageLoading />}>
            <AuthGuard />
          </Suspense>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

export default router;
