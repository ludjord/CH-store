import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// Middleware to protect routes (require login)
const protect = async (req, res, next) => {
  // Ambil token murni dari cookie (HttpOnly)
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // Apabila user masih membawa mock token saat request dari frontend yg belum dibersihkan
    res.status(401).json({ message: 'Not authorized, no valid token. Simulasi telah ditutup.' });
  }
};

// Middleware to authorize admin only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Not authorized as an admin' });
  }
};

export { protect, admin };
