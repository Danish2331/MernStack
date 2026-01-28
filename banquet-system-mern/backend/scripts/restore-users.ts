import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const restore = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db';
    console.log("Connecting to:", mongoUri);

    await mongoose.connect(mongoUri);

    await User.deleteMany({}); // CLEAR OLD DATA
    console.log("Cleared old users.");

    const salt = await bcrypt.genSalt(10);
    const hash = (pass: string) => bcrypt.hashSync(pass, salt);

    const users = [
        { name: "Super Admin", email: "super@banquet.com", password: hash("SuperPass123!"), role: "SUPERADMIN" },
        { name: "Manager", email: "manager@banquet.com", password: hash("ManagerPass123!"), role: "ADMIN2" },
        { name: "Clerk", email: "clerk@banquet.com", password: hash("ClerkPass123!"), role: "ADMIN1" },
        { name: "Customer", email: "customer@test.com", password: hash("UserPass123!"), role: "CUSTOMER" }
    ];

    await User.insertMany(users);
    console.log("✅ USERS RESTORED: Login now.");
    process.exit();
};
restore().catch(err => {
    console.error(err);
    process.exit(1);
});
