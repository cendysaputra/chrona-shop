import { body, param } from "express-validator";
import { USER_ROLES } from "../models/User.js";

export const registerRules = [
  body("name").exists({ values: "falsy" }).withMessage("name wajib diisi").bail()
    .isString().trim().isLength({ min: 2, max: 60 }).withMessage("name 2-60 karakter"),
  body("email").exists({ values: "falsy" }).withMessage("email wajib diisi").bail()
    .isEmail().withMessage("format email tidak valid").normalizeEmail(),
  body("password").exists({ values: "falsy" }).withMessage("password wajib diisi").bail()
    .isString().isLength({ min: 6 }).withMessage("password minimal 6 karakter"),
];

export const loginRules = [
  body("email").exists({ values: "falsy" }).withMessage("email wajib diisi").bail()
    .isEmail().withMessage("format email tidak valid").normalizeEmail(),
  body("password").exists({ values: "falsy" }).withMessage("password wajib diisi"),
];

export const idParamRules = [param("id").isMongoId().withMessage("id user tidak valid")];

export const updateUserRules = [
  ...idParamRules,
  body("name").optional().isString().trim().isLength({ min: 2, max: 60 }).withMessage("name 2-60 karakter"),
  body("email").optional().isEmail().withMessage("format email tidak valid").normalizeEmail(),
  body("password").optional().isString().isLength({ min: 6 }).withMessage("password minimal 6 karakter"),
  body("role").optional().isIn(USER_ROLES).withMessage(`role harus: ${USER_ROLES.join(", ")}`),
];
