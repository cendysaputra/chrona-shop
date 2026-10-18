import type { Product } from '@/types';

import axiosClient from './axiosClient';

type ListParams = {
  tag?: 'new' | 'best-seller';
  series?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'best-selling';
  limit?: number;
};

// Product list
export const getProducts = async (params: ListParams = {}) => {
  const { data } = await axiosClient.get<Product[]>('/api/products', { params });
  return data;
};

// Single product
export const getProduct = async (key: string) => {
  const { data } = await axiosClient.get<Product>(`/api/products/${encodeURIComponent(key)}`);
  return data;
};
