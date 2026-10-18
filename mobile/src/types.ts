export type ProductTag = 'new' | 'best-seller';

export type ProductSpecs = {
  caseSize?: string;
  caseMaterial?: string;
  strap?: string;
  display?: string;
  battery?: string;
  gps?: string;
  waterResistance?: string;
  connectivity?: string;
  compatibility?: string;
};

export type Product = {
  _id: string;
  productId: number;
  name: string;
  slug: string;
  series: string;
  tagline: string;
  description: string;
  price: number;
  stock: number;
  sold: number;
  tags: ProductTag[];
  releaseDate: string;
  image: string;
  specs: ProductSpecs;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type CartItem = {
  slug: string;
  productId: number;
  name: string;
  series: string;
  price: number;
  image: string;
  stock: number;
  qty: number;
};
