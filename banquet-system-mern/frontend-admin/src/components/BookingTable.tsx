import { useState } from 'react';
import { Booking, approveGate1, approveGate2, approveGate3, rejectBooking } from '../api/bookings';
import { getCurrentUser } from '../api/auth';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface BookingTableProps {
    bookings: Booking[];
    onUpdate: () => void;
}

const BookingTable = ({ bookings, onUpdate }: BookingTableProps) => {
    const user = getCurrentUser();
    const [loading, setLoading] = useState<string | null>(null);

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING_ADMIN1: 'bg-yellow-100 text-yellow-800',
            PENDING_ADMIN2: 'bg-blue-100 text-blue-800',
            PAYMENT_REQUESTED: 'bg-orange-100 text-orange-800',
            PAYMENT_VERIFIED: 'bg-purple-100 text-purple-800',
            PENDING_ADMIN3: 'bg-purple-100 text-purple-800',
            APPROVED: 'bg-emerald-100 text-emerald-800',
            REJECTED: 'bg-red-100 text-red-800',
            CANCELLED: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', styles[status as keyof typeof styles])}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const handleApprove = async (booking: Booking) => {
        setLoading(booking._id);
        try {
            if (booking.status === 'PENDING_ADMIN1' && user?.role === 'ADMIN1') {
                await approveGate1(booking._id);
            } else if (booking.status === 'PENDING_ADMIN2' && user?.role === 'ADMIN2') {
                await approveGate2(booking._id);
            } else if (booking.status === 'PENDING_ADMIN3' && user?.role === 'SUPERADMIN') {
                await approveGate3(booking._id);
            }
            onUpdate();
        } catch (error) {
            console.error('Approval failed:', error);
            alert('Failed to approve booking');
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async (booking: Booking) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        setLoading(booking._id);
        try {
            await rejectBooking(booking._id, reason);
            onUpdate();
        } catch (error) {
            console.error('Rejection failed:', error);
            alert('Failed to reject booking');
        } finally {
            setLoading(null);
        }
    };

    const canApprove = (booking: Booking) => {
        if (!user) return false;
        if (booking.status === 'PENDING_ADMIN1' && user.role === 'ADMIN1') return true;
        if (booking.status === 'PENDING_ADMIN2' && user.role === 'ADMIN2') return true;
        if (booking.status === 'PENDING_ADMIN3' && user.role === 'SUPERADMIN') return true;
        return false;
    };

    const canReject = (booking: Booking) => {
        if (!user) return false;
        if (['APPROVED', 'REJECTED', 'CANCELLED', 'PAYMENT_REQUESTED', 'PAYMENT_VERIFIED'].includes(booking.status)) return false;
        return true;
    };

    const getActionLabel = (booking: Booking) => {
        if (booking.status === 'PENDING_ADMIN1') return 'Verify Documents';
        if (booking.status === 'PENDING_ADMIN2') return 'Request Payment';
        if (booking.status === 'PENDING_ADMIN3') return 'Final Approval';
        return 'Approve';
    };

    if (bookings.length === 0) {
        return (
            <div className="card text-center py-12">
                <p className="text-gray-500">No bookings found</p>
            </div>
        );
    }

    return (
        <div className="card overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Hall</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Slots</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <div>
                                    <p className="font-medium text-gray-900">{booking.userId.name}</p>
                                    <p className="text-sm text-gray-500">{booking.userId.email}</p>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{booking.hallId.name}</td>
                            <td className="py-3 px-4 text-gray-700">
                                {new Date(booking.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-700">{booking.slotIndices.length} slots</td>
                            <td className="py-3 px-4">{getStatusBadge(booking.status)}</td>
                            <td className="py-3 px-4">
                                <span className={cn(
                                    'px-2 py-1 rounded text-xs font-medium',
                                    booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                        booking.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                )}>
                                    {booking.paymentStatus}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex justify-end gap-2">
                                    {canApprove(booking) && (
                                        <button
                                            onClick={() => handleApprove(booking)}
                                            disabled={loading === booking._id}
                                            className="btn-primary flex items-center gap-2 text-sm"
                                        >
                                            <CheckCircle size={16} />
                                            {loading === booking._id ? 'Processing...' : getActionLabel(booking)}
                                        </button>
                                    )}
                                    {canReject(booking) && (
                                        <button
                                            onClick={() => handleReject(booking)}
                                            disabled={loading === booking._id}
                                            className="btn-danger flex items-center gap-2 text-sm"
                                        >
                                            <XCircle size={16} />
                                            Reject
                                        </button>
                                    )}
                                    {!canApprove(booking) && !canReject(booking) && (
                                        <span className="text-sm text-gray-500 italic">No actions available</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingTable;
