import { Request, Response } from 'express';
import Booking, { BookingStatus } from '../models/Booking';
import { AuthRequest } from '../middleware/auth.middleware';

export class CustomerBookingController {

    /**
     * Customer: Make Payment
     * Transition: PAYMENT_REQUESTED -> PAYMENT_VERIFIED -> PENDING_ADMIN3
     */
    static async makePayment(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { transactionId } = req.body;
            const userId = req.user?.id;

            if (!transactionId) {
                return res.status(400).json({ message: 'Transaction ID is required' });
            }

            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Verify ownership
            if (booking.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Unauthorized: Not your booking' });
            }

            // Strict State Validation
            if (booking.status !== BookingStatus.PAYMENT_REQUESTED) {
                return res.status(400).json({
                    message: `Invalid state. Current status: ${booking.status}. Payment can only be made when status is PAYMENT_REQUESTED`
                });
            }

            // Update booking with payment info
            booking.transactionId = transactionId;
            booking.paymentStatus = 'PAID';
            booking.status = BookingStatus.PAYMENT_VERIFIED;

            // Update admin2 approval to mark payment as verified
            if (booking.admin2Approval) {
                booking.admin2Approval.paymentVerified = true;
            }

            await booking.save();

            // Automatically move to PENDING_ADMIN3 after payment verification
            booking.status = BookingStatus.PENDING_ADMIN3;
            await booking.save();

            res.json({
                message: 'Payment verified successfully. Booking moved to final approval stage.',
                booking
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Customer: Get My Bookings
     */
    static async getMyBookings(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;

            const bookings = await Booking.find({ userId })
                .populate('hallId', 'name images basePrice')
                .sort({ createdAt: -1 });

            res.json(bookings);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Customer: Get Single Booking
     */
    static async getBookingById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            const booking = await Booking.findById(id)
                .populate('hallId', 'name images basePrice amenities')
                .populate('userId', 'name email');

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Verify ownership
            if (booking.userId._id.toString() !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            res.json(booking);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
