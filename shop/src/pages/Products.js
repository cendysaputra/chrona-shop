import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getErrorMessage } from "../api/axiosClient";
import { SERIES, SORT_OPTIONS } from "../config";
import useAsync from "../hooks/useAsync";
import ProductCard from "../components/ProductCard";
import Status from "../components/Status";
import s from "./Products.module.css";

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
    <div className="page container">
      <header className={s.head}>
        <p className="eyebrow">Shop</p>
        <h1 className={`section-title ${s.title}`}>{series ? `Chrona ${series}` : "All watches"}</h1>
        <p className="muted">{data ? `${data.length} ${data.length === 1 ? "watch" : "watches"}` : " "}</p>
      </header>

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

        <label className={s.sort}>
          <span className="muted">Sort by</span>
          <select className="select" value={sort} onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
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
    </div>
  );
}
