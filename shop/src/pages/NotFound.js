import { Link } from "react-router-dom";
import s from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={`page container ${s.wrap}`}>
      <p className={`mono ${s.code}`}>404</p>
      <h1 className="section-title">This page doesn't exist.</h1>
      <p className="lead">The link may be broken, or the watch is no longer available.</p>
      <div className={s.actions}>
        <Link to="/products" className="btn btn-primary">
          Shop watches
        </Link>
        <Link to="/" className="btn btn-outline">
          Go home
        </Link>
      </div>
    </div>
  );
}
