import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, type AxiosError } from 'axios';

import { API_URL } from '@/config';

export const TOKEN_KEY = 'token';

const axiosClient = create({
  baseURL: API_URL,
  timeout: 15000,
});

// Attach token
axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type ApiError = AxiosError<{ message?: string; errors?: { field: string; message: string }[] }>;

// Readable error
export const getErrorMessage = (err: unknown, fallback = 'Something went wrong. Please try again.') => {
  const e = err as ApiError;
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.';
  if (e?.request && !e?.response) return `Can't reach the server at ${API_URL}. Check your connection and the API address.`;
  return fallback;
};

// Field errors -> { field: message }
export const getFieldErrors = (err: unknown) => {
  const list = (err as ApiError)?.response?.data?.errors || [];
  return list.reduce<Record<string, string>>((acc, e) => {
    if (!acc[e.field]) acc[e.field] = e.message;
    return acc;
  }, {});
};

export const getStatus = (err: unknown) => (err as ApiError)?.response?.status;

export default axiosClient;
