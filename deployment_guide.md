# 📕 Panduan Teliti Deployment CHSTORE ke Vercel

Kodingan Anda sudah saya perbaiki dan status Git sudah bersih. Ikuti langkah-langkah presisi ini untuk mendeploy ke Vercel:

## Langkah 1: Hubungkan ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik tombol **"Add New"** → **"Project"**.
3. Di daftar repositori GitHub, cari repositori Anda (contoh: `CHSTORE`). Klik **"Import"**.

## Langkah 2: Konfigurasi Proyek (PENTING!)
Pada layar **"Configure Project"**, pastikan pengaturan berikut tepat:

*   **Framework Preset**: Biarkan `Other` atau `Vite`.
*   **Root Directory**: Biarkan `./` (root).
*   **Build & Output Settings**:
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
    *   **Install Command**: `npm install` (Biarkan default).

## Langkah 3: Mengisi Environment Variables
Klik bagian **"Environment Variables"** dan masukkan satu per satu variabel dari file `.env.example`. 

| Key | Value (Saran/Cara Ambil) |
| :--- | :--- |
| `MONGO_URI` | Ambil dari MongoDB Atlas (Connect → Drivers → Node.js). Jangan lupa ganti `<password>` dengan password user database Anda. |
| `JWT_SECRET` | Ketik apa saja yang panjang dan acak (contoh: `chstore_secret_2024_!@#`). |
| `NODE_ENV` | `production` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_USER` | Email Gmail Anda. |
| `SMTP_PASS` | **"App Password"** dari Google (Bukan password akun utama!). |

> [!IMPORTANT]
> **FRONTEND_URL**: Masukkan URL Vercel Anda nanti (contoh: `https://chstore-ludfi.vercel.app`). Jika belum tahu, Anda bisa menambahkannya nanti setelah deploy pertama selesai di bagian Settings proyek di Vercel.

## Langkah 4: Eksekusi Deploy
1. Klik tombol **"Deploy"**.
2. Tunggu proses *Building* (sekitar 1-2 menit).
3. Jika muncul kembang api 🎉, artinya berhasil!

## Langkah 5: Verifikasi Akhir
Setelah deploy selesai, buka URL website Anda dan tes:
1. Apakah produk muncul? (Jika tidak, cek di Log Vercel apakah koneksi DB berhasil).
2. Coba klik **"Masuk Akun"**.
3. Coba isi keranjang belanja.

---

### 🆘 Troubleshooting (Jika Gagal)
*   **Error "Module Not Found"**: Jangan khawatir, Vercel akan menginstall dependensi secara otomatis karena kita sudah punya `api/package.json` dan `package.json` di root.
*   **Error "Database Connection"**: Pastikan IP di MongoDB Atlas sudah `0.0.0.0/0` (Tadi sudah kita cek, sudah benar).
*   **Error "Build Failed"**: Cek tab **Logs** di Vercel untuk melihat pesan error spesifik.
