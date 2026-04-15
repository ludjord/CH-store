# CHSTORE - Premium MERN E-Commerce

CHSTORE adalah aplikasi e-commerce full-stack modern yang dibangun menggunakan MERN Stack (MongoDB, Express, React, Node.js). Website ini dirancang dengan estetika premium, mode gelap (dark mode), dan pengalaman pengguna yang halus.

## ✨ Fitur Utama
- **Frontend Modern**: Menggunakan React 19, Tailwind CSS, dan Vite untuk performa super cepat.
- **Manajemen State**: Menggunakan Zustand untuk pengelolaan state yang ringan.
- **Sistem Autentikasi**: JWT (JSON Web Token) dengan fitur login, register, forgot password, dan reset password.
- **Dashboard Admin**: Pengelolaan produk, pesanan, dan strategi marketing (Promo/Banner) dalam satu tempat.
- **Integrasi Pembayaran**: Terintegrasi dengan Midtrans Payment Gateway (Snap API).
- **Pengiriman Email**: Notifikasi otomatis menggunakan Nodemailer (untuk reset password & status pesanan).
- **Desain Responsif**: Tampilan optimal di perangkat mobile maupun desktop.
- **Serverless Ready**: Siap dideploy ke Vercel dengan konfigurasi Serverless Functions.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide React, Zustand, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Mongoose).
- **Tools**: Vercel (Deployment), Midtrans (Payment).

## 🚀 Cara Menjalankan Lokal
1. **Clone repositori**:
   ```bash
   git clone <link-repo-anda>
   ```
2. **Setup Backend**:
   - Masuk ke folder `backend/`
   - Buat file `.env` (isi sesuai template `.env.example`)
   - Jalankan `npm install` kemudian `npm run dev`
3. **Setup Frontend**:
   - Masuk ke folder `frontend/`
   - Jalankan `npm install` kemudian `npm run dev`

## ☁️ Deployment (Vercel)
Proyek ini telah dikonfigurasi untuk Vercel. Cukup hubungkan repositori Anda ke Vercel Dashboard, atur **Environment Variables** (seperti yang tercantum di `.env.example`), dan deploy!

---
*Dibuat untuk keperluan Portofolio E-Commerce Premium.*
