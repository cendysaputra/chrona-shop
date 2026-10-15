import jwt from "jsonwebtoken";
import { config } from "../config.js";

// Wajib login
export const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Khusus admin
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

// Pemilik atau admin
export const requireSelfOrAdmin = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.sub === req.params.id) return next();
  return res.status(403).json({ message: "Forbidden" });
};
