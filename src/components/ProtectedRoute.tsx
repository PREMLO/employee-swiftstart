
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

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
  const { user, loading, isAdmin, currentOnboardingStep } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const checkRouteAccess = async () => {
      // Wait for auth loading to complete
      if (loading) return;

      // If we need specific onboarding step and user is authenticated
      if (requireAuth && user && requiredStep) {
        // If user is admin, they can bypass onboarding steps
        if (!isAdmin) {
          // Get the steps in order
          const steps = ['agreement', 'profile-info', 'document-upload', 'application-status', 'completed'];
          const currentStepIndex = steps.indexOf(currentOnboardingStep);
          const requiredStepIndex = steps.indexOf(requiredStep);

          // User hasn't completed previous steps, redirect to their current step
          if (currentStepIndex < requiredStepIndex) {
            switch (currentOnboardingStep) {
              case 'agreement':
                setRedirectPath('/agreement');
                setShouldRedirect(true);
                break;
              case 'profile-info':
                setRedirectPath('/profile-info');
                setShouldRedirect(true);
                break;
              case 'document-upload':
                setRedirectPath('/document-upload');
                setShouldRedirect(true);
                break;
              case 'application-status':
                setRedirectPath('/application-status');
                setShouldRedirect(true);
                break;
            }
          }
        }
      }

      setIsChecking(false);
    };

    checkRouteAccess();
  }, [loading, user, isAdmin, currentOnboardingStep, requireAuth, requiredStep]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If we should redirect to a specific path in the onboarding flow
  if (shouldRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
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
