import mongoose from 'mongoose';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

const resetAdmins = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/banquet_db');
        console.log('✅ Connected to MongoDB\n');

        console.log('🗑️  Removing existing Admins...');
        // Only remove the admins we are about to re-create to preserve Customer data if any
        await User.deleteMany({ email: { $in: ['super@banquet.com', 'manager@banquet.com', 'clerk@banquet.com'] } });
        console.log('✅ Existing Admins removed\n');

        console.log('👥 Creating Admins (Bypassing Mongoose Hooks)...');

        // Super Admin
        const superSalt = await bcrypt.genSalt(10);
        const superHash = await bcrypt.hash('SuperPass123!', superSalt);
        await User.collection.insertOne({
            name: 'Super Admin',
            email: 'super@banquet.com',
            password: superHash,
            role: 'SUPERADMIN',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: super@banquet.com`);

        // Manager Admin (Admin2)
        const managerHash = await bcrypt.hash('ManagerPass123!', 10);
        await User.collection.insertOne({
            name: 'Manager Admin',
            email: 'manager@banquet.com',
            password: managerHash,
            role: 'ADMIN2',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: manager@banquet.com`);

        // Clerk Admin (Admin1)
        const clerkHash = await bcrypt.hash('ClerkPass123!', 10);
        await User.collection.insertOne({
            name: 'Clerk Admin',
            email: 'clerk@banquet.com',
            password: clerkHash,
            role: 'ADMIN1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log(`✅ Created: clerk@banquet.com`);

        console.log('\n✅ Admins Reset with bcryptjs.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
};

resetAdmins();
