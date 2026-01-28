import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. FAIL-SAFE: Check Storage Directly
  // This bypasses any Context latency. If token is in storage, we let them through.
  const hasStorageToken = !!localStorage.getItem('token');

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // logic: If NO context auth AND NO storage token, then redirect.
  // If either is present, we render children (assuming context will catch up if it's lagging, but pure sync context shouldn't lag).
  if (!isAuthenticated && !hasStorageToken) {
    // Only redirect if we are absolutely sure they are not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
