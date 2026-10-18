import { Link } from "react-router-dom";
import s from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={s.page}>
      <section className={s.hero} aria-labelledby="not-found-title">
        <div className={s.clock} aria-hidden="true">
          <img src="/assets/pattern.svg" alt="" />
        </div>
        <div className={s.copy}>
          <p className={s.label}>Error 404</p>
          <p className={s.code} aria-hidden="true">404</p>
          <h1 id="not-found-title" className={s.title}>This page doesn't exist<span>.</span></h1>
          <p className={s.message}>The link may be broken, or the watch is no longer available.</p>
          <Link to="/shop" className={`btn btn-primary ${s.action}`}>
            Shop watches
          </Link>
        </div>
      </section>
    </div>
  );
}
