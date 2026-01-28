import { Router } from 'express';
import authRoutes from './auth.routes';
import hallRoutes from './hall.routes';
import bookingRoutes from './booking.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount all modules
router.use('/auth', authRoutes);
router.use('/halls', hallRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes); // New Admin Pipeline routes

export default router;
