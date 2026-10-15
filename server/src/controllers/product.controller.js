import mongoose from "mongoose";
import Product from "../models/Product.js";

// Field
const FIELDS = [
  "name", "slug", "series", "tagline", "description", "price",
  "stock", "sold", "tags", "releaseDate", "image", "specs",
];

const SORT_MAP = {
  newest: { releaseDate: -1, createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  "best-selling": { sold: -1 },
};

// Ambil field
const pick = (src) =>
  FIELDS.reduce((acc, key) => {
    if (src[key] !== undefined) acc[key] = src[key];
    return acc;
  }, {});

// Buat slug
const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Filter key
const keyFilter = (key) => {
  if (/^\d+$/.test(key)) return { productId: Number(key) };
  if (mongoose.isValidObjectId(key)) return { _id: key };
  return { slug: key.toLowerCase() };
};

// productId berikutnya
const nextProductId = async () => {
  const last = await Product.findOne().sort({ productId: -1 }).select("productId");
  return (last?.productId || 0) + 1;
};

// Daftar produk
export const listProducts = async (req, res, next) => {
  try {
    const { tag, series, sort = "newest", limit } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (series) filter.series = series;

    let q = Product.find(filter).sort(SORT_MAP[sort]);
    if (limit) q = q.limit(limit);

    res.json(await q);
  } catch (err) { next(err); }
};

// Detail produk
export const getProduct = async (req, res, next) => {
  try {
    const item = await Product.findOne(keyFilter(req.params.key));
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (err) { next(err); }
};

// Tambah produk
export const createProduct = async (req, res, next) => {
  try {
    const data = pick(req.body);
    if (!data.slug) data.slug = slugify(data.name);
    data.productId = await nextProductId();
    const item = await Product.create(data);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

// Ubah produk
export const updateProduct = async (req, res, next) => {
  try {
    const item = await Product.findOneAndUpdate(keyFilter(req.params.key), pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json(item);
  } catch (err) { next(err); }
};

// Hapus produk
export const deleteProduct = async (req, res, next) => {
  try {
    const item = await Product.findOneAndDelete(keyFilter(req.params.key));
    if (!item) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", productId: item.productId });
  } catch (err) { next(err); }
};
