# Chrona Web

Toko Chrona versi web, dibangun dengan Create React App, React Router 6, dan CSS Modules. Produk, akun, dan login memakai REST API yang sama dengan aplikasi mobile di folder `server`.

## Halaman

| Route | Halaman | Akses |
|---|---|---|
| `/home` | Beranda: produk unggulan dan koleksi | publik |
| `/shop` | Daftar produk dengan filter seri dan urutan | publik |
| `/shop/:slug` | Detail produk | publik |
| `/cart` | Keranjang | publik |
| `/checkout` | Checkout | harus login |
| `/account` | Detail akun, link cepat, dan logout | harus login |
| `/login` | Login | publik |
| `/register` | Daftar akun | publik |

`/` diarahkan ke `/home`, sedangkan `/products` dan `/products/:slug` diarahkan ke `/shop`. Route lain menampilkan halaman 404.

Kalau belum login lalu membuka `/checkout` atau `/account`, pengguna diarahkan ke halaman login, lalu dikembalikan ke halaman asal setelah berhasil.
