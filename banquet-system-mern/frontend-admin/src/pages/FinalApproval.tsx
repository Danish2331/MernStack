import { useEffect, useState } from 'react';
import client from '../api/client';
import { Star, Check, X } from 'lucide-react';

interface Booking {
    _id: string;
    customerId: { name: string } | null;
    halls: { name: string }[];
    eventDate: string;
    status: string;
}

const FinalApproval = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selected, setSelected] = useState<Booking | null>(null);

    const fetchItems = async () => {
        try {
            const res = await client.get('/admin/dashboard');
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchItems(); }, []);

    const approve = async () => {
        if (!selected) return;
        try {
            await client.post(`/admin/process/${selected._id}`, { decision: 'FINAL_APPROVE' });
            setBookings(prev => prev.filter(b => b._id !== selected._id));
            setSelected(null);
            alert("Booking Finalized!");
        } catch (err: any) {
            alert("Error: " + err.response?.data?.message);
        }
    };

    return (
        <div className="flex gap-6 p-6">
            <div className="w-1/3 bg-white shadow rounded overflow-hidden">
                <div className="p-4 bg-purple-700 text-white font-bold">Final Approval Queue</div>
                {bookings.map(b => (
                    <div key={b._id} onClick={() => setSelected(b)} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                        <div className="font-bold">{b.customerId?.name}</div>
                        <div className="text-xs text-gray-500">{new Date(b.eventDate).toDateString()}</div>
                    </div>
                ))}
                {bookings.length === 0 && <div className="p-4 text-gray-400">No bookings awaiting final approval.</div>}
            </div>

            <div className="flex-1 bg-white shadow rounded p-8 flex flex-col items-center justify-center">
                {selected ? (
                    <div className="text-center">
                        <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                            <Star className="text-purple-600" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Finalize Booking?</h2>
                        <p className="mb-6 text-gray-600">This will lock the hall and send confirmation to the user.</p>

                        <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-6 rounded mb-8">
                            <div><strong>Hall:</strong> {selected.halls[0]?.name}</div>
                            <div><strong>Date:</strong> {new Date(selected.eventDate).toDateString()}</div>
                        </div>

                        <button onClick={approve} className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition">
                            Confirm Booking
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-400">Select a booking</p>
                )}
            </div>
        </div>
    );
};

export default FinalApproval;
