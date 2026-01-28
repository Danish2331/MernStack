import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, CreditCard, CheckCircle, Users, LogOut } from 'lucide-react';
import { getCurrentUser, logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        {
            path: '/dashboard/overview',
            icon: LayoutDashboard,
            label: 'Overview',
            roles: ['SUPERADMIN'],
        },
        {
            path: '/dashboard/docs',
            icon: FileText,
            label: 'Document Verification',
            roles: ['ADMIN1', 'SUPERADMIN'],
        },
        {
            path: '/dashboard/payments',
            icon: CreditCard,
            label: 'Payment Verification',
            roles: ['ADMIN2', 'SUPERADMIN'],
        },
        {
            path: '/dashboard/final',
            icon: CheckCircle,
            label: 'Final Approval',
            roles: ['SUPERADMIN'],
        },
        {
            path: '/dashboard/staff',
            icon: Users,
            label: 'Staff Management',
            roles: ['SUPERADMIN', 'ADMIN2'],
        },
    ];

    const visibleItems = menuItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="w-64 bg-secondary min-h-screen text-white flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-serif font-bold text-primary">Admin Portal</h1>
                {user && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-300">{user.email}</p>
                        <p className="text-xs text-primary font-medium mt-1">{user.role}</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                            ? 'bg-primary text-white'
                                            : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 w-full transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
