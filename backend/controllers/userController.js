import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: 'Otorisasi Gagal: Database Offline. Sistem tidak lagi menerima Login Simulasi.' });
  }

  try {
    const user = await User.findOne({ email });

    // Cek keberadaan user dan kecocokan password menggunakan method matchPassword di model
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: 'Registrasi Gagal: Database Offline. Hubungkan MongoDB terlebih dahulu.' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password otomatis di-hash oleh middleware pre-save di userModel.js
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot Password Request
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
   const { email } = req.body;
   if(mongoose.connection.readyState !== 1) return res.status(500).json({message: 'Sistem Email Mati: Database Gagal terhubung.'});
   
   try {
     const user = await User.findOne({ email });
     if(!user) return res.status(404).json({ message: 'Alamat Email tidak terdaftar di sistem.' });
     
     // Generate OTP / Token Unik
     const resetToken = crypto.randomBytes(20).toString('hex');
     user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Kadaluarsa di 10 menit
     await user.save();

     const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
     const message = `
        <div style="font-family:sans-serif; max-w:500px; margin:auto;">
           <h2 style="color:#4F46E5;">Minta Reset Kata Sandi</h2>
           <p>Halo ${user.name}, kami menerima permintaan untuk mereset kata sandi Anda di E-Commerce MERN.</p>
           <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; background:#4F46E5; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">Tentukan Sandi Baru</a>
           <p style="font-size:12px; color:#888; mt:20px;">Jika Anda merasa tidak memintanya, abaikan email ini. Tautan kadaluarsa dalam 10 menit.</p>
        </div>
     `;
     
     await sendEmail({ email: user.email, subject: '🔑 Permintaan Reset Akses E-Commerce', message });
     res.status(200).json({ message: 'Silakan periksa Terminal Backend (Log Server) Anda. Karena layanan SMTP belum Anda isi di .env, saya mensimulasikan Pengiriman Email Link tersebut di Console Backend NodeJS!' });
   } catch(e) {
     res.status(500).json({ message: 'Sistem Gagal mengirimkan Link Email', error: e.message });
   }
};

// @desc    Reset Password Submit
// @route   PUT /api/users/resetpassword/:token
// @access  Public
const resetPassword = async (req, res) => {
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
   if(mongoose.connection.readyState !== 1) return res.status(500).json({message: 'DB Offline'});
   
   try {
     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
     });
     
     if(!user) return res.status(400).json({ message: 'Token reset sudah kadaluarsa atau tidak valid.' });
     
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpires = undefined;
     await user.save();

     res.status(200).json({ message: 'Kata Sandi berhasi diperbarui. Silakan Gunakan sandi baru Anda untuk Log In secara normal.' });
   } catch(e) {
     res.status(500).json({ message: 'Sistem gagal mengeksekusi reset password', error: e.message });
   }
};

export { authUser, registerUser, forgotPassword, resetPassword };
