import mongoose from 'mongoose';
import Booking from '../src/models/Booking';
import User from '../src/models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db';

const debugDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB for DEBUG");

        const allBookings = await Booking.find({}).lean();
        console.log(`\n=== BOOKING DUMP (${allBookings.length}) ===`);

        for (const b of allBookings) {
            console.log(`\nID: ${b._id}`);
            console.log(`Customer ID: ${b.customerId} (Type: ${typeof b.customerId})`);
            console.log(`Status: '${b.status}'`);
            console.log(`Halls: ${JSON.stringify(b.halls)}`);

            // Verify link
            const user = await User.findById(b.customerId);
            console.log(`User Link: ${user ? 'VALID (' + user.email + ')' : 'BROKEN'}`);
        }

        if (allBookings.length === 0) {
            console.log("\n[CRITICAL] NO BOOKINGS FOUND IN DATABASE.");
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugDb();
