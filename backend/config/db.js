import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // 1. Matikan buffering agar error langsung muncul (tidak gantung 10 detik)
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
       family: 4,               // Gunakan IPv4 untuk menghindari bug DNS Windows
       serverSelectionTimeoutMS: 5000, // Berhenti mencoba jika tidak konek dalam 5 detik
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DATABASE_ERROR: ${error.message}`);
    if (error.message.includes('buffering timed out') || error.message.includes('timeout')) {
       console.warn('⚠️ KASUS WHITE-LIST: IP Anda kemungkinan besar belum diizinkan di panel MongoDB Atlas!');
    } else {
       console.warn('⚠️ Server tetap berjalan tanpa koneksi Database. Pastikan MongoDB Atlas / Local menyala!');
    }
  }
};

export default connectDB;
