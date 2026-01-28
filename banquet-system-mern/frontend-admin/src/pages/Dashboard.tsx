import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BookingTable from '../components/BookingTable';
import { fetchBookings, Booking, BookingStatus } from '../api/bookings';
import { getCurrentUser } from '../api/auth';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const location = useLocation();
    const user = getCurrentUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Determine filter based on route
    const getFilterStatus = (): BookingStatus | 'ALL' => {
        if (location.pathname.includes('/docs')) return 'PENDING_ADMIN1';
        if (location.pathname.includes('/payments')) return 'PENDING_ADMIN2';
        if (location.pathname.includes('/final')) return 'PENDING_ADMIN3';
        // Note: PAYMENT_REQUESTED and PAYMENT_VERIFIED are handled in the ALL view
        // Customers handle payment, then it moves to PENDING_ADMIN3
        return 'ALL';
    };

    const getPageTitle = () => {
        if (location.pathname.includes('/docs')) return 'Document Verification (Gate 1)';
        if (location.pathname.includes('/payments')) return 'Payment Verification (Gate 2)';
        if (location.pathname.includes('/final')) return 'Final Approval (Gate 3)';
        if (location.pathname.includes('/staff')) return 'Staff Management';
        return 'Dashboard Overview';
    };

    const loadBookings = async () => {
        setLoading(true);
        try {
            const status = getFilterStatus();
            const data = await fetchBookings(status);
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!location.pathname.includes('/staff')) {
            loadBookings();
        }
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-secondary">{getPageTitle()}</h1>
                            {user && (
                                <p className="text-gray-600 mt-1">
                                    Welcome back, <span className="font-medium">{user.email}</span>
                                </p>
                            )}
                        </div>
                        {!location.pathname.includes('/staff') && (
                            <button
                                onClick={loadBookings}
                                disabled={loading}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                        )}
                    </div>

                    {location.pathname.includes('/staff') ? (
                        <div className="card">
                            <p className="text-gray-600">Staff management interface coming soon...</p>
                        </div>
                    ) : loading ? (
                        <div className="card text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-600">Loading bookings...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex gap-4">
                                <div className="card flex-1">
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold text-secondary mt-1">{bookings.length}</p>
                                </div>
                                <div className="card flex-1">
                                    <p className="text-sm text-gray-600">Pending Action</p>
                                    <p className="text-2xl font-bold text-primary mt-1">
                                        {bookings.filter(b => b.status === getFilterStatus()).length}
                                    </p>
                                </div>
                            </div>
                            <BookingTable bookings={bookings} onUpdate={loadBookings} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
