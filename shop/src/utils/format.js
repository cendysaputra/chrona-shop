import { API_URL } from "../config";

export const formatPrice = (value) => `Rp${new Intl.NumberFormat("id-ID").format(value || 0)}`;

export const imageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const tagLabel = (tags = []) => {
  if (tags.includes("new")) return "New";
  if (tags.includes("best-seller")) return "Best seller";
  return null;
};

export const stockLabel = (stock) => {
  if (stock <= 0) return "Sold out";
  if (stock <= 5) return `Only ${stock} left`;
  return "In stock";
};
