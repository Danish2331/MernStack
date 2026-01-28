import { Request, Response } from 'express';
import Booking from '../models/Booking';

// THE CLERK LIFELINE - Gets SUBMITTED bookings
export const getClerkDashboard = async (req: Request, res: Response) => {
    try {
        console.log("👮 CLERK DASHBOARD ACCESSED");
        const bookings = await Booking.find({ status: 'SUBMITTED' })
            .populate('customerId', 'name email')
            .populate('halls', 'name');

        console.log(`✅ Found ${bookings.length} bookings.`);
        res.json({ bookings });
    } catch (error) {
        console.error("Clerk Dashboard Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- STUBS to prevent compile errors if other files import these (e.g. routes/admin.routes.ts if I didn't fully clean it) ---
// But I am fully overwriting admin.routes.ts too, so these shouldn't be strictly necessary for THAT file.
// However, if I want to add them back later, I'll keep it clean as requested by "CLEAN SLATE".
// I will strictly follow the prompt for the controller content.
