import { Link } from "react-router-dom";
import s from "./Logo.module.css";

export default function Logo({ className = "", size = "md" }) {
  return (
    <Link to="/home" className={`${s.logo} ${s[size]} ${className}`} aria-label="Chrona home">
      <span>CHRONA</span>
      <span className={s.dot}>.</span>
    </Link>
  );
}
