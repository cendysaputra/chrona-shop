import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "products.json");

const run = async () => {
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");

  // Reset produk
  const raw = JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
  const products = raw.map((p, i) => ({ ...p, productId: p.productId ?? i + 1 }));
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`${products.length} products seeded`);

  // Akun admin
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const email = ADMIN_EMAIL.toLowerCase();
    const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.findOneAndUpdate(
      { email },
      { name: ADMIN_NAME || "Chrona Admin", email, password, role: "admin" },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Admin ready: ${email}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD kosong, admin dilewati");
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seed error:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
