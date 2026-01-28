import { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Hall {
    _id: string;
    name: string;
    capacity: number;
    price: number;
    panoramaUrl: string;
    type: string;
}

const Venues = () => {
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/halls');
                setHalls(res.data);
            } catch (err: any) {
                console.error("Venues Fetch Error:", err);
                setError('Failed to load venues.');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    if (loading) return <div className="text-center py-20 text-xl font-serif">Loading Venues...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-serif text-center text-gray-900 mb-12">Our Venues</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {halls.map((hall) => (
                        <div key={hall._id} className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                            {/* Card Header Color */}
                            <div className={`h-3 w-full ${hall.type === 'Gold' ? 'bg-yellow-500' :
                                    hall.type === 'Diamond' ? 'bg-blue-600' : 'bg-gray-400'
                                }`} />

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">{hall.name}</h3>
                                    <div className="space-y-3 text-gray-600 mb-6">
                                        <p className="flex justify-between border-b pb-2">
                                            <span>Capacity</span>
                                            <span className="font-semibold text-gray-900">{hall.capacity} Pax</span>
                                        </p>
                                        <p className="flex justify-between border-b pb-2">
                                            <span>Price</span>
                                            <span className="font-semibold text-gray-900">₹{hall.price.toLocaleString()}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Tier</span>
                                            <span className="font-semibold text-gray-900">{hall.type}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => window.open(hall.panoramaUrl, '_blank')}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded hover:bg-black transition-all text-sm font-bold uppercase tracking-widest shadow-md"
                                    >
                                        <Video size={18} />
                                        View 360° Tour
                                    </button>

                                    <button
                                        onClick={() => navigate(`/book?hallId=${hall._id}`)}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-oberoi-gold to-yellow-600 text-white py-3 px-4 rounded hover:shadow-lg transition-all text-sm font-bold uppercase tracking-widest shadow-md border border-yellow-400"
                                    >
                                        <CalendarCheck size={18} />
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Venues;
