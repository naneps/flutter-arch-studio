<div align="center">
  <img src="../public/favicon.png" alt="Flutter Arch Studio Logo" width="100" style="border-radius: 20px; margin-bottom: 10px;" />
  <h1>📖 Panduan Penggunaan Flutter Arch Studio</h1>
  <p><b>Langkah demi langkah menggunakan Flutter Arch Studio untuk mempercepat *development* aplikasi Flutter kamu.</b></p>
</div>

---

## 🌟 Pengenalan (Introduction)

**Flutter Arch Studio** dibuat untuk mengatasi masalah repetitif saat memulai proyek Flutter baru: mengatur struktur folder (*folder structure*), menginstal *package* untuk *state management*, serta menyiapkan *core files* (seperti `main.dart`, *routing*, dan *theme*).

Dengan *tool* ini, proses *setup* yang biasanya memakan waktu berjam-jam kini bisa diselesaikan hanya dalam **hitungan detik** melalui antarmuka web yang interaktif.

---

## 🛠️ Cara Menggunakan Web

Berikut adalah panduan lengkap cara men-generate proyek perdana kamu menggunakan **Flutter Arch Studio**:

### 1️⃣ Konfigurasi *Project Details* (Detail Proyek)
Pada bagian panel sebelah kiri, kamu akan diminta untuk mengisi detail dasar proyek:
- **Nama Proyek:** Masukkan nama aplikasi kamu (gunakan format *snake_case*, contoh: `my_awesome_app`).
- **Organization ID:** Biasanya berupa kebalikan dari nama domain perusahaan (contoh: `com.perusahaanmu`). Ini berguna untuk konfigurasi *bundle ID* di Android/iOS.

### 2️⃣ Pilih Arsitektur (*Architecture*)
Terdapat beberapa pilihan arsitektur standar industri. Pilih yang paling cocok dengan preferensi tim atau skala proyek:
- **Clean Architecture:** Memisahkan *logic* bisnis murni, *data layer*, dan *presentation* secara tegas. Sangat direkomendasikan untuk proyek berskala sedang ke besar.
- **Feature-Driven / Layered:** Pengelompokan folder berdasarkan fitur (misal: `auth`, `home`, `profile`). Cocok untuk proyek yang mengutamakan skalabilitas per-fitur.
- **MVC/MVVM:** Struktur klasik yang disederhanakan.

### 3️⃣ Pilih *State Management*
Tentukan otak penggerak aplikasi kamu. *Tool* ini akan otomatis menyesuaikan *dependencies* `pubspec.yaml` serta contoh *file* yang di-generate:
- **BLoC (Business Logic Component)** - Pilihan populer & *robust* (menggunakan `flutter_bloc`).
- **Riverpod** - Versi modern & *compile-safe* dari Provider.
- **GetX** - Cepat, ringkas, dan mudah dipelajari.
- **Provider** - *State management* standar yang direkomendasikan Flutter team di masa lalu.

### 4️⃣ Pilih Fitur Tambahan (Opsional)
Centang fitur-fitur awal yang ingin kamu sertakan *pre-configured* dalam proyek:
- ✅ **Authentication:** *Template* untuk fitur *Login* & *Register* (lengkap dengan UI statis dan *layer data*).
- ✅ **Network Client (Dio/Http):** Setup *base URL*, *interceptor* *error*, dan *logger* siap pakai.
- ✅ **Local Storage (SharedPreferences/Hive):** Konfigurasi dasar *caching*.
- ✅ **Routing (GoRouter / AutoRoute):** Setup *routing* modern dengan navigasi berbasis nama/posisi.

### 5️⃣ Eksplorasi Kode (*Preview*)
Setelah melakukan konfigurasi di sebelah kiri, perhatikan panel hasil/output di **sebelah kanan**. Kamu akan melihat **Tree View** (Struktur Folder) yang sangat interaktif. 
- Klik pada nama file untuk melihat *preview* kasar kode yang akan di-generate.

### 6️⃣ Unduh Kode (*Download .zip*)
Jika strukturnya sudah sesuai keinginanmu:
1. Klik tombol **Download / Generate .zip** (biasanya berada di bagian bawah panel konfigurasi).
2. File *zip* berisi *full project flutter* akan otomatis terunduh ke perangkatmu.
3. Ekstrak file tersebut ke dalam **folder kosong**.
4. Buka folder tersebut di terminal, lalu jalankan `sh setup.sh` (Mac/Linux) atau klik dua kali/jalankan `setup.bat` (Windows). 
   *(Script ini akan men-generate folder native Android/iOS melalui `flutter create .` sekaligus menginstal seluruh package dependensinya `flutter pub get`)*.
5. Aplikasi siap dijalankan (`flutter run`)! 🎉

---

## 💡 FAQ & Tips Tambahan

1. **Apakah saya membutuhkan koneksi internet untuk men-generate zip?**
   Tidak, proses *zipping* dilakukan 100% di *client-side* (browser) menggunakan `JSZip`. Sangat aman dan cepat!

2. **Saya ingin menambahkan Arsitektur buatan saya sendiri, bagaimana caranya?**
   Kamu bisa *clone* *repository* ini dan ikuti panduan kontribusi yang ada di halaman utama [`README.md`](../README.md).

<br>

<div align="center">
  <b>Siap untuk bereksperimen?</b><br>
  Jalankan <i>local server</i> dan mulai *generate* proyek Flutter impianmu! 🚀
</div>
