import mongoose from 'mongoose';
import User from '../src/models/User';
import Hall from '../src/models/Hall';
import bcrypt from 'bcryptjs';

const seedFull = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB');

        // WIPE DATABASE
        console.log('\n🗑️  Wiping database...');
        await User.deleteMany({});
        await Hall.deleteMany({});
        console.log('✅ Database wiped');

        // CREATE USERS
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
            const hashedPassword = bcrypt.hashSync(userData.password, 10);
            await User.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role
            });
            console.log(`✅ Created: ${userData.role.padEnd(12)} | ${userData.email}`);
        }

        // CREATE HALLS (360° DATA)
        console.log('\n🏛️  Creating La Grace venues...');

        const halls = [
            {
                name: 'La Grace Silver Lounge',
                type: 'Silver',
                capacity: 100,
                price: 50000,
                panoramaUrl: 'https://www.youtube.com/watch?v=u_oGdhxqits',
                amenities: ['Air Conditioning', 'WiFi', 'Basic Sound System', 'Parking'],
                isActive: true
            },
            {
                name: 'La Grace Gold Ballroom',
                type: 'Gold',
                capacity: 300,
                price: 120000,
                panoramaUrl: 'https://www.youtube.com/watch?v=K17xfqib0rE',
                amenities: ['Premium Sound System', 'LED Lighting', 'Stage', 'VIP Lounge', 'Catering Kitchen', 'Valet Parking'],
                isActive: true
            },
            {
                name: 'La Grace Diamond Royal',
                type: 'Diamond',
                capacity: 800,
                price: 300000,
                panoramaUrl: 'https://www.youtube.com/watch?v=1duOT5_oPPk',
                amenities: ['Crystal Chandeliers', 'Premium AV System', 'Grand Stage', 'Multiple VIP Lounges', 'Full Catering Service', 'Valet Parking', 'Red Carpet Entrance'],
                isActive: true
            }
        ];

        for (const hallData of halls) {
            await Hall.create(hallData);
            console.log(`✅ Created: ${hallData.name} (${hallData.type} - ${hallData.capacity} pax - ₹${hallData.price.toLocaleString()})`);
        }

        console.log('\n' + '═'.repeat(80));
        console.log('🎉 LA GRACE DATABASE SEEDING COMPLETE!');
        console.log('═'.repeat(80));
        console.log('\n📋 LOGIN CREDENTIALS:');
        console.log('─'.repeat(80));
        console.log('SUPERADMIN:  super@banquet.com    / SuperPass123!');
        console.log('ADMIN2:      manager@banquet.com  / ManagerPass123!');
        console.log('ADMIN1:      clerk@banquet.com    / ClerkPass123!');
        console.log('CUSTOMER:    customer@test.com    / UserPass123!');
        console.log('─'.repeat(80));
        console.log('\n🏛️  LA GRACE VENUES:');
        console.log('─'.repeat(80));
        console.log('1. La Grace Silver Lounge   (Silver)   - 100 pax  - ₹50,000');
        console.log('2. La Grace Gold Ballroom   (Gold)     - 300 pax  - ₹1,20,000');
        console.log('3. La Grace Diamond Royal   (Diamond)  - 800 pax  - ₹3,00,000');
        console.log('─'.repeat(80) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedFull();
