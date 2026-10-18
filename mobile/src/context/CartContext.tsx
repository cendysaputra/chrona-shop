import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { CartItem, Product } from '@/types';

const CART_KEY = 'chrona_cart';

type CartValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (product: Product, qty?: number) => void;
  updateQty: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartValue | null>(null);

const clamp = (qty: number, stock: number) => Math.max(1, Math.min(qty, stock || 1));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load saved cart
  useEffect(() => {
    AsyncStorage.getItem(CART_KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : [];
        if (Array.isArray(saved)) setItems(saved);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // Persist cart
  useEffect(() => {
    if (ready) AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, ready]);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === product.slug);
      if (found) {
        return prev.map((i) => (i.slug === product.slug ? { ...i, qty: clamp(i.qty + qty, product.stock) } : i));
      }
      return [
        ...prev,
        {
          slug: product.slug,
          productId: product.productId,
          name: product.name,
          series: product.series,
          price: product.price,
          image: product.image,
          stock: product.stock,
          qty: clamp(qty, product.stock),
        },
      ];
    });
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: clamp(qty, i.stock) } : i)));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { items, count, subtotal, ready, addItem, updateQty, removeItem, clearCart };
  }, [items, ready, addItem, updateQty, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
