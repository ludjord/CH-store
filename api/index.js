import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from '../backend/config/db.js';
import userRoutes from '../backend/routes/userRoutes.js';
import productRoutes from '../backend/routes/productRoutes.js';
import orderRoutes from '../backend/routes/orderRoutes.js';
import marketingRoutes from '../backend/routes/marketingRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
      'http://localhost:5173', 
      /\.vercel\.app$/ 
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health Check Endpoint (Handles both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
    res.json({
        status: 'ok',
        message: 'CHSTORE API is alive and reachable',
        timestamp: new Date().toISOString(),
        env: {
            has_mongo: !!process.env.MONGO_URI,
            node_env: process.env.NODE_ENV
        }
    });
});

// Base API route
app.get(['/api', '/'], (req, res) => {
    res.send('CHSTORE API is running...');
});

// Lazy Connect Database
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next();
    }
});

// Routes with Dual Path Support (Vercel Compatibility)
app.use(['/api/users', '/users'], userRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/marketing', '/marketing'], marketingRoutes);

export default app;
