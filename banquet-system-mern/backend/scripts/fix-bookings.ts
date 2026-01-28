import mongoose from 'mongoose';
import Booking from '../src/models/Booking'; // Adjust path if needed
import User from '../src/models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db';

const fixBookings = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB for FIX");

        const bookings = await Booking.find({});
        console.log(`Found ${bookings.length} bookings to audit.`);

        for (const b of bookings) {
            let updated = false;

            // 1. Check Status
            // If status is weird or empty, reset to SUBMITTED
            if (!b.status || b.status === 'pending' || b.status === 'Submitted') {
                console.log(`[${b._id}] Fixing Status: '${b.status}' -> 'SUBMITTED'`);
                b.status = 'SUBMITTED';
                updated = true;
            }

            // 2. Check Customer ID Type
            // If it's a string, we might need to cast, but Mongoose usually handles this if defined in Schema.
            // But if the field in DB is literally a string type not ObjectID, we might need to re-save.
            // We just save the document, Mongoose should cast it if the Schema is correct.

            // 3. Ensure Customer Exists
            if (b.customerId) {
                const user = await User.findById(b.customerId);
                if (!user) {
                    console.log(`[${b._id}] WARNING: Linked User ${b.customerId} does not exist.`);
                }
            }

            if (updated) {
                await b.save();
                console.log(`[${b._id}] Saved updates.`);
            }
        }

        console.log("Audit Complete.");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixBookings();
