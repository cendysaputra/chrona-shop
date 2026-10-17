import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { CartIcon } from "./Icons";
import ProductImage from "./ProductImage";
import s from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
  };

  return (
    <article className={s.card}>
      <Link to={`/shop/${product.slug}`} className={s.media} aria-label={product.name}>
        <ProductImage src={product.image} alt="" />
      </Link>

      <div className={s.body}>
        <h3 className={s.name}>
          <Link to={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={s.tagline}>{product.tagline}</p>

        <div className={s.footer}>
          <span className={s.price}>{formatPrice(product.price)}</span>
          <button
            type="button"
            className={s.cart}
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={soldOut ? `${product.name} sold out` : added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {added ? <span aria-hidden="true">✓</span> : <CartIcon />}
          </button>
        </div>
      </div>
    </article>
  );
}
