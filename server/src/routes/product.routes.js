import { Router } from "express";
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct,
} from "../controllers/product.controller.js";
import { auth, requireAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  listProductRules, createProductRules, updateProductRules,
} from "../validators/product.validator.js";

const router = Router();

// Publik
router.get("/", listProductRules, validate, listProducts);
router.get("/:key", getProduct);

// Khusus admin
router.post("/", auth, requireAdmin, createProductRules, validate, createProduct);
router.put("/:key", auth, requireAdmin, updateProductRules, validate, updateProduct);
router.delete("/:key", auth, requireAdmin, deleteProduct);

export default router;
