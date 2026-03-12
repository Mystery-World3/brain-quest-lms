
# BrainQuest Digital

Sebuah platform pendukung pembelajaran yang memungkinkan Guru untuk mengelola kuis dan Siswa untuk mengerjakan soal secara interaktif dengan umpan balik langsung.

## Fitur Utama:
- **Role Guru**: Login tersembunyi, CRUD Soal, Monitoring Nilai Siswa, Dashboard Statistik, Manajemen Kelas Aktif.
- **Role Siswa**: Pemilihan kelas aktif, pengerjaan kuis interaktif (PG & Isian), review jawaban, skor instan.
- **Keyboard Matematika**: Memudahkan guru menginput simbol matematika kompleks.
- **UI Modern**: Desain kontras tinggi dengan skema warna biru profesional, font Space Grotesk dan Inter.

## Teknologi:
- Next.js 15 (App Router)
- Tailwind CSS
- Shadcn UI
- Lucide React Icons
- Recharts for Dashboard
- Firebase Firestore (Cloud Database)

## Setup Environment Variables:
Buat file `.env.local` di root direktori dan masukkan kunci Firebase Anda:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=brainquest-1fd17.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=brainquest-1fd17
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=brainquest-1fd17.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=94395132879
NEXT_PUBLIC_FIREBASE_APP_ID=1:94395132879:web:9a1ae56c370fd568d7c0ba
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LSPY9SGVW2
```
