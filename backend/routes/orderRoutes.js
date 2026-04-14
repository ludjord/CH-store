import express from 'express';
import { 
  getOrders, 
  createOrder, 
  getPaymentToken, 
  updateOrderToDelivered, 
  updateOrderToPaidManual 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, createOrder); 

router.route('/:id/pay').get(protect, getPaymentToken);
router.route('/:id/pay-manual').put(protect, admin, updateOrderToPaidManual);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
