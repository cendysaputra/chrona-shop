import { body, query } from "express-validator";
import { PRODUCT_TAGS } from "../models/Product.js";

const SORTS = ["newest", "price-asc", "price-desc", "best-selling"];

// Wajib pas create
const field = (name, isCreate, label) =>
  isCreate
    ? body(name).exists({ values: "falsy" }).withMessage(`${label} wajib diisi`).bail()
    : body(name).optional();

// Aturan field
const fields = (isCreate) => [
  field("name", isCreate, "name")
    .isString()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("name 2-120 karakter"),

  (isCreate
    ? body("price").exists({ values: "null" }).withMessage("price wajib diisi").bail()
    : body("price").optional())
    .isInt({ min: 0 })
    .withMessage("price harus angka bulat >= 0")
    .toInt(),

  body("slug")
    .optional()
    .isString()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("slug hanya huruf kecil, angka, dan tanda -"),

  body("series").optional().isString().trim().isLength({ max: 60 }),
  body("tagline").optional().isString().trim().isLength({ max: 160 }),
  body("description").optional().isString().isLength({ max: 2000 }),
  body("image").optional().isString().trim(),

  body("stock").optional().isInt({ min: 0 }).withMessage("stock harus angka >= 0").toInt(),
  body("sold").optional().isInt({ min: 0 }).withMessage("sold harus angka >= 0").toInt(),

  body("tags").optional().isArray().withMessage("tags harus array"),
  body("tags.*").isIn(PRODUCT_TAGS).withMessage(`tag harus salah satu: ${PRODUCT_TAGS.join(", ")}`),

  body("releaseDate").optional().isISO8601().withMessage("releaseDate format YYYY-MM-DD").toDate(),

  body("specs").optional().isObject().withMessage("specs harus object"),
  body("specs.*").optional().isString().withMessage("isi specs harus teks"),
];

export const createProductRules = fields(true);
export const updateProductRules = fields(false);

// Aturan query
export const listProductRules = [
  query("tag").optional().isIn(PRODUCT_TAGS).withMessage(`tag harus: ${PRODUCT_TAGS.join(", ")}`),
  query("series").optional().isString().trim(),
  query("sort").optional().isIn(SORTS).withMessage(`sort harus: ${SORTS.join(", ")}`),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit 1-100").toInt(),
];
