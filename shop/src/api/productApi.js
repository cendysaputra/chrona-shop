import axiosClient from "./axiosClient";

export const getProducts = async (params = {}) => {
  const { data } = await axiosClient.get("/api/products", { params });
  return data;
};

export const getProduct = async (key) => {
  const { data } = await axiosClient.get(`/api/products/${encodeURIComponent(key)}`);
  return data;
};
