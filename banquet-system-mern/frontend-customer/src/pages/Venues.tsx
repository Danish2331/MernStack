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

    // Helper: Convert Standard YouTube Link to Embed Link
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        try {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } catch (e) {
            return url; // Fallback
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-6">
            <h2 className="text-4xl font-serif text-center text-navy-900 mb-12">Our Venues</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {halls.map(hall => (
                    <div key={hall._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h3 className="text-2xl font-serif text-navy-800 mb-4">{hall.name}</h3>

                        <div className="space-y-3 text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Capacity</span>
                                <span className="font-bold">{hall.capacity} Pax</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Price per Event</span>
                                <span className="font-bold">₹{hall.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tier</span>
                                <span className="font-semibold text-gray-800">{hall.type}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* 360 TOUR BUTTON - TRIGGERS MODAL */}
                            <button
                                onClick={() => setSelectedVideo(hall.panoramaUrl)}
                                className="flex-1 bg-navy-900 text-white py-3 rounded-md hover:bg-navy-800 transition-colors flex items-center justify-center gap-2"
                            >
                                📹 VIEW 360° TOUR
                            </button>

                            {/* BOOK BUTTON */}
                            <button
                                onClick={() => navigate(`/book?hallId=${hall._id}`)}
                                className="flex-1 bg-amber-600 text-white py-3 rounded-md hover:bg-amber-700 transition-colors font-semibold"
                            >
                                BOOK NOW
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- THE IFRAME MODAL --- */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fade-in">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl shadow-2xl border border-gray-800 overflow-hidden">

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-red-600 text-white rounded-full p-2 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* The Player */}
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
