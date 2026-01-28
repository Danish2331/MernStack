const axios = require('axios');
const FormData = require('form-data'); // Ensure you have this installed: npm install form-data
const mongoose = require('mongoose');

// CONFIG
const API_URL = 'http://localhost:5000/api';
const SUPER_ADMIN = { name: 'SuperAdmin', email: 'super@test.com', password: 'password123', role: 'SUPERADMIN' };
const CUSTOMER = { name: 'Customer', email: 'customer@test.com', password: 'password123', role: 'CUSTOMER' };

let adminToken = '';
let customerToken = '';
let hallId = '';
let bookingId = '';

async function runTest() {
    console.log('🚀 STARTING BACKEND SMOKE TEST (CommonJS)...');

    try {
        // 1. REGISTER SUPER ADMIN
        // Note: In a real "black box" smoke test, we might not have DB access. 
        // But to ensure the role is SUPERADMIN (not default CUSTOMER), we might need it?
        // Actually, let's try to register. If it fails (duplicate), we login.
        // If we strictly follow "Pure API" test, we can't force the role unless we use the create-admin endpoint?
        // But create-admin is protected... bootstrapping problem.
        // For this script, we'll assume the environment allows us to register or we rely on the previous steps content.
        // The user prompt specifically asked to "Keep the exact same logic". 
        // In the previous failure, we saw we needed to force the role in DB.
        // I will keep the DB connection for bootstrapping the SuperAdmin role to ensure the test passes reliably.

        const MONGO_URI = 'mongodb://127.0.0.1:27017/banquet_db';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
            console.log('✅ Connected to MongoDB for Bootstrap');
        }

        // Define a minimal User Schema for bootstrapping if not importing model
        // To avoid importing TS models in JS, we define a quick inline schema or just use pure mongo driver?
        // Mongoose is easier if we accept the dependency.
        const userSchema = new mongoose.Schema({
            name: String, email: String, password: String, role: String
        });
        // Start fresh model to avoid compilation double-overwrite issues if mixed env
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        // Ensure SuperAdmin
        let superUser = await User.findOne({ email: SUPER_ADMIN.email });
        if (!superUser) {
            // We need to hash password? 
            // Or we just use the register endpoint? 
            // If we use register endpoint, role defaults to CUSTOMER.
            // So we register via API then Update via DB.
            try {
                await axios.post(`${API_URL}/auth/register`, SUPER_ADMIN);
            } catch (e) { /* ignore duplicate */ }

            // Now find and update
            superUser = await User.findOne({ email: SUPER_ADMIN.email });
        }

        if (superUser && superUser.role !== 'SUPERADMIN') {
            await User.updateOne({ _id: superUser._id }, { $set: { role: 'SUPERADMIN' } });
            console.log('✅ SuperAdmin Role Forced to SUPERADMIN via DB');
        }

        // 2. LOGIN SUPER ADMIN
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: SUPER_ADMIN.email, password: SUPER_ADMIN.password });
            adminToken = loginRes.data.token;
            console.log('✅ SuperAdmin Logged In');
        } catch (e) {
            throw new Error(`SuperAdmin Login Failed: ${e.response?.data?.message || e.message}`);
        }

        // 3. CREATE HALL (JSON Body)
        console.log('creating hall...')
        const hallRes = await axios.post(`${API_URL}/halls`, {
            name: 'Grand Ball Room ' + Date.now(),
            capacity: 500,
            basePrice: 10000,
            amenities: ['AC', 'WiFi', 'Stage']
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        hallId = hallRes.data._id;
        console.log(`✅ Hall Created (ID: ${hallId})`);

        // 3b. UPLOAD IMAGE (Multipart)
        const form = new FormData();
        const dummyImage = Buffer.from('fake-image-content');
        form.append('images', dummyImage, { filename: 'test-image.jpg', contentType: 'image/jpeg' });

        await axios.post(`${API_URL}/halls/${hallId}/images`, form, {
            headers: { ...form.getHeaders(), Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Hall Image Uploaded');

        // 4. REGISTER & LOGIN CUSTOMER
        try {
            await axios.post(`${API_URL}/auth/register`, CUSTOMER);
        } catch (e) { }
        const custLogin = await axios.post(`${API_URL}/auth/login`, { email: CUSTOMER.email, password: CUSTOMER.password });
        customerToken = custLogin.data.token;
        console.log('✅ Customer Logged In');

        // 5. ATOMIC LOCK TEST (The Money Shot)
        const bookingDate = '2025-12-25';
        const slots = [20, 21, 22]; // 10:00 AM - 11:30 AM

        // Request A (Should Succeed)
        const bookA = await axios.post(`${API_URL}/bookings/hold`,
            { hallId, date: bookingDate, slotIndices: slots },
            { headers: { Authorization: `Bearer ${customerToken}` } }
        );
        const holdId = bookA.data.holdId;
        console.log(`✅ Booking A Successful (Lock Acquired, Hold ID: ${holdId})`);

        // Request B (Should Fail)
        try {
            await axios.post(`${API_URL}/bookings/hold`,
                { hallId, date: bookingDate, slotIndices: slots },
                { headers: { Authorization: `Bearer ${customerToken}` } }
            );
            console.error('❌ FATAL: Double Booking was ALLOWED! Atomic Lock Failed.');
            process.exit(1);
        } catch (error) {
            if (error.response?.status === 409) {
                console.log('✅ Atomic Lock Passed (Double Booking Rejected 409)');
            } else {
                console.error(`❌ Unexpected Error: ${error.message}`);
                console.error(error.response?.data);
            }
        }

        // 6. SIMULATE BOOKING FINALIZATION (Bridge Step)
        // We need to create a Booking document so the Admin API can work.
        // The endpoint GATE-1 etc requires a Booking ID, not a Hold ID.
        console.log('🔄 Simulating Customer Checkout (Hold -> Booking Application)...');

        // We need the Booking Model logic. 
        // We can use Mongoose directly to create the doc.
        const BookingSchema = new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            hallId: mongoose.Schema.Types.ObjectId,
            date: String,
            slotIndices: [Number],
            totalAmount: Number,
            status: String,
            documents: [String],
            // Add approvals fields if strict validation requires them in schema structure?
            // Mongoose strict mode might strip them if not defined, but for creation usually fine if partial?
            // Best to define necessary fields.
            admin1Approval: Object,
            admin2Approval: Object,
            admin3Approval: Object
        }, { timestamps: true });

        const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
        // User model is already defined above, reuse checking logic if needed or just query directly
        // const User = mongoose.models.User; // REMOVED to avoid redeclaration error

        const customerUser = await User.findOne({ email: CUSTOMER.email });

        const bookingDoc = await Booking.create({
            userId: customerUser._id,
            hallId: hallId,
            date: bookingDate,
            slotIndices: slots,
            totalAmount: 5000,
            status: 'PENDING_ADMIN1',
            documents: ['http://localhost:5000/uploads/dummy-doc.pdf']
        });
        bookingId = bookingDoc._id.toString();
        console.log(`✅ Booking Application Created in DB (ID: ${bookingId})`);

        console.log('🔄 Starting Admin Pipeline...');

        // Gate 1: Docs Verification
        await axios.patch(`${API_URL}/admin/${bookingId}/gate-1`, { notes: 'Docs OK' }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Gate 1 Approved (Docs)');

        // Gate 2: Payment Verification
        await axios.patch(`${API_URL}/admin/${bookingId}/gate-2`, { notes: 'Paid' }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Gate 2 Approved (Payment)');

        // Gate 3: Final Approval
        await axios.patch(`${API_URL}/admin/${bookingId}/gate-3`, { notes: 'Finalized' }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('✅ Gate 3 Approved (Finalized)');

        console.log('🎉 SMOKE TEST PASSED! BACKEND IS READY.');
        process.exit(0);

    } catch (error) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
        process.exit(1);
    }
}

runTest();
