// User Types
export type UserRole = 'CUSTOMER' | 'ADMIN1' | 'ADMIN2' | 'SUPERADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Hall Types
export interface HallAssets {
  images: string[];
  videos?: string[];
  panorama?: string;
}

export interface Hall {
  _id: string;
  name: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  assets: HallAssets;
  description?: string;
  createdAt: string;
}

// Booking Types
export type BookingStatus = 
  | 'PENDING_ADMIN1' 
  | 'PENDING_ADMIN2' 
  | 'PENDING_ADMIN3'
  | 'APPROVED' 
  | 'REJECTED';

export interface TimeSlot {
  slotIndex: number;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED';
}

export interface BookingHall {
  hallId: string;
  date: string;
  slots: number[];
}

export interface Booking {
  _id: string;
  customerId: string;
  halls: BookingHall[];
  totalPrice: number;
  status: BookingStatus;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    guestCount: number;
  };
  adminNotes?: string;
  rejectionReason?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  halls: BookingHall[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    guestCount: number;
  };
}

// Availability Search
export interface AvailabilitySearchParams {
  hallId: string;
  date: string;
}

export interface AvailabilityResponse {
  hallId: string;
  date: string;
  slots: TimeSlot[];
}

// API Error Response
export interface ApiError {
  message: string;
  statusCode?: number;
}
