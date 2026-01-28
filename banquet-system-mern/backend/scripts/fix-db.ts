import mongoose from 'mongoose';
import User from '../src/models/User';
import Hall from '../src/models/Hall';
import bcrypt from 'bcryptjs';

const fixDb = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB\n');

        console.log('🗑️  Wiping database...');
        await User.deleteMany({});
        await Hall.deleteMany({});
        console.log('✅ Database wiped\n');

        console.log('👥 Creating Users...');

        // We will SKIP the User model pre-save hook by using insertMany or explicit update if needed, 
        // BUT to be safe and consistent with the app, we should use the SAME path as the app.
        // HOWEVER, the prompt asked to use specific hashing here.
        // Let's follow the prompt's instruction to hash manually and insert.
        // CRITICAL: We need to bypass the pre-save hook if we hash manually, OR pass plain text.
        // The prompt says: "Create Users: const salt = await bcrypt.genSalt(10); const hashedPassword = ..."
        // IF we do that, and then User.create({...}), the pre-save hook will hash the HASH.
        // SOLUTION: We will use insertMany which often bypasses middleware, OR we will disable the hook/pass plain text.
        // GIVEN the previous "Seeder Pass / Manual Fail paradox", it's likely the seeder was HASHING and the app was HASHING AGAIN.
        // OR the seeder was simple and the app was matching.
        // The instructions say: "Insert super@banquet.com." using the hashed password. 
        // I will use `User.collection.insertOne` to BYPASS Mongoose Middleware entirely. This guarantees what we put in is what stays in.

        const salt = await bcrypt.genSalt(10);
        const secretPassword = 'SuperPass123!';
        const hashedPassword = await bcrypt.hash(secretPassword, salt);

        // Bypass Mongoose Middleware to ensure EXACT hash is stored
        await User.collection.insertOne({
            name: 'Super Admin',
            email: 'super@banquet.com',
            password: hashedPassword,
            role: 'SUPERADMIN',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: super@banquet.com`);

        // Admin2
        const pass2 = 'ManagerPass123!';
        const hash2 = await bcrypt.hash(pass2, 10);
        await User.collection.insertOne({
            name: 'Manager Admin',
            email: 'manager@banquet.com',
            password: hash2,
            role: 'ADMIN2',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: manager@banquet.com`);

        // Admin1
        const pass3 = 'ClerkPass123!';
        const hash3 = await bcrypt.hash(pass3, 10);
        await User.collection.insertOne({
            name: 'Clerk Admin',
            email: 'clerk@banquet.com',
            password: hash3,
            role: 'ADMIN1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: clerk@banquet.com`);

        // Customer
        const pass4 = 'UserPass123!';
        const hash4 = await bcrypt.hash(pass4, 10);
        await User.collection.insertOne({
            name: 'Test Customer',
            email: 'customer@test.com',
            password: hash4,
            role: 'CUSTOMER',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: customer@test.com`);


        console.log('\n🏛️  Creating La Grace Venues...');
        const halls = [
            {
                name: 'La Grace Silver Lounge',
                type: 'Silver',
                capacity: 100,
                price: 50000,
                panoramaUrl: 'https://www.youtube.com/watch?v=u_oGdhxqits',
                isActive: true
            },
            {
                name: 'La Grace Gold Ballroom',
                type: 'Gold',
                capacity: 300,
                price: 120000,
                panoramaUrl: 'https://www.youtube.com/watch?v=K17xfqib0rE',
                isActive: true
            },
            {
                name: 'La Grace Diamond Royal',
                type: 'Diamond',
                capacity: 800,
                price: 300000,
                panoramaUrl: 'https://www.youtube.com/watch?v=1duOT5_oPPk',
                isActive: true
            }
        ];

        // Halls have no password hooks, so Model.create is fine (and cleaner for enums/defaults)
        for (const h of halls) {
            await Hall.create(h);
            console.log(`✅ Created: ${h.name}`);
        }

        console.log('\nDatabase Reset & Seeded with bcryptjs.');

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

fixDb();
