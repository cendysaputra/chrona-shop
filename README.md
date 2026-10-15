# Chrona

REST API untuk marketplace smartwatch fiktif Chrona. Berisi data 20 produk dalam enam seri (Pulse Pro, Pulse, Active, Lite, Trail, Classic) dan akun pengguna dengan login JWT. Frontend belum ada.

**Teknologi:** Node.js, Express, MongoDB (Mongoose), express-validator, JWT, bcryptjs

## Menjalankan

Butuh Node.js 18+ dan MongoDB (lokal di port 27017 atau Atlas).

```
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

API berjalan di `http://localhost:5050`. Port 5050 dipakai karena port 5000 sering diblokir Windows (`EACCES`).

Isi `.env` sesuai `.env.example`. `JWT_SECRET` wajib diisi, bisa dibuat dengan:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`npm run seed` mengisi ulang semua produk dan membuat (atau memperbarui) akun admin dari `ADMIN_EMAIL` dan `ADMIN_PASSWORD`.

## Endpoint

| Method | Path | Akses |
|---|---|---|
| GET | /api/products | publik |
| GET | /api/products/:key | publik |
| POST | /api/products | admin |
| PUT | /api/products/:key | admin |
| DELETE | /api/products/:key | admin |
| POST | /api/users/register | publik |
| POST | /api/users/login | publik |
| GET | /api/users/me | login |
| GET | /api/users | admin |
| GET | /api/users/:id | admin / pemilik |
| PUT | /api/users/:id | admin / pemilik |
| DELETE | /api/users/:id | admin |

- `:key` bisa berupa nomor produk (`3`), slug (`chrona-pulse-45-graphite`), atau `_id`.
- Filter daftar produk: `tag` (`new`, `best-seller`), `series`, `sort` (`newest`, `price-asc`, `price-desc`, `best-selling`), `limit` (1-100).
- Token dikirim lewat header `Authorization: Bearer <token>`.
- Gambar produk tersedia di `/images/products/<slug>.webp`.

## Catatan

Chrona adalah merek fiktif. Nama produk, harga, dan spesifikasi dibuat sendiri untuk keperluan latihan.
