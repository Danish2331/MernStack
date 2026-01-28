import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import axios from 'axios';

interface Hall {
  _id: string;
  name: string;
  type: 'Silver' | 'Gold' | 'Diamond';
  capacity: number;
  price: number;
  panoramaUrl: string;
  amenities?: string[];
}

const HallListing = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_BASE_URL}/api/halls`);
      setHalls(response.data);
    } catch (err: any) {
      console.error('Failed to fetch halls:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (type: string) => {
    switch (type) {
      case 'Silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Gold':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      case 'Diamond':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Handle both youtube.com/watch?v= and youtu.be/ formats if needed, 
    // but assuming standard format as per prompt logic
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return url; // Fallback
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oberoi-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading La Grace venues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchHalls}
            className="mt-4 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-oberoi-navy mb-4">
            La Grace <span className="text-oberoi-gold">Venues</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exquisite collection of banquet halls, each designed to make your special occasion unforgettable.
          </p>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {halls.map((hall) => (
            <div
              key={hall._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Tier Badge */}
              <div className={`px-4 py-2 text-center font-semibold border-b-2 ${getTierColor(hall.type)}`}>
                {hall.type} Tier
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="font-serif text-2xl text-oberoi-navy mb-2">
                  {hall.name}
                </h2>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold text-oberoi-navy">{hall.capacity} guests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-oberoi-gold">₹{hall.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Amenities */}
                {hall.amenities && hall.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h3>
                    <div className="flex flex-wrap gap-2">
                      {hall.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hall.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{hall.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 360° View Button */}
                <button
                  onClick={() => setSelectedVideo(hall.panoramaUrl)}
                  className="w-full bg-oberoi-gold hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={20} />
                  View 360° Tour
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {halls.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No venues available at the moment.</p>
          </div>
        )}
      </div>

      {/* THE MODAL OVERLAY */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl border border-gray-700">

            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-500 text-xl font-bold flex items-center gap-1"
            >
              ✕ CLOSE
            </button>

            {/* The 360 Player */}
            <iframe
              src={getEmbedUrl(selectedVideo)}
              title="360 Tour"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallListing;
