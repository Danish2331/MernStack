import { useState, useEffect } from 'react';
import client from '../api/client';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { Calendar, Clock, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

interface Hall {
    _id: string;
    name: string;
    type: string;
    price: number;
    capacity: number;
}

const Book = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialHallId = searchParams.get('hallId');

    // 1. DIRECT STORAGE CHECK (Fail-Safe)
    const hasToken = !!localStorage.getItem('token');

    const [halls, setHalls] = useState<Hall[]>([]);
    const [selectedHalls, setSelectedHalls] = useState<string[]>([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // 2. Fetch Halls (Only if token exists)
    useEffect(() => {
        if (!hasToken) return;

        const fetchHalls = async () => {
            try {
                const res = await client.get('/halls');
                setHalls(res.data);

                if (initialHallId) {
                    const hallExists = res.data.find((h: Hall) => h._id === initialHallId);
                    if (hallExists) setSelectedHalls([initialHallId]);
                }
            } catch (err) {
                console.error("Failed to load halls");
            }
        };
        fetchHalls();
    }, [initialHallId, hasToken]);

    // 3. IMMEDIATE REDIRECT if no token
    if (!hasToken) {
        return <Navigate to="/login?redirect=/book" replace />;
    }

    const handleHallToggle = (id: string) => {
        setSelectedHalls(prev =>
            prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'image/jpeg' && selectedFile.type !== 'image/jpg') {
                setError("Only JPG/JPEG files are allowed.");
                setFile(null);
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB.");
                setFile(null);
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };

    const isValid = selectedHalls.length > 0 && date && time && file;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isValid) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('halls', JSON.stringify(selectedHalls));
        formData.append('eventDate', date);
        formData.append('eventTime', time);
        if (file) formData.append('document', file);

        try {
            await client.post('/bookings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Booking submission failed');
            setLoading(false);
        }
    };

    // SUCCESS UI
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-t-4 border-yellow-500">
                    <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock size={40} className="text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Request Pending</h2>
                    <p className="text-gray-600 mb-6">
                        Submitted for Document Verification
                    </p>
                    <div className="bg-gray-50 rounded p-4 mb-6 text-sm text-left">
                        <p className="flex items-center gap-2 text-gray-700 mb-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Booking Intent Logged</span>
                        </p>
                        <p className="flex items-center gap-2 text-gray-700">
                            <AlertTriangle size={16} className="text-yellow-500" />
                            <span>Waiting for Admin Approval</span>
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-black transition-all"
                    >
                        GO TO MY BOOKINGS
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-serif text-gray-900 mb-8 border-b pb-4">Request Booking</h1>

                {error && <div className="bg-red-50 text-red-700 p-4 mb-6 rounded border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Venue Selection */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="bg-oberoi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                            Select Venues
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {halls.map(hall => (
                                <label key={hall._id} className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedHalls.includes(hall._id) ? 'border-primary ring-2 ring-primary bg-yellow-50' : 'hover:border-gray-400'}`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1 w-5 h-5 text-primary rounded"
                                            checked={selectedHalls.includes(hall._id)}
                                            onChange={() => handleHallToggle(hall._id)}
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{hall.name}</p>
                                            <p className="text-sm text-gray-500">Tier: {hall.type} • ₹{hall.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-oberoi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                                Event Date
                            </h3>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-oberoi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                                Event Time
                            </h3>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                >
                                    <option value="">Select Slot</option>
                                    <option value="Morning (9AM - 1PM)">Morning (9AM - 1PM)</option>
                                    <option value="Afternoon (2PM - 6PM)">Afternoon (2PM - 6PM)</option>
                                    <option value="Evening (7PM - 11PM)">Evening (7PM - 11PM)</option>
                                    <option value="Full Day (9AM - 11PM)">Full Day (9AM - 11PM)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="bg-oberoi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                            Identity Proof (JPG Only)
                        </h3>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors bg-gray-50 ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'}`}>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".jpg,.jpeg"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                                {file ? (
                                    <>
                                        <CheckCircle className="text-green-600 mb-2" size={32} />
                                        <span className="text-green-700 font-semibold">{file.name}</span>
                                        <span className="text-xs text-green-600 mt-1">Ready to upload</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="text-gray-400 mb-2" size={32} />
                                        <span className="text-primary font-semibold">Click to upload JPG</span>
                                        <span className="text-xs text-gray-500 mt-1">Max 5MB • Identity/Address Proof</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isValid || loading}
                        className={`w-full py-4 rounded-lg font-bold text-lg tracking-wide shadow-lg transition-all ${isValid && !loading
                            ? 'bg-gradient-to-r from-oberoi-gold to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Submitting Request...' : 'REQUEST BOOKING'}
                    </button>
                    {!isValid && (
                        <p className="text-center text-xs text-gray-500">Please complete all steps to proceed.</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Book;
