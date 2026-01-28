import mongoose from 'mongoose';
import User from '../src/models/User';
import Hall from '../src/models/Hall';
import bcrypt from 'bcryptjs';

/**
 * MASTER SEEDER - Clean Slate Initialization
 * Creates: 4 Users (SuperAdmin, Admin2, Admin1, Customer) + 3 Halls (Silver, Gold, Diamond)
 */

const masterSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB');

        // ============================================
        // STEP 1: CLEAN SLATE - Delete All Existing Data
        // ============================================
        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Hall.deleteMany({});
        console.log('✅ Database cleared');

        // ============================================
        // STEP 2: CREATE USERS (WITH BCRYPT HASHING)
        // ============================================
        console.log('\n👥 Creating users...');

        const users = [
            {
                name: 'Super Admin',
                email: 'super@banquet.com',
                password: 'SuperPass123!',
                role: 'SUPERADMIN'
            },
            {
                name: 'Manager Admin',
                email: 'manager@banquet.com',
                password: 'ManagerPass123!',
                role: 'ADMIN2'
            },
            {
                name: 'Clerk Admin',
                email: 'clerk@banquet.com',
                password: 'ClerkPass123!',
                role: 'ADMIN1'
            },
            {
                name: 'Test Customer',
                email: 'customer@test.com',
                password: 'UserPass123!',
                role: 'CUSTOMER'
            }
        ];

        for (const userData of users) {
            // Hash password manually to ensure consistency
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            await User.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role
            });

            console.log(`✅ Created ${userData.role}: ${userData.email}`);
        }

        // ============================================
        // STEP 3: CREATE HALLS (3 TIERS)
        // ============================================
        console.log('\n🏛️  Creating halls...');

        const halls = [
            {
                name: 'The Silver Lounge',
                capacity: 100,
                basePrice: 50000,
                amenities: ['Air Conditioning', 'WiFi', 'Basic Sound System', 'Parking'],
                images: ['/public/halls/silver_01.jpg', '/public/halls/silver_02.jpg'],
                panoramaUrl: '/public/halls/silver_360.jpg',
                isActive: true
            },
            {
                name: 'The Gold Ballroom',
                capacity: 300,
                basePrice: 120000,
                amenities: ['Premium Sound System', 'LED Lighting', 'Stage', 'VIP Lounge', 'Catering Kitchen', 'Parking'],
                images: ['/public/halls/gold_01.jpg', '/public/halls/gold_02.jpg'],
                panoramaUrl: '/public/halls/gold_360.jpg',
                isActive: true
            },
            {
                name: 'The Diamond Royal',
                capacity: 800,
                basePrice: 300000,
                amenities: ['Crystal Chandeliers', 'Premium AV System', 'Grand Stage', 'Multiple VIP Lounges', 'Full Catering Service', 'Valet Parking', 'Red Carpet Entrance'],
                images: ['/public/halls/diamond_01.jpg', '/public/halls/diamond_02.jpg'],
                panoramaUrl: '/public/halls/diamond_360.jpg',
                isActive: true
            }
        ];

        for (const hallData of halls) {
            await Hall.create(hallData);
            console.log(`✅ Created Hall: ${hallData.name} (Capacity: ${hallData.capacity}, Price: ₹${hallData.basePrice.toLocaleString()})`);
        }

        // ============================================
        // FINAL OUTPUT
        // ============================================
        console.log('\n🎉 SEEDING COMPLETE!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 LOGIN CREDENTIALS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('SUPERADMIN:  super@banquet.com    / SuperPass123!');
        console.log('ADMIN2:      manager@banquet.com  / ManagerPass123!');
        console.log('ADMIN1:      clerk@banquet.com    / ClerkPass123!');
        console.log('CUSTOMER:    customer@test.com    / UserPass123!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🏛️  HALLS CREATED:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. The Silver Lounge   (100 pax)  - ₹50,000');
        console.log('2. The Gold Ballroom   (300 pax)  - ₹1,20,000');
        console.log('3. The Diamond Royal   (800 pax)  - ₹3,00,000');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('📝 NOTE: Place hall images in backend/public/halls/ directory');
        console.log('   Expected files: silver_01.jpg, silver_02.jpg, gold_01.jpg, etc.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

masterSeed();
