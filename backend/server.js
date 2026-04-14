import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';

// Load env vars forcefully (menimpa cache terminal lama yang nyangkut)
dotenv.config({ override: true });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: [
      'http://localhost:5173', 
      'https://chstore-ludfi.vercel.app', // Contoh domain vercel Anda nanti
      /\.vercel\.app$/ // Izinkan semua subdomain vercel
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Basic Route
app.get('/', (req, res) => {
    res.send('CHSTORE API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/marketing', marketingRoutes);

// Export for Vercel
export default app;

// Only listen if not in production/vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}
