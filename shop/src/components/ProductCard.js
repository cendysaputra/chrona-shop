import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice, tagLabel } from "../utils/format";
import ProductImage from "./ProductImage";
import s from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const badge = tagLabel(product.tags);
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
      <Link to={`/products/${product.slug}`} className={s.media} aria-label={product.name}>
        {badge && <span className={`badge ${s.badge}`}>{badge}</span>}
        <ProductImage src={product.image} alt="" />
      </Link>

      <div className={s.body}>
        <p className="eyebrow">{product.series}</p>
        <h3 className={s.name}>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className={s.tagline}>{product.tagline}</p>

        <div className={s.footer}>
          <span className={`mono ${s.price}`}>{formatPrice(product.price)}</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd} disabled={soldOut}>
            {soldOut ? "Sold out" : added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
