import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// CORS
app.use(
  cors({
    origin: (origin, cb) => {
      // Tanpa origin
      if (!origin || config.clientOrigins.length === 0) return cb(null, true);
      if (config.clientOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} tidak diizinkan`));
    },
  })
);

app.use(express.json());
app.use(morgan(config.env === "production" ? "combined" : "dev"));

// Gambar produk
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

// Cek server
app.get("/", (req, res) => res.json({ message: "Chrona API is running" }));

// Rute
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Penanganan error
app.use(notFound);
app.use(errorHandler);

// Jalankan server
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(config.port, () => console.log(`Server on http://localhost:${config.port}`));
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });
