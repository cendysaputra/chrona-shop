# Chrona

Toko online smartwatch fiktif: REST API, web, dan aplikasi mobile.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-React_Native-000020?logo=expo&logoColor=white)

## Isi Repo

| Folder | Isi | Stack |
|---|---|---|
| `server/` | REST API | Express, MongoDB, JWT |
| `shop/` | Web toko | React 18, React Router |
| `mobile/` | Aplikasi Android/iOS | Expo, Expo Router, TypeScript |

Fitur: katalog 20 produk, filter & sort, detail produk, keranjang, checkout (simulasi), login/register, dan halaman akun.

## Katalog

<table>
  <tr>
    <td align="center"><img src="server/public/images/products/chrona-pulse-pro-49-black-titanium.webp" width="130" /><br /><b>Pulse Pro</b><br />Rp3.799.000</td>
    <td align="center"><img src="server/public/images/products/chrona-pulse-45-graphite.webp" width="130" /><br /><b>Pulse</b><br />mulai Rp1.799.000</td>
    <td align="center"><img src="server/public/images/products/chrona-active-42-sage.webp" width="130" /><br /><b>Active</b><br />mulai Rp1.299.000</td>
  </tr>
  <tr>
    <td align="center"><img src="server/public/images/products/chrona-lite-40-mist-blue.webp" width="130" /><br /><b>Lite</b><br />mulai Rp699.000</td>
    <td align="center"><img src="server/public/images/products/chrona-trail-47-signal-orange.webp" width="130" /><br /><b>Trail</b><br />mulai Rp2.799.000</td>
    <td align="center"><img src="server/public/images/products/chrona-classic-42-silver-brown-leather.webp" width="130" /><br /><b>Classic</b><br />mulai Rp2.499.000</td>
  </tr>
</table>

## Menjalankan

Butuh Node.js 18+ dan MongoDB (lokal atau Atlas).

**1. Server** → `http://localhost:5050`

```bash
cd server
npm install
cp .env.example .env   # isi JWT_SECRET dan akun admin
npm run seed           # isi produk + akun admin
npm run dev
```

Buat `JWT_SECRET` acak:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**2. Web** → `http://localhost:3000`

```bash
cd shop
npm install
cp .env.example .env   # REACT_APP_API_URL
npm start
```

**3. Mobile**

```bash
cd mobile
npm install
cp .env.example .env   # EXPO_PUBLIC_API_URL = IP lokal komputer
npm start
```

> [!NOTE]
> Di HP, pakai IP lokal (misal `192.168.1.10:5050`), bukan `localhost`.

## Endpoint

| Method | Path | Akses |
|---|---|---|
| `GET` | `/api/products` | publik |
| `GET` | `/api/products/:key` | publik |
| `POST` | `/api/products` | admin |
| `PUT` `DELETE` | `/api/products/:key` | admin |
| `POST` | `/api/users/register` | publik |
| `POST` | `/api/users/login` | publik |
| `GET` | `/api/users/me` | login |
| `GET` | `/api/users` | admin |
| `GET` `PUT` | `/api/users/:id` | admin / pemilik |
| `DELETE` | `/api/users/:id` | admin |

- `:key` bisa nomor produk, slug, atau `_id`.
- Filter produk: `tag`, `series`, `sort` (`newest`, `price-asc`, `price-desc`, `best-selling`), `limit`.
- Token: header `Authorization: Bearer <token>`.
- Gambar: `/images/products/<slug>.webp`.

## Deploy

- API: Railway
- Web: Vercel (`shop/vercel.json`)
- Mobile: EAS Build (`mobile/eas.json`)

---

Chrona adalah merek fiktif. Nama produk, harga, dan spesifikasi dibuat sendiri untuk latihan.
