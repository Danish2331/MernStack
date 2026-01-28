import { useEffect, useState } from 'react';
import client from '../api/client';
import { DollarSign, Check, X, Calendar, User } from 'lucide-react';

interface Booking {
    _id: string;
    customerId: { name: string; email: string } | null;
    halls: { name: string }[];
    eventDate: string;
    status: string;
}

const PaymentVerification = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await client.get('/admin/dashboard');
            setBookings(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, []);

    const processItem = async (action: 'REQUEST_PAYMENT' | 'VERIFY_FORWARD') => {
        if (!selectedBooking) return;
        setActionLoading(true);
        try {
            // Map generic action to specific Admin2 decisions
            // If status is ADMIN1_APPROVED -> we want REQUEST_PAYMENT
            // If status is PAYMENT_COMPLETED -> we want VERIFY_FORWARD
            await client.post(`/admin/process/${selectedBooking._id}`, { decision: action });
            setBookings(prev => prev.filter(b => b._id !== selectedBooking._id));
            setSelectedBooking(null);
        } catch (err: any) {
            alert("Error: " + err.response?.data?.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="flex gap-6 h-[calc(100vh-6rem)]">
            <div className="w-1/3 bg-white rounded shadow overflow-y-auto">
                <div className="p-4 border-b font-bold flex justify-between">
                    <span>Payment Tasks ({bookings.length})</span>
                    <button onClick={fetchItems} className="text-blue-600 text-sm">Refresh</button>
                </div>
                {bookings.map(b => (
                    <div key={b._id} onClick={() => setSelectedBooking(b)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedBooking?._id === b._id ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between">
                            <span className="font-semibold">{b.customerId?.name}</span>
                            <span className={`text-[10px] px-2 rounded ${b.status === 'PAYMENT_COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {b.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">{new Date(b.eventDate).toDateString()}</div>
                    </div>
                ))}
            </div>

            <div className="flex-1 bg-white rounded shadow p-8 flex flex-col justify-center items-center text-center">
                {selectedBooking ? (
                    <div className="max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-2">Manage Booking</h2>
                        <p className="text-gray-500 mb-8">Current State: {selectedBooking.status}</p>

                        <div className="bg-gray-50 p-6 rounded mb-8 text-left">
                            <p><strong>Hall:</strong> {selectedBooking.halls.map(h => h.name).join(', ')}</p>
                            <p><strong>Date:</strong> {new Date(selectedBooking.eventDate).toDateString()}</p>
                            <p><strong>User:</strong> {selectedBooking.customerId?.name}</p>
                        </div>

                        {selectedBooking.status === 'ADMIN1_APPROVED' && (
                            <button onClick={() => processItem('REQUEST_PAYMENT')} disabled={actionLoading}
                                className="w-full py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                                <DollarSign size={20} /> Request Payment
                            </button>
                        )}

                        {selectedBooking.status === 'PAYMENT_COMPLETED' && (
                            <button onClick={() => processItem('VERIFY_FORWARD')} disabled={actionLoading}
                                className="w-full py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 flex justify-center items-center gap-2">
                                <Check size={20} /> Verify & Forward to SuperAdmin
                            </button>
                        )}
                        {selectedBooking.status === 'PAYMENT_REQUESTED' && (
                            <div className="text-orange-600 font-bold border border-orange-200 p-4 rounded bg-orange-50">
                                Waiting for Customer Payment...
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400">Select a booking to process</p>
                )}
            </div>
        </div>
    );
};

export default PaymentVerification;
