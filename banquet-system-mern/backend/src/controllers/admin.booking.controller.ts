import { Request, Response } from 'express';
import Booking, { IBooking, BookingStatus } from '../models/Booking';
import { InventoryService } from '../services/InventoryService';
import { AuthRequest } from '../middleware/auth.middleware';

export class AdminBookingController {

    /**
     * Gate 1: Document Verification (Admin1 Only)
     * Transition: PENDING_ADMIN1 -> PENDING_ADMIN2
     */
    static async approveDocuments(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const notes = req.body.notes;
            const booking = await Booking.findById(id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            // Strict State Validation
            if (booking.status !== BookingStatus.PENDING_ADMIN1) {
                return res.status(400).json({
                    message: `Invalid state transition. Current status: ${booking.status}. Required: PENDING_ADMIN1`
                });
            }

            booking.status = BookingStatus.PENDING_ADMIN2;
            booking.admin1Approval = {
                approvedBy: (req.user as any).id,
                approvedAt: new Date(),
                notes
            };

            await booking.save();
            res.json({ message: 'Gate 1: Documents Verified. Moved to Admin 2.', booking });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Gate 2: Request Payment (Admin2 Only)
     * Transition: PENDING_ADMIN2 -> PAYMENT_REQUESTED
     */
    static async requestPayment(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const notes = req.body.notes;
            const booking = await Booking.findById(id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            // Strict State Validation
            if (booking.status !== BookingStatus.PENDING_ADMIN2) {
                return res.status(400).json({
                    message: `Invalid state transition. Current status: ${booking.status}. Required: PENDING_ADMIN2`
                });
            }

            booking.status = BookingStatus.PAYMENT_REQUESTED;
            booking.admin2Approval = {
                approvedBy: (req.user as any).id,
                approvedAt: new Date(),
                paymentVerified: false,
                notes
            };

            await booking.save();
            res.json({ message: 'Gate 2: Payment Requested from Customer.', booking });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Gate 3: Final Approval (Admin3 Only)
     * Transition: PENDING_ADMIN3 -> APPROVED
     * Critical Side Effect: Locks Inventory (HELD -> BOOKED)
     */
    static async finalApproval(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const notes = req.body.notes;
            const booking = await Booking.findById(id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            // Strict State Validation
            if (booking.status !== BookingStatus.PENDING_ADMIN3) {
                return res.status(400).json({
                    message: `Invalid state transition. Current status: ${booking.status}. Required: PENDING_ADMIN3`
                });
            }

            // 1. Update Booking Status
            booking.status = BookingStatus.APPROVED;
            booking.admin3Approval = {
                approvedBy: (req.user as any).id,
                approvedAt: new Date(),
                isFinalized: true,
                notes
            };
            await booking.save();

            // 2. Lock Inventory (HELD -> BOOKED)
            await InventoryService.confirmBooking(
                booking.hallId.toString(),
                booking.date,
                booking.slotIndices
            );

            // 3. Generate Invoice (Placeholder - implement actual PDF generation)
            booking.invoiceGenerated = true;
            booking.invoiceUrl = `/invoices/booking-${booking._id}.pdf`; // Mock URL
            await booking.save();

            res.json({ message: 'Gate 3: Final Approval Granted. Slots Booked permanently. Invoice generated.', booking });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Get All Bookings (for Dashboard)
     * Filters? Optionally by status query param
     */
    static async getAllBookings(req: AuthRequest, res: Response) {
        try {
            const { status } = req.query;
            const filter: any = {};
            if (status && status !== 'ALL') {
                filter.status = status;
            }
            // Populate user and hall for display
            const bookings = await Booking.find(filter)
                .populate('userId', 'name email')
                .populate('hallId', 'name')
                .sort({ createdAt: -1 }); // Newest first

            res.json(bookings);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Reject Booking (Any Admin)
     * Transition: ANY -> REJECTED
     * Side Effect: Releases Inventory (HELD -> AVAILABLE)
     */
    static async rejectBooking(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const notes = req.body.notes;
            const booking = await Booking.findById(id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' });
            if (booking.status === 'APPROVED' || booking.status === 'REJECTED') {
                return res.status(400).json({ message: 'Cannot reject an already finalized booking.' });
            }

            // 1. Update Status
            const previousStatus = booking.status;
            booking.status = BookingStatus.REJECTED;
            // Log who rejected it... simpler way is just to save it generally or in the specific gate note if active
            // For now, we just save the status change

            await booking.save();

            // 2. Release Inventory (HELD -> AVAILABLE)
            await InventoryService.releaseSlots(
                booking.hallId.toString(),
                booking.date,
                booking.slotIndices
            );

            res.json({ message: `Booking Rejected (was ${previousStatus}). Slots released.`, booking });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
