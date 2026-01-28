import express from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';
import { getClerkDashboard } from '../controllers/admin.controller';

const router = express.Router();

// The Lifeline Route
router.get('/clerk-dashboard', verifyToken, authorizeRoles('ADMIN1', 'SUPERADMIN'), getClerkDashboard);

export default router;
