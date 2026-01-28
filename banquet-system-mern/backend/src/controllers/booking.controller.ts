import { Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth.middleware';

// ... Existing exports ...

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            console.error("CreateBooking: No User in Request");
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log(`CreateBooking: Start for User ${req.user.id}`);

        const { halls, eventDate, eventTime } = req.body;
        const file = req.file;

        if (!file) {
            console.error("CreateBooking: No File Uploaded");
            return res.status(400).json({ message: 'Document proof is required (JPG only).' });
        }

        let hallIds = halls;
        if (typeof halls === 'string') {
            try { hallIds = JSON.parse(halls); } catch (e) { hallIds = [halls]; }
        }

        const objectIdHalls = Array.isArray(hallIds)
            ? hallIds.map((id: string) => new mongoose.Types.ObjectId(id))
            : [new mongoose.Types.ObjectId(hallIds)];

        const userObjectId = new mongoose.Types.ObjectId(req.user.id);

        const newBooking = new Booking({
            customerId: userObjectId,
            halls: objectIdHalls,
            eventDate: new Date(eventDate),
            eventTime,
            documents: {
                data: file.buffer,
                contentType: file.mimetype
            },
            status: 'SUBMITTED'
        });

        const savedBooking = await newBooking.save();
        console.log(`CreateBooking: SUCCESS. ID: ${savedBooking._id}, Status: ${savedBooking.status}`);

        res.status(201).json({
            message: 'Booking request submitted successfully',
            bookingId: savedBooking._id,
            status: 'SUBMITTED'
        });

    } catch (error: any) {
        console.error("CreateBooking: ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const userId = new mongoose.Types.ObjectId(req.user.id);
        const bookings = await Booking.find({ customerId: userId })
            .populate('halls', 'name')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error fetching bookings' });
    }
};

export const getBookingDocument = async (req: any, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || !booking.documents || !booking.documents.data) {
            return res.status(404).send('Document not found');
        }
        res.set('Content-Type', booking.documents.contentType);
        res.send(booking.documents.data);
    } catch (error: any) {
        res.status(500).send("Error fetching document");
    }
};

// NEW: Pay Booking Action
export const payBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        // Mock payment logic
        console.log(`Processing Payment for Booking ${id}`);

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'PAYMENT_REQUESTED') {
            return res.status(400).json({ message: 'Booking is not awaiting payment' });
        }

        booking.status = 'PAYMENT_COMPLETED';
        await booking.save();

        console.log(`Payment Success for ${id}`);
        res.json({ message: 'Payment successful', booking });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
