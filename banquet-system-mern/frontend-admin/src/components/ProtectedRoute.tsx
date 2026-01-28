import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard/overview" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
