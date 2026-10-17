import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CartIcon, CloseIcon, MenuIcon } from "./Icons";
import Logo from "./Logo";
import s from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const firstName = user?.name?.split(" ")[0];
  const navClass = ({ isActive }) => `${s["nav-link"]} ${isActive ? s.active : ""}`;

  return (
    <header className={`${s.header} ${pathname === "/home" || pathname === "/shop" ? s["home-header"] : ""}`}>
      <div className={`container ${s.inner}`}>
        <nav id="main-nav" className={`${s.nav} ${open ? s.open : ""}`} aria-label="Main">
          <NavLink to="/home" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navClass}>
            Shop
          </NavLink>
          {user && (
            <button type="button" className={`${s["nav-link"]} ${s["mobile-only"]}`} onClick={logout}>
              Log out
            </button>
          )}
        </nav>

        <Logo className={s.logo} />

        <div className={s.actions}>
          <Link to="/cart" className={s.cart} aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <CartIcon />
            {count > 0 && <span className={s.count}>{count > 99 ? "99+" : count}</span>}
          </Link>

          {user ? (
            <div className={s.user}>
              <span className={s.hello}>Hi, {firstName}</span>
              <button type="button" className={`btn btn-outline btn-sm ${s["desktop-only"]}`} onClick={logout}>
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" state={{ from: pathname }} className="btn btn-primary btn-sm">
              Log in
            </Link>
          )}
        </div>

        <button
          type="button"
          className={s["menu-btn"]}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
