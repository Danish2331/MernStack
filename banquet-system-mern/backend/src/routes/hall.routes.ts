import express from 'express';
import { getAllHalls, getHallById } from '../controllers/hall.controller';
const router = express.Router();
router.get('/', getAllHalls);
router.get('/:id', getHallById);
export default router;
