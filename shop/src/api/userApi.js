import axiosClient from "./axiosClient";

export const loginRequest = async (payload) => {
  const { data } = await axiosClient.post("/api/users/login", payload);
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await axiosClient.post("/api/users/register", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await axiosClient.get("/api/users/me");
  return data;
};
