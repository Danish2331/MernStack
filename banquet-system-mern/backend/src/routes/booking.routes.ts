import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.middleware';
import { createBooking, getBookingDocument, getUserBookings, payBooking } from '../controllers/booking.controller';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only JPG files are allowed'));
        }
    }
});

router.post('/', protect, upload.single('document'), createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:id/document', getBookingDocument);
// NEW: Route for customer payment
router.post('/:id/pay', protect, payBooking);

export default router;
