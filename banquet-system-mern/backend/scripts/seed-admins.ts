import mongoose from 'mongoose';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB');

        const admins = [
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

        for (const admin of admins) {
            const exists = await User.findOne({ email: admin.email });

            if (exists) {
                console.log(`⚠️  ${admin.role} (${admin.email}) already exists. Skipping...`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(admin.password, salt);

            await User.create({
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                role: admin.role
            });

            console.log(`✅ Created ${admin.role}: ${admin.email} / ${admin.password}`);
        }

        console.log('\n🎉 Seeding Complete!');
        console.log('\n📋 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('SUPERADMIN:  super@banquet.com    / SuperPass123!');
        console.log('ADMIN2:      manager@banquet.com  / ManagerPass123!');
        console.log('ADMIN1:      clerk@banquet.com    / ClerkPass123!');
        console.log('CUSTOMER:    customer@test.com    / UserPass123!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAdmins();
