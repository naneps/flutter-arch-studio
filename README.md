<div align="center">
  <h1>🏗️ Flutter Arch Studio</h1>
  <p><b>Web tool revolusioner untuk men-generate boilerplate proyek Flutter!</b></p>
  <p><i>Pilih arsitektur, state management, dan fitur favoritmu, lalu unduh dalam format <code>.zip</code> yang siap pakai.</i></p>
  
  <p>
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" />
    <img src="https://img.shields.io/badge/JSZip-E34F26?style=for-the-badge&logo=javascript&logoColor=white" alt="JSZip" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 🎯 Apa itu Flutter Arch Studio?

**Flutter Arch Studio** adalah alat berbasis web yang didesain khusus untuk mempermudah developer Flutter dalam menyiapkan fondasi (boilerplate) proyek baru. Tidak perlu lagi mengatur struktur folder, state management, dan *core files* secara manual. Cukup pilih spesifikasi yang kamu inginkan, dan unduh kodenya secara instan!

## ✨ Fitur Unggulan

- 🏗️ **Fleksibilitas Arsitektur**: Mendukung berbagai arsitektur standar industri (mis. Clean Architecture, Feature-Driven).
- 🧠 **Pilihan State Management**: Terintegrasi langsung dengan BLoC, Riverpod, Provider, atau GetX.
- 📦 **Automated Dependencies**: Otomatis menghasilkan `pubspec.yaml` yang rapi dan terkonfigurasi.
- ⚡ **Berjalan Penuh di Klien**: Memanfaatkan `JSZip` dan `file-saver` untuk membuat file ZIP langsung dari browsermu tanpa memerlukan backend!
- 🎨 **UI Modern**: Dibangun menggunakan React 18 dengan styling yang mengedepankan pengalaman pengguna.

## 💻 Tech Stack

| Teknologi                                                 | Peran dalam Proyek                                            |
| :-------------------------------------------------------- | :------------------------------------------------------------ |
| **[React 18](https://react.dev/)**                        | Core library untuk UI yang reaktif dan interaktif             |
| **[Vite](https://vitejs.dev/)**                           | Build tool super cepat untuk lingkungan pengembangan frontend |
| **[JSZip](https://stuk.github.io/jszip/)**                | Manipulasi dan pembuatan file `.zip` langsung di sisi klien   |
| **[File-Saver](https://github.com/eligrey/FileSaver.js)** | Membantu pengunduhan file ke perangkat pengguna               |
| **CSS Modules**                                           | Styling komponen yang terisolasi agar kode lebih terstruktur  |

## 🚀 Instalasi & Local Development

Ikuti langkah-langkah di bawah ini untuk menjalankan **Flutter Arch Studio** di komputermu sendiri.

### Prasyarat
Pastikan kamu telah menginstal [Node.js](https://nodejs.org/) versi terbaru.

### Langkah-langkah:

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/your-username/flutter-arch-studio.git
   cd flutter-arch-studio
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```

## 🌐 Panduan Deployment

Aplikasi ini menggunakan Vite yang sangat mudah untuk di-deploy ke platform cloud seperti [Vercel](https://vercel.com/):

```bash
# 1. Inisialisasi Git & Push ke repositori GitHub kamu
git init
git add .
git commit -m "🚀 Initial commit"
git remote add origin https://github.com/your-username/flutter-arch-studio.git
git push -u origin main

# 2. Deploy melalui Dashboard Vercel
# Buka vercel.com → Add New Project → Pilih repo ini
# Vercel akan otomatis mendeteksi konfigurasi Vite dan men-deploy aplikasimu dalam hitungan detik!
```

## 📂 Struktur Direktori

Dapatkan gambaran sekilas mengenai struktur *source code* proyek ini:

```text
src/
├── components/       # 🎨 Komponen UI (Header, ConfigPanel, OutputPanel, dll.)
├── data/             # 📊 Data konstan (pilihan arsitektur, state, fitur)
├── generators/       # ⚙️ Logika pembuat isi file Flutter
│   ├── pubspec.js        # Generator file pubspec.yaml
│   ├── coreFiles.js      # Generator main.dart, app.dart, theme, router
│   ├── authFeature.js    # Folder template untuk fitur (misal: Auth)
│   └── projectBuilder.js # Penggabung utama (Assembler) menggunakan JSZip
├── hooks/            # 🪝 Custom React Hooks untuk logika state UI
│   ├── useProjectConfig.js
│   └── useDownload.js
└── styles/           # 💅 Global CSS & konfigurasi styling lainnya
```

## 🛠️ Berkontribusi (Adding New Features)

Ingin menambahkan pilihan arsitektur atau fitur baru ke dalam *generator* ini? Sangat direkomendasikan! 

1. 📝 **Tambah Konstan**: Tambahkan data konstan baru pada `src/data/constants.js`.
2. 🔨 **Buat Generator**: Buat fungsi pembuat konten (generator) baru di dalam folder `src/generators/`.
3. 🔗 **Registrasi**: Daftarkan *generator* buatanmu ke sistem utama di `src/generators/projectBuilder.js`.

---

<div align="center">
  <b>Dibuat dengan ❤️ untuk Komunitas Flutter.</b><br><br>
  <i>⭐ Jangan lupa beri ⭐ di ujung kanan atas (Star) jika repository ini membantumu!</i>
</div>
