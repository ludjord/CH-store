import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from '../backend/config/db.js';
import userRoutes from '../backend/routes/userRoutes.js';
import productRoutes from '../backend/routes/productRoutes.js';
import orderRoutes from '../backend/routes/orderRoutes.js';
import marketingRoutes from '../backend/routes/marketingRoutes.js';

dotenv.config();

const app = express();

// CORS — izinkan frontend lokal, semua subdomain Vercel, & custom domain (opsional via env)
const allowedOrigins = [
  'http://localhost:5173',
  /\.vercel\.app$/,
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Log request untuk debugging di Vercel
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect DB satu kali per instance (serverless-safe)
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.error('Database connection failed:', err.message);
      return res.status(500).json({ message: 'Database Connection Error', error: err.message });
    }
  }
  next();
});

// Gunakan Router agar fleksibel (beberapa env Vercel menghapus prefix /api)
const router = express.Router();
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/marketing', marketingRoutes);
router.get('/', (req, res) => res.json({ status: 'CHSTORE API running ✅' }));

// Daftarkan ke kedua kemungkinan path
app.use('/api', router);
app.use('/', router); 

// Global error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;
