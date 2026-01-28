import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Hall from '../src/models/Hall';

const seedFinal = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB');

        // 1. WIPE
        await User.deleteMany({});
        await Hall.deleteMany({});
        console.log('🗑️  Old Data Wiped');

        // 2. PREPARE USERS (MANUAL HASHING)
        const salt = await bcrypt.genSalt(10);
        const hash = (pass: string) => bcrypt.hashSync(pass, salt);

        const users = [
            {
                name: "Super Admin",
                email: "super@banquet.com",
                password: hash("SuperPass123!"),
                role: "SUPERADMIN",
                isActive: true,
                createdAt: new Date(), updatedAt: new Date(), __v: 0
            },
            {
                name: "Manager One",
                email: "manager@banquet.com",
                password: hash("ManagerPass123!"),
                role: "ADMIN2",
                isActive: true,
                createdAt: new Date(), updatedAt: new Date(), __v: 0
            },
            {
                name: "Clerk One",
                email: "clerk@banquet.com",
                password: hash("ClerkPass123!"),
                role: "ADMIN1",
                isActive: true,
                createdAt: new Date(), updatedAt: new Date(), __v: 0
            },
            {
                name: "Customer One",
                email: "customer@test.com",
                password: hash("UserPass123!"),
                role: "CUSTOMER",
                isActive: true,
                createdAt: new Date(), updatedAt: new Date(), __v: 0
            }
        ];

        // 3. INSERT USERS (Bypass Hooks to prevent Double Hash)
        await User.collection.insertMany(users);
        console.log('👤 Users Seeded');

        // 4. PREPARE HALLS
        const halls = [
            {
                name: "La Grace Silver Lounge",
                type: "Silver",
                capacity: 100,
                price: 50000,
                panoramaUrl: "https://www.youtube.com/watch?v=u_oGdhxqits",
                amenities: ["AC", "Wi-Fi", "Sound System"],
                __v: 0
            },
            {
                name: "La Grace Gold Ballroom",
                type: "Gold",
                capacity: 300,
                price: 120000,
                panoramaUrl: "https://www.youtube.com/watch?v=K17xfqib0rE",
                amenities: ["AC", "Stage", "Projector", "Dining Area"],
                __v: 0
            },
            {
                name: "La Grace Diamond Royal",
                type: "Diamond",
                capacity: 800,
                price: 300000,
                panoramaUrl: "https://www.youtube.com/watch?v=1duOT5_oPPk",
                amenities: ["AC", "Grand Stage", "Projector", "Valet Parking", "Bridal Suite"],
                __v: 0
            }
        ];

        // 5. INSERT HALLS
        await Hall.collection.insertMany(halls);
        console.log('🏛️  Halls Seeded');

        console.log('✅ Database Populated Successfully');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedFinal();
