import express from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
