import { Link } from 'react-router-dom';
import { ChevronRight, Users, DollarSign } from 'lucide-react';
import type { Hall } from '@/types';
import { getImageUrl } from '@/utils/imageUrl';
import { formatCurrency } from '@/utils/formatters';

interface HallCardProps {
  hall: Hall;
}

const HallCard = ({ hall }: HallCardProps) => {
  const imageUrl = hall.assets.images[0] ? getImageUrl(hall.assets.images[0]) : '/placeholder-hall.jpg';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={hall.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-oberoi-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
          {formatCurrency(hall.basePrice)}/event
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-2xl text-gray-900 mb-3">
          {hall.name}
        </h3>

        {hall.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {hall.description}
          </p>
        )}

        {/* Capacity */}
        <div className="flex items-center gap-2 text-gray-700 mb-4">
          <Users size={18} className="text-oberoi-gold" />
          <span className="text-sm">Capacity: Up to {hall.capacity} guests</span>
        </div>

        {/* Amenities */}
        {hall.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {hall.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="text-xs bg-oberoi-cream text-gray-700 px-3 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {hall.amenities.length > 3 && (
                <span className="text-xs text-gray-500 px-3 py-1">
                  +{hall.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA Links */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Link 
            to={`/halls/${hall._id}`}
            className="link-gold"
          >
            EXPLORE
            <ChevronRight size={16} />
          </Link>

          <Link 
            to={`/book/${hall._id}`}
            className="link-gold"
          >
            REQUEST PROPOSAL
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HallCard;
