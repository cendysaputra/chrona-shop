import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CART_KEY = "chrona_cart";
const CartContext = createContext(null);

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const clamp = (qty, stock) => Math.max(1, Math.min(qty, stock || 1));

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
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

  const updateQty = useCallback((slug, qty) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: clamp(qty, i.stock) } : i)));
  }, []);

  const removeItem = useCallback((slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { items, count, subtotal, addItem, updateQty, removeItem, clearCart };
  }, [items, addItem, updateQty, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
