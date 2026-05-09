# 🚀 Professional POS & Management System

Sistem Point of Sales (POS) perusahaan modern yang dibangun dengan **Laravel**, **Inertia.js**, dan **React**. Aplikasi ini dirancang untuk memberikan pengalaman manajemen inventaris dan transaksi yang cepat, aman, dan estetik.

---

## 🛠️ Tech Stack

- **Backend:** [Laravel 13.8.0+](https://laravel.com/)
- **Frontend:** [React](https://reactjs.org/) dengan [Inertia.js](https://inertiajs.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/) (Data Visualisasi Real-time)
- **Tables:** [TanStack Table v8](https://tanstack.com/table) (DataTables)
- **Auth & RBAC:** [Spatie Permission](https://spatie.be/docs/laravel-permission/v6/introduction)
- **PDF Engine:** [Laravel DomPDF](https://github.com/barryvdh/laravel-dompdf)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## ✨ Fitur Utama

### 📊 Dashboard Analytics
- Visualisasi pendapatan real-time menggunakan Area Chart.
- Ringkasan statistik (Total Sales, Revenue hari ini, Total Produk, Total Customer).
- List Produk Terlaris secara otomatis.

### 🛒 POS & Transaksi
- Pembuatan pesanan (Order) yang dinamis.
- **Invoice PDF Profesional**: Generate struk belanja dalam format PDF yang rapi dan siap cetak (terbuka di tab baru).

### 🔐 RBAC (Role Based Access Control)
- Manajemen **Role** & **Permission** yang sangat granular.
- Navigasi Sidebar dinamis sesuai hak akses user.

### ⚡ Fitur Tabel Canggih
- **Nomor Urut (No.)**: Sinkron dengan paginasi.
- **Rows per Page**: Pilihan tampilan (5, 10, 20, 30, 40, 50, ALL).

---

## 📦 Kelengkapan Attachment
- `project_laravel.zip`: Source code lengkap aplikasi.
- `database.sql`: Database yang sudah di-export (siap di-import).

---

## 🚀 Panduan Instalasi (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan project di lokal Anda:

### 1. Ekstrak Projek
Ekstrak file `project_laravel.zip` ke folder server lokal Anda (misalnya `htdocs` atau folder workspace Anda).

### 2. Persiapan Database
1. Buat database baru di MySQL (misal nama: `project_laravel`).
2. Import file `database.sql` ke database tersebut.

### 3. Setup Environment
Pastikan file `.env` sudah ada di root folder. Sesuaikan konfigurasi database berikut:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_laravel
DB_USERNAME=root
DB_PASSWORD=
```
Jalankan perintah berikut untuk generate key:
```bash
php artisan key:generate
```

### 4. Install Dependency
Buka terminal di folder projek, lalu jalankan:

**Backend:**
```bash
composer install
```
**Frontend:**
```bash
npm install
```

### 5. Link Storage
Agar gambar produk muncul, jalankan:
```bash
php artisan storage:link
```

---

## 💻 Menjalankan Aplikasi

Buka dua terminal dan jalankan perintah berikut:

**Terminal 1 (Laravel Server):**
```bash
php artisan serve
```

**Terminal 2 (Vite Assets):**
```bash
npm run dev
```

Aplikasi dapat diakses di: `http://127.0.0.1:8000`

---

## 🔐 Akun Default untuk Testing
Anda bisa login menggunakan akun berikut:
- **Email:** `admin@gmail.com`
- **Password:** `password`
- **Role:** Super Admin

---

## 🧪 Panduan Pengujian (Testing)
1.  **Dashboard**: Cek grafik pendapatan.
2.  **Transaksi**: Buat pesanan baru, lalu klik **PRINT STRUK** untuk melihat PDF.
3.  **Role & Permission**: Coba batasi akses user melalui menu Master Role & Permission.

---

## 📝 Catatan Penting
Jika muncul error `Target class [dompdf.wrapper] does not exist`, lakukan **restart** pada perintah `php artisan serve`.

---
