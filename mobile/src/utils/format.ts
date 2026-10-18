import { API_URL } from '@/config';
import type { ProductTag } from '@/types';

// 1899000 -> Rp1.899.000
export const formatPrice = (value: number) =>
  `Rp${Math.round(value || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

// Image path -> full URL
export const imageUrl = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const tagLabel = (tags: ProductTag[] = []) => {
  if (tags.includes('new')) return 'New';
  if (tags.includes('best-seller')) return 'Best seller';
  return null;
};

export const stockLabel = (stock: number) => {
  if (stock <= 0) return 'Sold out';
  if (stock <= 5) return `Only ${stock} left`;
  return 'In stock';
};
