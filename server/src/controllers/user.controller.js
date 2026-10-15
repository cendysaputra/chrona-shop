import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config.js";

// Buat token
const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpires }
  );

// Registrasi
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "Registrasi berhasil", token: signToken(user), user });
  } catch (err) { next(err); }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Email atau password salah" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Email atau password salah" });

    res.json({ message: "Login berhasil", token: signToken(user), user });
  } catch (err) { next(err); }
};

// User aktif
export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
};

// Daftar user
export const listUsers = async (req, res, next) => {
  try {
    res.json(await User.find().sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

// Detail user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
};

// Ubah user
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (password !== undefined) data.password = await bcrypt.hash(password, 10);

    // Khusus admin
    if (role !== undefined) {
      if (req.user.role !== "admin") return res.status(403).json({ message: "Only admin can change role" });
      data.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) { next(err); }
};

// Hapus user
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.sub === req.params.id) {
      return res.status(400).json({ message: "Admin tidak bisa menghapus akunnya sendiri" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) { next(err); }
};
