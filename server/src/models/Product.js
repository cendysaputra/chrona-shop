import mongoose from "mongoose";

export const PRODUCT_TAGS = ["new", "best-seller"];

// Spesifikasi
const specsSchema = new mongoose.Schema(
  {
    caseSize: { type: String, trim: true },
    caseMaterial: { type: String, trim: true },
    strap: { type: String, trim: true },
    display: { type: String, trim: true },
    battery: { type: String, trim: true },
    gps: { type: String, trim: true },
    waterResistance: { type: String, trim: true },
    connectivity: { type: String, trim: true },
    compatibility: { type: String, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true, min: 1 },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    series: { type: String, trim: true, default: "" },
    tagline: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0, min: 0 },
    tags: {
      type: [{ type: String, enum: PRODUCT_TAGS }],
      default: ["new"],
    },
    releaseDate: { type: Date, default: Date.now },
    image: { type: String, default: "" },
    specs: { type: specsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
