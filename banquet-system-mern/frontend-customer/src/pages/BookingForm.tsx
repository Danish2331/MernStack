import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { hallsAPI } from '@/api/halls';
import { bookingsAPI } from '@/api/bookings';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { getImageUrl } from '@/utils/imageUrl';
import { slotIndexToRange } from '@/utils/formatters';
import type { Hall, TimeSlot, CreateBookingRequest } from '@/types';

const BookingForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Hall Data
  const [hall, setHall] = useState<Hall | null>(null);
  const [isLoadingHall, setIsLoadingHall] = useState(true);

  // Availability Data
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Form Data
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: 0,
  });

  // UI State
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadHall(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      checkAvailability();
    }
  }, [id, selectedDate]);

  const loadHall = async (hallId: string) => {
    try {
      setIsLoadingHall(true);
      const data = await hallsAPI.getById(hallId);
      setHall(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load hall');
    } finally {
      setIsLoadingHall(false);
    }
  };

  const checkAvailability = async () => {
    if (!id || !selectedDate) return;

    try {
      setIsLoadingSlots(true);
      setError('');
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const data = await bookingsAPI.searchAvailability({
        hallId: id,
        date: dateStr,
      });

      setAvailableSlots(data.slots);
      setSelectedSlots([]); // Reset selection when date changes
    } catch (err: any) {
      setError(err.message || 'Failed to check availability');
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const toggleSlot = (slotIndex: number) => {
    const slot = availableSlots.find((s) => s.slotIndex === slotIndex);
    if (!slot || slot.status !== 'AVAILABLE') return;

    setSelectedSlots((prev) =>
      prev.includes(slotIndex)
        ? prev.filter((s) => s !== slotIndex)
        : [...prev, slotIndex].sort((a, b) => a - b)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!hall || !selectedDate || selectedSlots.length === 0) {
      setError('Please select a date and at least one time slot');
      return;
    }

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      setError('Please fill in all customer details');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingRequest: CreateBookingRequest = {
        halls: [
          {
            hallId: hall._id,
            date: selectedDate.toISOString().split('T')[0],
            slots: selectedSlots,
          },
        ],
        customerDetails,
      };

      const booking = await bookingsAPI.createHold(bookingRequest);
      
      // Success - Navigate to booking details
      navigate(`/my-bookings`);
    } catch (err: any) {
      // Handle 409 Conflict - Slot already taken
      if (err.statusCode === 409) {
        setError('⚠️ SLOT CONFLICT: One or more selected time slots have been booked by another user. Please refresh and select different slots.');
        // Refresh availability
        checkAvailability();
      } else {
        setError(err.message || 'Failed to create booking');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingHall) {
    return <LoadingSpinner fullScreen />;
  }

  if (!hall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Hall not found" />
      </div>
    );
  }

  const hallImage = getImageUrl(hall.assets.images[0]);

  return (
    <div className="min-h-screen bg-oberoi-cream">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-center text-gray-900 mb-12">
          Book {hall.name}
        </h1>

        {/* Split Screen Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Hall Image */}
          <div className="sticky top-24 self-start">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={hallImage}
                alt={hall.name}
                className="w-full h-96 object-cover"
              />
              <div className="bg-white p-6">
                <h2 className="font-serif text-2xl text-gray-900 mb-2">{hall.name}</h2>
                <p className="text-gray-600">Capacity: {hall.capacity} guests</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} onClose={() => setError('')} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-oberoi-gold" />
                  Select Event Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="input-field"
                  placeholderText="Choose a date"
                  required
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-oberoi-gold" />
                    Select Time Slots
                  </label>

                  {isLoadingSlots ? (
                    <LoadingSpinner />
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedSlots.includes(slot.slotIndex);
                        const isAvailable = slot.status === 'AVAILABLE';

                        return (
                          <button
                            key={slot.slotIndex}
                            type="button"
                            onClick={() => toggleSlot(slot.slotIndex)}
                            disabled={!isAvailable}
                            className={`time-slot-pill ${
                              isSelected
                                ? 'time-slot-selected'
                                : isAvailable
                                ? 'time-slot-available'
                                : 'time-slot-taken'
                            }`}
                          >
                            {slotIndexToRange(slot.slotIndex)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No slots available for this date</p>
                  )}

                  {selectedSlots.length > 0 && (
                    <div className="mt-3 p-3 bg-oberoi-cream rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Selected:</strong> {selectedSlots.length} slot(s)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Details */}
              <div className="border-t pt-6">
                <h3 className="font-serif text-xl text-gray-900 mb-4">Your Details</h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="input-field"
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, name: e.target.value })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email Address *"
                    className="input-field"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, email: e.target.value })
                    }
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    className="input-field"
                    value={customerDetails.phone}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, phone: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Event Type (e.g., Wedding, Corporate)"
                    className="input-field"
                    value={customerDetails.eventType}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, eventType: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Expected Guest Count"
                    className="input-field"
                    value={customerDetails.guestCount || ''}
                    onChange={(e) =>
                      setCustomerDetails({
                        ...customerDetails,
                        guestCount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || selectedSlots.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>

              <div className="flex items-start gap-2 text-xs text-gray-500">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Your booking will be held pending admin approval. You will be notified via email
                  about the status.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
