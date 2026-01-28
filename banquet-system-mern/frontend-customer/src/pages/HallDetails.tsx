import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, DollarSign, CheckCircle, ChevronRight } from 'lucide-react';
import { hallsAPI } from '@/api/halls';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { getImageUrl } from '@/utils/imageUrl';
import { formatCurrency } from '@/utils/formatters';
import type { Hall } from '@/types';

const HallDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hall, setHall] = useState<Hall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadHall(id);
    }
  }, [id]);

  const loadHall = async (hallId: string) => {
    try {
      setIsLoading(true);
      const data = await hallsAPI.getById(hallId);
      setHall(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load hall details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !hall) {
    return (
      <div className="min-h-screen bg-oberoi-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error || 'Hall not found'} />
          <Link to="/halls" className="link-gold mt-4 inline-flex">
            ← Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  const images = hall.assets.images.map(getImageUrl);

  return (
    <div className="min-h-screen bg-oberoi-cream">
      {/* Image Gallery */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Main Image */}
          <div className="relative h-[70vh]">
            <img
              src={images[selectedImage] || '/placeholder-hall.jpg'}
              alt={hall.name}
              className="w-full h-full object-cover"
            />
            
            {/* 360° Badge (if available) */}
            {hall.assets.panorama && (
              <div className="absolute top-4 right-4 bg-oberoi-gold text-white px-4 py-2 rounded-full text-sm font-semibold">
                360° View Available
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-oberoi-gold scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${hall.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="md:col-span-2">
            <h1 className="font-serif text-5xl text-gray-900 mb-4">{hall.name}</h1>
            
            {hall.description && (
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {hall.description}
              </p>
            )}

            {/* Key Features */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <Users className="text-oberoi-gold flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Capacity</h3>
                  <p className="text-gray-700">Up to {hall.capacity} guests</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="text-oberoi-gold flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Base Price</h3>
                  <p className="text-gray-700">{formatCurrency(hall.basePrice)} per event</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {hall.amenities.length > 0 && (
              <div>
                <h2 className="font-serif text-3xl text-gray-900 mb-4">Amenities</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {hall.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="text-oberoi-gold flex-shrink-0" size={20} />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: CTA Card */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-serif text-gray-900 mb-2">
                  {formatCurrency(hall.basePrice)}
                </p>
                <p className="text-gray-600 text-sm">Base price per event</p>
              </div>

              <Link
                to={`/book/${hall._id}`}
                className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
              >
                BOOK THIS VENUE
                <ChevronRight size={20} />
              </Link>

              <p className="text-xs text-gray-500 text-center">
                * Final pricing may vary based on date, duration, and additional services
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HallDetails;
