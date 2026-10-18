import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import ProductImage from "../components/ProductImage";
import QtyInput from "../components/QtyInput";
import s from "./Cart.module.css";

export default function Cart() {
  const { items, subtotal, updateQty, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className={`page container ${s.page} ${s.empty}`}>
        <div className={s["empty-copy"]}>
          <p className={s.eyebrow}>Cart</p>
          <h1 className={s.title}>Your cart is empty<span>.</span></h1>
          <p className={s.message}>Find a watch you like and it will show up here.</p>
        </div>
        <Link to="/shop" className="btn btn-primary">
          Shop watches
        </Link>
      </div>
    );
  }

  return (
    <div className={`page container ${s.page}`}>
      <header className={s.head}>
        <p className={s.eyebrow}>Cart</p>
        <h1 className={s.title}>Your cart<span>.</span></h1>
      </header>

      <div className={s.layout}>
        <ul className={s.list}>
          {items.map((item) => (
            <li key={item.slug} className={s.item}>
              <Link to={`/shop/${item.slug}`} className={s.thumb} tabIndex={-1} aria-hidden="true">
                <ProductImage src={item.image} alt="" />
              </Link>

              <div className={s["item-info"]}>
                <p className={s.eyebrow}>{item.series}</p>
                <h2 className={s["item-name"]}>
                  <Link to={`/shop/${item.slug}`}>{item.name}</Link>
                </h2>
                <p className={s.unit}>{formatPrice(item.price)}</p>
              </div>

              <div className={s["item-controls"]}>
                <QtyInput
                  size="sm"
                  value={item.qty}
                  max={item.stock}
                  label={`Quantity for ${item.name}`}
                  onChange={(v) => updateQty(item.slug, v)}
                />
                <button type="button" className={`text-link ${s.remove}`} onClick={() => removeItem(item.slug)}>
                  Remove
                </button>
              </div>

              <p className={s["line-total"]}>{formatPrice(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>

        <aside className={s.summary} aria-labelledby="summary-title">
          <h2 id="summary-title" className={s["summary-title"]}>
            Order summary
          </h2>
          <dl className={s.rows}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className={s.total}>
              <dt>Total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <button type="button" className={`btn btn-primary btn-block ${s.submit}`} onClick={() => navigate("/checkout")}>
            Checkout
          </button>
          {!user && <p className={s.note}>You'll be asked to log in before checkout.</p>}
          <Link to="/shop" className={`text-link ${s.continue}`}>
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
