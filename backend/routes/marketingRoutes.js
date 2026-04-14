import express from 'express';
import { getActiveMarketing, updateMarketing } from '../controllers/marketingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getActiveMarketing)
  .post(protect, admin, updateMarketing);

export default router;
