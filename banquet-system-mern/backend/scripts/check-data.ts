import mongoose from 'mongoose';
import Booking from '../src/models/Booking'; // Ensure correct path
import User from '../src/models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db';

const checkData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const bookings = await Booking.find({});
        console.log(`\n Total Bookings: ${bookings.length}`);

        bookings.forEach((b, i) => {
            console.log(`\n [${i + 1}] ID: ${b._id}`);
            console.log(`   Customer ID: ${b.customerId} (Type: ${typeof b.customerId})`);
            console.log(`   Status: ${b.status}`);
            console.log(`   Date: ${b.eventDate}`);
        });

        const users = await User.find({});
        console.log(`\n Total Users: ${users.length}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
