# aksesibel.id

📘 **aksesibel.id** adalah situs dokumentasi dan edukasi aksesibilitas digital berbahasa Indonesia, dibangun menggunakan [Grav CMS](https://getgrav.org). Situs ini dikelola oleh [Rifat Najmi](https://github.com/rifatnajmi) dan berisi panduan, glosarium, serta audit aksesibilitas untuk organisasi dan individu yang peduli pada keberagaman pengguna.

## 📂 Struktur Proyek

Repositori ini berisi seluruh source code situs Grav, termasuk:
- `user/pages/`: Konten situs dalam format Markdown
- `user/themes/`: Tema kustom yang digunakan untuk menjalankan [aksesibel.id](https://aksesibel.id)
- Tanpa `user/accounts/`: Harap buat akun admin sendiri

## 🚀 Cara Menjalankan di Lokal

### 1. Clone repo ini:
```bash
git clone https://github.com/rifatnajmi/aksesibel.id.git
cd aksesibel.id
```
### 2.Install dependensi (jika `composer.json` tersedia): 
```bash
composer install
```
### 3. Jalankan server lokal:
```bash
php -S localhost:8000
```
Akses di browser: `http://localhost:8000`
Atau gunakan [MAMP](https://www.mamp.info/en/mac/) seperti yang digunakan pengembang.

## 📦 Grav Skeleton
Ini adalah full Grav site (bukan theme/plugin), jadi kamu bisa langsung clone dan jalankan, tidak perlu install Grav terpisah.

## ⚠️ Catatan Keamanan
Folder `user/accounts/` tidak diikutsertakan. Jika kamu ingin login sebagai admin di lokal:
Jalankan Grav untuk membuat user account baru.

## 📄 Lisensi
- Hak cipta oleh [radikal studio](https://radikal.id) dan tim kontributor.
- Konten: CC BY 4.0
- Kode: MIT License