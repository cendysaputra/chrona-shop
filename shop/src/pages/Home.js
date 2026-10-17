import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLenis } from "lenis/react";
import { getProduct, getProducts } from "../api/productApi";
import { getErrorMessage } from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import useAsync from "../hooks/useAsync";
import { formatPrice } from "../utils/format";
import { CartIcon } from "../components/Icons";
import ProductImage from "../components/ProductImage";
import Status from "../components/Status";
import s from "./Home.module.css";

export default function Home() {
  return (
    <div className={s.home}>
      <Hero />
      <Featured />
      <Collection />
    </div>
  );
}

function Hero() {
  const heroRef = useRef(null);
  const updateParallax = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const bounds = hero.getBoundingClientRect();
    const distance = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : Math.min(Math.max(-bounds.top, 0), bounds.height);

    hero.style.setProperty("--hero-scroll", `${distance.toFixed(2)}px`);
  }, []);

  useLenis(updateParallax);

  useEffect(() => {
    const hero = heroRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    updateParallax();
    window.addEventListener("resize", updateParallax);
    reducedMotion.addEventListener("change", updateParallax);

    return () => {
      window.removeEventListener("resize", updateParallax);
      reducedMotion.removeEventListener("change", updateParallax);
      hero?.style.removeProperty("--hero-scroll");
    };
  }, [updateParallax]);

  return (
    <section ref={heroRef} className={s.hero} aria-labelledby="hero-title">
      <div className={s["clock-face"]} aria-hidden="true">
        <div className={s["clock-rotor"]}>
          <img src="/assets/pattern.svg" alt="" />
        </div>
      </div>
      <div className={s["hero-copy"]}>
        <p>Smartwatch for every moment</p>
        <h1 id="hero-title">
          Everything You Need,
          <span>One Glance Away</span>
        </h1>
      </div>
      <img className={s["hero-watch"]} src="/assets/hero-img.png" alt="Silver Chrona smartwatch showing the time, heart rate, and activity" />
    </section>
  );
}

function Featured() {
  const { data, loading, error } = useAsync(
    () => Promise.all([
      getProduct("chrona-pulse-45-silver"),
      getProduct("chrona-pulse-45-graphite"),
    ]),
    "home-featured"
  );

  return (
    <section className={`container ${s.featured}`} aria-labelledby="featured-title">
      <h2 id="featured-title" className={s["section-title"]}>New this season<span>.</span></h2>
      {loading && <Status>Loading featured watches…</Status>}
      {error && <Status tone="error">{getErrorMessage(error)}</Status>}
      {data && (
        <div className={s["featured-grid"]}>
          <FeatureTile product={data[0]} label="Featured" />
          <FeatureTile product={data[1]} label="Best seller" dark />
        </div>
      )}
    </section>
  );
}

function FeatureTile({ product, label, dark = false }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
  };

  return (
    <article className={`${s.tile} ${dark ? s["tile-dark"] : ""}`}>
      <div className={s["tile-copy"]}>
        <p className={s["tile-label"]}>{label}</p>
        <h3>Chrona {product.series}</h3>
        <p className={s["tile-price"]}>{formatPrice(product.price)}</p>
        <div className={s["tile-actions"]}>
          <Link to={`/products/${product.slug}`} className="text-link">Learn more</Link>
          <button type="button" onClick={handleAdd} disabled={product.stock <= 0}>
            {product.stock <= 0 ? "Sold out" : added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
      <Link to={`/products/${product.slug}`} className={s["tile-image"]} tabIndex={-1} aria-hidden="true">
        <ProductImage src={product.image} alt="" />
      </Link>
    </article>
  );
}

function Collection() {
  const { data, loading, error } = useAsync(() => getProducts({ sort: "best-selling", limit: 8 }), "home-collection");

  return (
    <section className={`container ${s.collection}`} aria-labelledby="collection-title">
      <div className={s["collection-head"]}>
        <h2 id="collection-title" className={s["section-title"]}>Shop the collection</h2>
        <Link to="/products" className={s["shop-link"]}>Shop now</Link>
      </div>
      {loading && <Status>Loading watches…</Status>}
      {error && <Status tone="error">{getErrorMessage(error)}</Status>}
      {data && (
        <div className={s["product-grid"]}>
          {data.map((product) => <HomeProductCard key={product.slug} product={product} />)}
        </div>
      )}
    </section>
  );
}

function HomeProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
  };

  return (
    <article className={s["product-card"]}>
      <Link to={`/products/${product.slug}`} className={s["product-image"]} aria-label={product.name}>
        <ProductImage src={product.image} alt="" />
      </Link>
      <h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>
      <p className={s["product-tagline"]}>{product.tagline}</p>
      <div className={s["product-bottom"]}>
        <span>{formatPrice(product.price)}</span>
        <button type="button" onClick={handleAdd} disabled={product.stock <= 0} aria-label={product.stock <= 0 ? `${product.name} sold out` : added ? `${product.name} added to cart` : `Add ${product.name} to cart`}>
          {added ? <span aria-hidden="true">✓</span> : <CartIcon />}
        </button>
      </div>
    </article>
  );
}
