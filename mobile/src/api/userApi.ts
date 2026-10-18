import type { AuthResponse, User } from '@/types';

import axiosClient from './axiosClient';

export const loginRequest = async (payload: { email: string; password: string }) => {
  const { data } = await axiosClient.post<AuthResponse>('/api/users/login', payload);
  return data;
};

export const registerRequest = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await axiosClient.post<AuthResponse>('/api/users/register', payload);
  return data;
};

export const getMe = async () => {
  const { data } = await axiosClient.get<User>('/api/users/me');
  return data;
};
