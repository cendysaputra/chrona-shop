import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const hero = heroRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getDistance = () => {
      const bounds = hero.getBoundingClientRect();
      return reducedMotion.matches ? 0 : Math.min(Math.max(-bounds.top, 0), bounds.height);
    };
    let current = getDistance();
    let target = current;
    let frame = null;
    let lastTime = 0;
    let needsMeasure = false;

    hero.style.setProperty("--hero-scroll", `${current}px`);

    const animate = (time) => {
      frame = null;
      if (needsMeasure) {
        target = getDistance();
        needsMeasure = false;
      }

      if (reducedMotion.matches) {
        current = target;
      } else {
        const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
        const easing = 1 - Math.exp(-elapsed / 90);
        current += (target - current) * easing;
        if (Math.abs(target - current) < 0.25) current = target;
      }

      hero.style.setProperty("--hero-scroll", `${current.toFixed(2)}px`);
      lastTime = time;
      if (current !== target) frame = window.requestAnimationFrame(animate);
      else lastTime = 0;
    };

    const scheduleUpdate = () => {
      needsMeasure = true;
      if (frame === null) frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      hero.style.removeProperty("--hero-scroll");
    };
  }, []);

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
          <Link to={`/products/${product.slug}`}>Learn more</Link>
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
