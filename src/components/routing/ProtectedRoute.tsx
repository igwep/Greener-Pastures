import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredToken } from '../../services/auth/session';

type ProtectedRouteProps = {
  redirectTo?: string;
  children?: React.ReactNode;
};

export function ProtectedRoute({ redirectTo = '/login', children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (children) return <>{children}</>;

  return <Outlet />;
}
