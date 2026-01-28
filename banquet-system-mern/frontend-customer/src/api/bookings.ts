import apiClient from './client';
import type { 
  Booking, 
  CreateBookingRequest, 
  AvailabilitySearchParams,
  AvailabilityResponse 
} from '@/types';

export const bookingsAPI = {
  // Search availability for a specific hall and date
  searchAvailability: async (params: AvailabilitySearchParams): Promise<AvailabilityResponse> => {
    const { data } = await apiClient.get<AvailabilityResponse>('/bookings/search', {
      params,
    });
    return data;
  },

  // Create a booking hold (Atomic Lock)
  createHold: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>('/bookings/hold', bookingData);
    return data;
  },

  // Get all bookings for current customer
  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>('/bookings/my');
    return data;
  },

  // Get specific booking details
  getById: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.get<Booking>(`/bookings/${id}`);
    return data;
  },

  // Cancel/Edit booking (if status allows)
  cancelBooking: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.delete<Booking>(`/bookings/${id}`);
    return data;
  },
};

export default bookingsAPI;
