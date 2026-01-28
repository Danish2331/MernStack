import apiClient from './client';

export type BookingStatus =
    | 'PENDING_ADMIN1'
    | 'PENDING_ADMIN2'
    | 'PAYMENT_REQUESTED'
    | 'PAYMENT_VERIFIED'
    | 'PENDING_ADMIN3'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED';

export interface Booking {
    _id: string;
    hallId: {
        _id: string;
        name: string;
    };
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    date: string;
    slotIndices: number[];
    status: BookingStatus;
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    invoiceGenerated: boolean;
    documentsVerified: boolean;
    admin1Approval?: {
        approvedBy: string;
        approvedAt: string;
        notes?: string;
    };
    admin2Approval?: {
        approvedBy: string;
        approvedAt: string;
        paymentVerified: boolean;
        notes?: string;
    };
    admin3Approval?: {
        approvedBy: string;
        approvedAt: string;
        isFinalized: boolean;
        notes?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const fetchBookings = async (status?: BookingStatus | 'ALL') => {
    const params = status && status !== 'ALL' ? { status } : {};
    const response = await apiClient.get('/admin/bookings', { params });
    return response.data as Booking[];
};

export const approveGate1 = async (id: string, notes?: string) => {
    const response = await apiClient.patch(`/admin/booking/${id}/gate-1`, { notes });
    return response.data;
};

export const approveGate2 = async (id: string, notes?: string) => {
    const response = await apiClient.patch(`/admin/booking/${id}/gate-2`, { notes });
    return response.data;
};

export const approveGate3 = async (id: string, notes?: string) => {
    const response = await apiClient.patch(`/admin/booking/${id}/gate-3`, { notes });
    return response.data;
};

export const rejectBooking = async (id: string, reason?: string) => {
    const response = await apiClient.patch(`/admin/booking/${id}/reject`, { notes: reason });
    return response.data;
};
