# Brain Quest LMS 🧠📚

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/Mystery-World3/brain-quest-lms)](https://github.com/Mystery-World3/brain-quest-lms/issues)
[![GitHub forks](https://img.shields.io/github/forks/Mystery-World3/brain-quest-lms)](https://github.com/Mystery-World3/brain-quest-lms/network)
[![GitHub stars](https://img.shields.io/github/stars/Mystery-World3/brain-quest-lms)](https://github.com/Mystery-World3/brain-quest-lms/stargazers)

Brain Quest LMS adalah sebuah *Learning Management System* (Sistem Manajemen Pembelajaran) interaktif yang dirancang untuk memberikan pengalaman belajar yang modern, terstruktur, dan tersinkronisasi secara real-time. Platform ini memfasilitasi Guru dalam mengelola kuis dan memantau progres siswa, serta membantu Siswa dalam mengasah kemampuan melalui tantangan interaktif.

## ✨ Fitur Utama

*   **Manajemen Kelas & Kuis:** Guru dapat membuat, mengedit, dan mengaktifkan kelas serta bank soal kuis secara terpusat di Cloud.
*   **Dasbor Real-time:** Visualisasi data performa siswa menggunakan grafik interaktif yang diperbarui secara otomatis saat kuis selesai.
*   **Pengalaman Siswa Interaktif:** Antarmuka kuis yang responsif dengan dukungan tipe soal Pilihan Ganda dan Isian Singkat.
*   **Keyboard Matematika:** Memudahkan Guru dan Siswa dalam menginput simbol matematika kompleks secara presisi.
*   **Sinkronisasi Cloud:** Data tersimpan aman di Firebase Firestore, memungkinkan akses sinkron antara HP (Siswa) dan PC (Guru).
*   **Integrasi AI (Genkit):** Arsitektur siap pakai untuk implementasi fitur kecerdasan buatan di masa mendatang.

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
*   **UI Components:** Shadcn UI & Lucide React Icons.
*   **Database:** Firebase Firestore (Cloud NoSQL Database).
*   **State Management:** React Hooks & Firebase Real-time Listeners.
*   **AI Framework:** Google Genkit.

## 🚀 Memulai (Getting Started)

Ikuti petunjuk di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:
*   [Node.js](https://nodejs.org/) (Versi terbaru direkomendasikan)
*   [Git](https://git-scm.com/)
*   Akun [Firebase](https://console.firebase.google.com/) untuk database Cloud.

### Instalasi

1.  **Kloning repositori ini:**
    ```bash
    git clone https://github.com/Mystery-World3/brain-quest-lms.git
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd brain-quest-lms
    ```

3.  **Instal dependensi:**
    ```bash
    npm install
    ```

4.  **Konfigurasi Variabel Lingkungan:**
    *   Buat file `.env.local` di direktori root.
    *   Masukkan kredensial Firebase Anda seperti contoh berikut:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

5.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi sekarang seharusnya berjalan di `http://localhost:9002` (atau port yang ditentukan).

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi pada proyek ini, silakan ikuti langkah-langkah berikut:

1.  *Fork* repositori ini.
2.  Buat *branch* fitur Anda (`git checkout -b feature/FiturKerenAnda`).
3.  *Commit* perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  *Push* ke *branch* tersebut (`git push origin feature/FiturKerenAnda`).
5.  Buka *Pull Request*.

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

## 📬 Kontak

**Mishbahul**
*   GitHub: [@Mystery-World3](https://github.com/Mystery-World3)
*   Project Link: [https://github.com/Mystery-World3/brain-quest-lms](https://github.com/Mystery-World3/brain-quest-lms)