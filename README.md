# Mamoria

Mamoria adalah aplikasi pencatatan data ibu hamil menggunakan React Native (Expo Router) + SQLite.

## Fitur Utama
- Mencatat data ibu hamil (nama, umur, usia kehamilan, nomor telepon, dll).
- Menambahkan foto profil mama.
- Menampilkan list semua data mama.
- Melihat detail data mama.
- Edit dan hapus data mama.

## Teknologi
- React Native (Expo)
- Expo Router
- React Native Paper
- expo-sqlite (untuk database lokal)
- expo-image-picker (ambil foto dari galeri)

## Struktur Project
```
/app
  /add (halaman tambah mama)
  /detail
    [id].tsx (halaman detail mama)
  /edit
    [id].tsx (halaman edit mama)
  index.tsx (halaman home)
  /screens
    HomeScreen
      /components
        SearchBar.tsx
        MamaList.tsx
        MainInfo.tsx
        DetailInfo.tsx
/database
  mamaDatabase.ts (database helper untuk mama)
/types
  mama.ts (tipe data mama)
```

## Instalasi
```bash
npm install
npm run start
```

## Notes
- Pastikan permission kamera dan galeri sudah diatur.
- Database disimpan di perangkat pengguna, tidak tersinkronisasi online.
