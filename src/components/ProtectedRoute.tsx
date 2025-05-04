
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

type ProtectedRouteProps = {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  requiredStep?: string;
};

const ProtectedRoute = ({
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/login',
  requiredStep
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If admin access is required and user is not admin, redirect to user dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  // If user is already logged in and tries to access login page, redirect to dashboard
  if (!requireAuth && user) {
    return <Navigate to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
