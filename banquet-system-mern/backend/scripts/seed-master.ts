import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Hall from '../src/models/Hall';
import Booking from '../src/models/Booking';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') }); // Ensure env is loaded

const seed = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db';
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);

    // 1. WIPE EVERYTHING
    await User.deleteMany({});
    await Hall.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️ Database Wiped.");

    // 2. RESTORE USERS
    const salt = await bcrypt.genSalt(10);
    const hash = (p: string) => bcrypt.hashSync(p, salt);
    await User.insertMany([
        { name: "Super Admin", email: "super@banquet.com", password: hash("SuperPass123!"), role: "SUPERADMIN" },
        { name: "Manager", email: "manager@banquet.com", password: hash("ManagerPass123!"), role: "ADMIN2" },
        { name: "Clerk", email: "clerk@banquet.com", password: hash("ClerkPass123!"), role: "ADMIN1" },
        { name: "Customer", email: "customer@test.com", password: hash("UserPass123!"), role: "CUSTOMER" }
    ]);
    console.log("✅ Users Restored.");

    // 3. RESTORE HALLS
    await Hall.insertMany([
        { name: "La Grace Silver Lounge", type: "Silver", capacity: 100, price: 50000, panoramaUrl: "https://www.youtube.com/watch?v=u_oGdhxqits" },
        { name: "La Grace Gold Ballroom", type: "Gold", capacity: 300, price: 120000, panoramaUrl: "https://www.youtube.com/watch?v=K17xfqib0rE" },
        { name: "La Grace Diamond Royal", type: "Diamond", capacity: 800, price: 300000, panoramaUrl: "https://www.youtube.com/watch?v=1duOT5_oPPk" }
    ]);
    console.log("✅ Halls Restored.");
    process.exit();
};
seed().catch(err => {
    console.error(err);
    process.exit(1);
});
