import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import bookingRoutes from './routes/booking.routes';
import hallRoutes from './routes/hall.routes';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'))); // Serve images if needed

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banquet_db')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/halls', hallRoutes);

app.listen(PORT, () => console.log(`✅ Server running on Port ${PORT}`));
