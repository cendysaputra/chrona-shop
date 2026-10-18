import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getProducts } from "../api/productApi";
import { getErrorMessage } from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import useAsync from "../hooks/useAsync";
import { formatPrice, stockLabel, tagLabel } from "../utils/format";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import QtyInput from "../components/QtyInput";
import Status from "../components/Status";
import { CheckIcon, ReturnIcon, ShieldIcon, TruckIcon } from "../components/Icons";
import NotFound from "./NotFound";
import s from "./ProductDetail.module.css";

const SPEC_LABELS = {
  caseSize: "Case size",
  caseMaterial: "Case material",
  strap: "Strap",
  display: "Display",
  battery: "Battery",
  gps: "GPS",
  waterResistance: "Water resistance",
  connectivity: "Connectivity",
  compatibility: "Compatibility",
};

const HIGHLIGHT_KEYS = ["battery", "waterResistance", "gps"];

const PERKS = [
  { title: "Free shipping", text: "Delivered across Indonesia", Icon: TruckIcon },
  { title: "1-year warranty", text: "Official Chrona coverage", Icon: ShieldIcon },
  { title: "30-day returns", text: "Easy returns, no hassle", Icon: ReturnIcon },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsync(() => getProduct(slug), slug);

  if (error?.response?.status === 404) return <NotFound />;

  return (
    <div className={`page container ${s.page}`}>
      {loading && <Status>Loading watch…</Status>}
      {error && <Status tone="error">{getErrorMessage(error)}</Status>}
      {product && !loading && <Detail key={product.slug} product={product} />}
    </div>
  );
}

function Detail({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const badge = tagLabel(product.tags);
  const specs = Object.entries(SPEC_LABELS).filter(([key]) => product.specs?.[key]);
  const highlights = HIGHLIGHT_KEYS.filter((key) => product.specs?.[key]);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
  };

  return (
    <>
      <nav className={s.crumbs} aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?series=${encodeURIComponent(product.series)}`}>{product.series}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className={s.layout}>
        <div className={s.media}>
          {badge && <span className={`badge ${s.badge}`}>{badge}</span>}
          <ProductImage src={product.image} alt={product.name} eager />
        </div>

        <div className={s.info}>
          <p className={s.series}>Chrona {product.series}</p>
          <h1 className={s.name}>{product.name}</h1>
          <p className={s.tagline}>{product.tagline}</p>

          <p className={s.price}>{formatPrice(product.price)}</p>
          <p className={`${s.stock} ${soldOut ? s.out : product.stock <= 5 ? s.low : ""}`}>{stockLabel(product.stock)}</p>

          <div className={s.buy}>
            {!soldOut && <QtyInput value={qty} max={product.stock} onChange={(v) => { setQty(v); setAdded(false); }} />}
            <button type="button" className={`btn btn-primary ${s["add-btn"]}`} onClick={handleAdd} disabled={soldOut}>
              {soldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>

          {added && (
            <p className={s.added} role="status">
              <CheckIcon /> Added to your cart.
              <Link to="/cart" className="text-link">
                View cart
              </Link>
            </p>
          )}

        </div>
      </div>

      <section className={s.overview} aria-labelledby="overview-title">
        <div className={s.about}>
          <h2 id="overview-title" className={s.label}>Overview</h2>
          <p className={s.description}>{product.description}</p>
        </div>

        {highlights.length > 0 && (
          <dl className={s.highlights}>
            {highlights.map((key) => (
              <div key={key}>
                <dt>{SPEC_LABELS[key]}</dt>
                <dd>{product.specs[key]}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className={s.perks}>
          {PERKS.map(({ title, text, Icon }) => (
            <li key={title}>
              <span className={s["perk-icon"]}><Icon /></span>
              <span>
                <strong>{title}</strong>
                {text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {specs.length > 0 && (
        <section className={s.specs} aria-labelledby="specs-title">
          <h2 id="specs-title" className={s["section-title"]}>
            Tech specs<span>.</span>
          </h2>
          <dl className={s["spec-list"]}>
            {specs.map(([key, label]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{product.specs[key]}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <Related product={product} />
    </>
  );
}

function Related({ product }) {
  const { data } = useAsync(
    () => getProducts({ sort: "best-selling" }).then((list) => list.filter((p) => p.slug !== product.slug).slice(0, 4)),
    product.slug
  );

  if (!data || data.length === 0) return null;

  return (
    <section className={s.related} aria-labelledby="related-title">
      <h2 id="related-title" className={s["section-title"]}>Other watches<span>.</span></h2>
      <div className={s["related-grid"]}>
        {data.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
