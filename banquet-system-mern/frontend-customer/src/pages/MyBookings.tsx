import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, AlertCircle, FileText, DollarSign, CheckCircle } from 'lucide-react';

interface Hall {
  _id: string;
  name: string;
}

interface Booking {
  _id: string;
  halls: Hall[];
  eventDate: string;
  eventTime: string;
  status: string;
  createdAt: string;
}

const MyBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await client.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handlePay = async (id: string) => {
    if (!confirm("Confirm Payment of $500?")) return;
    setPaymentLoading(id);
    try {
      await client.post(`/bookings/${id}/pay`);
      fetchBookings(); // Refresh status
    } catch (err: any) {
      alert("Payment Failed");
    } finally {
      setPaymentLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'ADMIN1_APPROVED': return 'bg-purple-100 text-purple-800';
      case 'PAYMENT_REQUESTED': return 'bg-orange-100 text-orange-800 animate-pulse';
      case 'PAYMENT_COMPLETED': return 'bg-teal-100 text-teal-800';
      case 'FORWARDED_TO_SUPERADMIN': return 'bg-indigo-100 text-indigo-800';
      case 'BOOKED': return 'bg-green-100 text-green-800 border-green-500 border';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Bookings</h1>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded mb-6">{error}</div>}

        {bookings.length === 0 ? (
          <div className="bg-white p-8 text-center rounded shadow">No bookings found. <a href="/book" className="text-primary underline">Book Now</a></div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">#{booking._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                    {booking.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2"><MapPin size={16} /> Venues</h3>
                    {booking.halls?.map(h => <span key={h._id} className="mr-2 bg-gray-100 px-2 py-1 rounded text-xs">{h.name}</span>)}
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2"><Calendar size={16} /> Date</h3>
                    <p className="text-sm">{new Date(booking.eventDate).toDateString()} at {booking.eventTime}</p>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === 'PAYMENT_REQUESTED' && (
                  <div className="px-6 py-4 bg-orange-50 border-t border-orange-100 flex justify-between items-center">
                    <div className="text-orange-800 text-sm">
                      <strong>Action Required:</strong> Please pay the advance booking fee.
                    </div>
                    <button
                      onClick={() => handlePay(booking._id)}
                      disabled={!!paymentLoading}
                      className="bg-orange-600 text-white px-6 py-2 rounded font-bold hover:bg-orange-700 flex items-center gap-2 shadow-sm">
                      {paymentLoading === booking._id ? 'Processing...' : <><DollarSign size={18} /> Pay Now ($500)</>}
                    </button>
                  </div>
                )}

                {booking.status === 'BOOKED' && (
                  <div className="px-6 py-4 bg-green-50 border-t border-green-100 text-green-800 flex items-center gap-2 font-bold justify-center">
                    <CheckCircle size={20} /> Booking Confirmed!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
