import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ArrowRightIcon } from "../components/Icons";
import s from "./Account.module.css";

const formatMonth = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function Account() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const firstName = user?.name?.trim().split(" ")[0];
  const details = [
    ["Name", user?.name],
    ["Email", user?.email],
    ["Member since", user?.createdAt && formatMonth(user.createdAt)],
  ].filter(([, value]) => value);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className={`page container ${s.page}`}>
      <header className={s.head}>
        <p className={s.eyebrow}>Account</p>
        <h1 className={s.title}>
          {firstName ? `Hi, ${firstName}` : "Hi there"}
          <span>.</span>
        </h1>
      </header>

      <div className={s.layout}>
        <section className={s.details} aria-labelledby="account-details">
          <h2 id="account-details" className={s.label}>
            Account details
          </h2>
          <dl className={s.rows}>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className={s.panel} aria-label="Shortcuts">
          <ul className={s.links}>
            <li>
              <Link to="/shop" className={s.link}>
                <span>Continue shopping</span>
                <ArrowRightIcon />
              </Link>
            </li>
            <li>
              <Link to="/cart" className={s.link}>
                <span>
                  View cart
                  <small>
                    {count} {count === 1 ? "item" : "items"}
                  </small>
                </span>
                <ArrowRightIcon />
              </Link>
            </li>
          </ul>
          <button type="button" className={`btn btn-light btn-block ${s.logout}`} onClick={handleLogout}>
            Log out
          </button>
        </aside>
      </div>
    </div>
  );
}
