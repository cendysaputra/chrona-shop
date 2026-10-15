import { Router } from "express";
import {
  register, login, me, listUsers, getUser, updateUser, deleteUser,
} from "../controllers/user.controller.js";
import { auth, requireAdmin, requireSelfOrAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerRules, loginRules, idParamRules, updateUserRules,
} from "../validators/user.validator.js";

const router = Router();

// Autentikasi
router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", auth, me);

// Kelola user
router.get("/", auth, requireAdmin, listUsers);
router.get("/:id", auth, idParamRules, validate, requireSelfOrAdmin, getUser);
router.put("/:id", auth, updateUserRules, validate, requireSelfOrAdmin, updateUser);
router.delete("/:id", auth, requireAdmin, idParamRules, validate, deleteUser);

export default router;
