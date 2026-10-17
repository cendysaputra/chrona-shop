import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getErrorMessage } from "../api/axiosClient";
import { SERIES, SORT_OPTIONS } from "../config";
import useAsync from "../hooks/useAsync";
import ProductCard from "../components/ProductCard";
import Status from "../components/Status";
import s from "./Products.module.css";

const FILTER_OPTIONS = [
  { value: "", label: "All series" },
  ...SERIES.map((name) => ({ value: name, label: name })),
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const series = params.get("series") || "";
  const sort = SORT_OPTIONS.some((o) => o.value === params.get("sort")) ? params.get("sort") : "newest";

  const { data, loading, error } = useAsync(
    () => getProducts({ sort, ...(series ? { series } : {}) }),
    `${series}|${sort}`
  );

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className={s.shop}>
      <section className={s.hero} aria-labelledby="shop-title">
        <div className={s["hero-copy"]}>
          <p className={s["hero-label"]}>The Chrona collection</p>
          <h1 id="shop-title">Made for every <span>moment.</span></h1>
          <p className={s["hero-description"]}>Find the watch that fits the way you move.</p>
        </div>
        <img className={s["hero-watch"]} src="/assets/hero-img.png" alt="" aria-hidden="true" />
      </section>

      <section className={`container ${s.catalog}`} aria-labelledby="catalog-title">
        <div className={s.head}>
          <h2 id="catalog-title" className={s.title}>{series ? `Chrona ${series}` : "All watches"}<span>.</span></h2>
        </div>

        <div className={s.toolbar}>
          <div className={s.chips} role="group" aria-label="Filter by series">
            <button type="button" className={`pill-sweep ${s.chip} ${!series ? s["chip-active"] : ""}`} aria-pressed={!series} onClick={() => setParam("series", "")}>
              All
            </button>
            {SERIES.map((name) => (
              <button
                key={name}
                type="button"
                className={`pill-sweep ${s.chip} ${series === name ? s["chip-active"] : ""}`}
                aria-pressed={series === name}
                onClick={() => setParam("series", name)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className={s["mobile-filter"]}>
            <ShopDropdown
              label="Filter"
              menuId="series-options"
              value={series}
              options={FILTER_OPTIONS}
              onChange={(value) => setParam("series", value)}
            />
          </div>

          <ShopDropdown
            label="Sort by"
            menuId="sort-options"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(value) => setParam("sort", value === "newest" ? "" : value)}
          />
        </div>

        {loading && !data && <Status>Loading watches…</Status>}
        {error && <Status tone="error">{getErrorMessage(error)}</Status>}

        {data && data.length === 0 && (
          <Status
            action={
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setParam("series", "")}>
                Show all watches
              </button>
            }
          >
            No watches in this series yet.
          </Status>
        )}

        {data && data.length > 0 && (
          <div className={`${s.grid} ${loading ? s.dim : ""}`} aria-busy={loading}>
            {data.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ShopDropdown({ label, menuId, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const optionRefs = useRef([]);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    rootRef.current?.querySelector("button")?.focus();
  };

  const focusOption = (index) => {
    requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  return (
    <div
      ref={rootRef}
      className={s.sort}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          close();
        }
      }}
    >
      <span className={s["sort-label"]}>{label}</span>
      <div className={s["sort-dropdown"]}>
        <button
          type="button"
          className={s["sort-trigger"]}
          aria-label={`${label}: ${options[selectedIndex].label}`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              focusOption(selectedIndex);
            }
          }}
        >
          <span>{options[selectedIndex].label}</span>
        </button>

        {open && (
          <div id={menuId} className={s["sort-menu"]} role="menu" aria-label={`${label} products`}>
            {options.map((option, index) => (
              <button
                key={option.value}
                ref={(element) => { optionRefs.current[index] = element; }}
                type="button"
                role="menuitemradio"
                aria-checked={value === option.value}
                className={`${s["sort-option"]} ${value === option.value ? s["sort-option-active"] : ""}`}
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    const step = event.key === "ArrowDown" ? 1 : -1;
                    optionRefs.current[(index + step + options.length) % options.length]?.focus();
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
