import mongoose from 'mongoose';
import Booking from '../src/models/Booking'; // Ensure correct path
import User from '../src/models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db';

const forceVerify = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB for FORCE VERIFY");

        const bookings = await Booking.find({});
        console.log(`\n Total Bookings in DB: ${bookings.length}`);

        for (const b of bookings) {
            console.log(`------------------------------------------------`);
            console.log(`[ID]: ${b._id}`);
            console.log(`[Customer ID]: ${b.customerId} | Type: ${typeof b.customerId}`);
            // Check if it matches a user
            const user = await User.findById(b.customerId);
            console.log(`[User Exists?]: ${user ? 'YES (' + user.name + ')' : 'NO'}`);
            console.log(`[Status]: '${b.status}'`); // Quote to check for whitespace
            console.log(`[Halls]: ${b.halls}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

forceVerify();
