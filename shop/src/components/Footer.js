import { Link } from "react-router-dom";
import Logo from "./Logo";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div className={s.top}>
          <div>
            <Logo size="xl" className={s.logo} />
            <p className={s.tagline}>Smartwatch for Every Moment.</p>
          </div>

          <nav className={s.links} aria-label="Footer">
            <Link to="/" className="text-link">Home</Link>
            <Link to="/products" className="text-link">Shop</Link>
            <Link to="/cart" className="text-link">Cart</Link>
          </nav>
        </div>

        <div className={s.bottom}>
          <p>© {new Date().getFullYear()} Chrona. All rights reserved.</p>
          <p>Free shipping across Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
