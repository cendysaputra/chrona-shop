import axios from "axios";
import { API_URL } from "../config";

export const TOKEN_KEY = "token";

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (err?.request && !err?.response) return "Can't reach the server. Check your connection and try again.";
  return fallback;
};

export const getFieldErrors = (err) =>
  (err?.response?.data?.errors || []).reduce((acc, e) => {
    if (!acc[e.field]) acc[e.field] = e.message;
    return acc;
  }, {});

export default axiosClient;
