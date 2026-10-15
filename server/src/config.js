// Konfigurasi
export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chrona",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  clientOrigins: (process.env.CLIENT_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET belum diisi di file .env");
}
