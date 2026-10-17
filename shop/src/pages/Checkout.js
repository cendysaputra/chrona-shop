import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import Field from "../components/Field";
import ProductImage from "../components/ProductImage";
import { CheckIcon } from "../components/Icons";
import s from "./Checkout.module.css";

const PAYMENTS = [
  { value: "bank", label: "Bank transfer", note: "BCA, Mandiri, BNI, BRI" },
  { value: "ewallet", label: "E-wallet", note: "GoPay, OVO, DANA, ShopeePay" },
  { value: "cod", label: "Cash on delivery", note: "Pay when your watch arrives" },
];

const validate = (form) => {
  const errors = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Enter the recipient's full name.";
  if (!/^(\+62|62|0)8\d{7,12}$/.test(form.phone.replace(/[\s-]/g, ""))) errors.phone = "Enter a valid Indonesian mobile number, e.g. 0812 3456 7890.";
  if (form.address.trim().length < 10) errors.address = "Enter the full street address.";
  if (!form.city.trim()) errors.city = "Enter the city.";
  if (!/^\d{5}$/.test(form.postalCode.trim())) errors.postalCode = "Postal code has 5 digits.";
  return errors;
};

const makeOrderNo = () => `CHR-${Date.now().toString().slice(-8)}`;

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    payment: "bank",
  });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setOrder({ number: makeOrderNo(), total: subtotal, name: form.fullName.trim(), city: form.city.trim() });
    clearCart();
    window.scrollTo(0, 0);
  };

  if (order) {
    return (
      <div className={`page container ${s.done}`}>
        <span className={s["done-icon"]} aria-hidden="true">
          <CheckIcon width={28} height={28} />
        </span>
        <p className="eyebrow">Order {order.number}</p>
        <h1 className="section-title">Almost yours.</h1>
        <p className="lead">
          Thank you, {order.name.split(" ")[0]}. Your order of <span className="mono">{formatPrice(order.total)}</span> has been placed and
          will be shipped to {order.city}.
        </p>
        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`page container ${s.done}`}>
        <p className="eyebrow">Checkout</p>
        <h1 className="section-title">Nothing to check out.</h1>
        <p className="lead">Your cart is empty. Add a watch first.</p>
        <Link to="/products" className="btn btn-primary">
          Shop watches
        </Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <header className={s.head}>
        <p className="eyebrow">Checkout</p>
        <h1 className="section-title">Almost yours.</h1>
      </header>

      <form className={s.layout} onSubmit={onSubmit} noValidate>
        <div className={s.form}>
          <fieldset className={s.group}>
            <legend className={s.legend}>Shipping details</legend>
            <div className={s.row}>
              <Field id="fullName" label="Full name" value={form.fullName} onChange={onChange} error={errors.fullName} autoComplete="name" />
              <Field id="phone" label="Phone number" type="tel" value={form.phone} onChange={onChange} error={errors.phone} autoComplete="tel" placeholder="0812 3456 7890" />
            </div>
            <Field id="address" as="textarea" label="Street address" value={form.address} onChange={onChange} error={errors.address} autoComplete="street-address" />
            <div className={s.row}>
              <Field id="city" label="City" value={form.city} onChange={onChange} error={errors.city} autoComplete="address-level2" />
              <Field id="postalCode" label="Postal code" inputMode="numeric" maxLength={5} value={form.postalCode} onChange={onChange} error={errors.postalCode} autoComplete="postal-code" />
            </div>
          </fieldset>

          <fieldset className={s.group}>
            <legend className={s.legend}>Payment method</legend>
            <div className={s.payments}>
              {PAYMENTS.map((p) => (
                <label key={p.value} className={`${s.payment} ${form.payment === p.value ? s["payment-active"] : ""}`}>
                  <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={onChange} />
                  <span>
                    <strong>{p.label}</strong>
                    <small>{p.note}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className={s.summary} aria-labelledby="checkout-summary">
          <h2 id="checkout-summary" className={s["summary-title"]}>
            Your order
          </h2>
          <ul className={s.items}>
            {items.map((item) => (
              <li key={item.slug}>
                <span className={s.thumb}>
                  <ProductImage src={item.image} alt="" />
                  <span className={s["qty-badge"]}>{item.qty}</span>
                </span>
                <span className={s["item-name"]}>{item.name}</span>
                <span className="mono">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className={s.rows}>
            <div>
              <dt>Subtotal</dt>
              <dd className="mono">{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className={s.total}>
              <dt>Total</dt>
              <dd className="mono">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn btn-primary btn-block">
            Place order
          </button>
          <Link to="/cart" className={`text-link ${s.back}`}>
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
