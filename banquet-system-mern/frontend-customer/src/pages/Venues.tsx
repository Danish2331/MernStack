import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Hall {
    _id: string;
    name: string;
    type: string;
    capacity: number;
    price: number;
    panoramaUrl: string;
}

const Venues = () => {
    const [halls, setHalls] = useState<Hall[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        client.get('/halls')
            .then(res => setHalls(res.data))
            .catch(err => console.error(err));
    }, []);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        try {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } catch (e) {
            return url;
        }
    };

    // 🎨 TIER COLOR HELPER
    const getTierStyles = (type: string) => {
        switch (type.toLowerCase()) {
            case 'silver': return { border: 'border-gray-400', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-800' };
            case 'gold': return { border: 'border-amber-400', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' };
            case 'diamond': return { border: 'border-blue-500', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' };
            default: return { border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-6 font-sans">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-serif text-[#1E3A8A] mb-4">Our Venues</h2>
                <p className="text-gray-500 uppercase tracking-widest text-sm">Select the perfect setting for your event</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto pb-20">
                {halls.map(hall => {
                    const styles = getTierStyles(hall.type);

                    return (
                        <div key={hall._id} className={`bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-8 ${styles.border}`}>
                            <div className="p-8">
                                {/* Header & Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-serif text-gray-800 leading-tight w-2/3">{hall.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                                        {hall.type}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 text-sm uppercase font-semibold">Capacity</span>
                                        <span className="font-bold text-gray-700">{hall.capacity} Pax</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 text-sm uppercase font-semibold">Price</span>
                                        <span className={`font-bold text-xl ${styles.text}`}>₹{hall.price.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="space-y-3">
                                    {/* 360 TOUR BUTTON - Bluish Purple */}
                                    <button
                                        onClick={() => setSelectedVideo(hall.panoramaUrl)}
                                        className="w-full bg-[#1E3A8A] text-white py-3 rounded shadow hover:bg-[#152861] transition-colors uppercase font-bold tracking-widest text-sm"
                                    >
                                        View 360° Tour
                                    </button>

                                    {/* BOOK BUTTON - Orange Accent */}
                                    <button
                                        onClick={() => navigate(`/book?hallId=${hall._id}`)}
                                        className="w-full bg-[#D97706] text-white py-3 rounded shadow hover:bg-[#B45309] transition-colors uppercase font-bold tracking-widest text-sm"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- THE IFRAME MODAL --- */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-800">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-red-600 text-white rounded-full p-2 transition-all backdrop-blur-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <iframe
                            src={getEmbedUrl(selectedVideo)}
                            title="360 Tour"
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Venues;
