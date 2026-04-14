import express from 'express';
import { authUser, registerUser, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

// Rute contoh (Dummy) untuk mendemonstrasikan proteksi JWT Middleware
router.get('/profile', protect, (req, res) => {
  res.json({ message: `Akses diizinkan, halo ${req.user.name}!` });
});

// Rute contoh (Dummy) untuk mendemonstrasikan proteksi Khusus Admin
router.get('/admin-dashboard', protect, admin, (req, res) => {
  res.json({ message: `Akses admin diizinkan. Mengambil seluruh data sistem...` });
});

export default router;
