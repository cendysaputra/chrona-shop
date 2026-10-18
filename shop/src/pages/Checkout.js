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
  {
    value: "bank",
    label: "Bank transfer",
    logos: [
      { name: "BCA", src: "/assets/bca.svg" },
      { name: "Mandiri", src: "/assets/mandiri.svg" },
      { name: "BNI", src: "/assets/bni.svg" },
      { name: "BRI", src: "/assets/bri.svg" },
    ],
  },
  {
    value: "ewallet",
    label: "E-wallet",
    logos: [
      { name: "GoPay", src: "/assets/gopay.svg" },
      { name: "OVO", src: "/assets/ovo.svg" },
      { name: "DANA", src: "/assets/dana.svg" },
      { name: "ShopeePay", src: "/assets/shopeepay.svg" },
    ],
  },
  { value: "cod", label: "Cash on delivery", note: "Pay when your watch arrives" },
];

const validate = (form) => {
  const errors = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Enter the recipient's full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
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
    email: user?.email || "",
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
      <div className={`page container ${s.page} ${s.done}`}>
        <span className={s["done-icon"]} aria-hidden="true">
          <CheckIcon width={28} height={28} />
        </span>
        <div className={s["done-copy"]}>
          <p className={s.eyebrow}>Order {order.number}</p>
          <h1 className={s.title}>Almost yours<span>.</span></h1>
          <p className={s.message}>
            Thank you, {order.name.split(" ")[0]}. Your order of <strong>{formatPrice(order.total)}</strong> has been placed and
            will be shipped to {order.city}.
          </p>
        </div>
        <Link to="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`page container ${s.page} ${s.done}`}>
        <div className={s["done-copy"]}>
          <p className={s.eyebrow}>Checkout</p>
          <h1 className={s.title}>Nothing to check out<span>.</span></h1>
          <p className={s.message}>Your cart is empty. Add a watch first.</p>
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
        <p className={s.eyebrow}>Checkout</p>
        <h1 className={s.title}>Almost yours<span>.</span></h1>
      </header>

      <form className={s.layout} onSubmit={onSubmit} noValidate>
        <div className={s.form}>
          <fieldset className={s.group}>
            <legend className={s.legend}>Shipping details</legend>
            <Field id="fullName" label="Full name" value={form.fullName} onChange={onChange} error={errors.fullName} autoComplete="name" />
            <div className={s.row}>
              <Field id="email" label="Email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" placeholder="you@example.com" />
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
                  <span className={s["payment-text"]}>
                    <strong>{p.label}</strong>
                    {p.note && <small>{p.note}</small>}
                  </span>
                  {p.logos && (
                    <span className={s.logos}>
                      {p.logos.map((logo) => (
                        <span key={logo.name} className={s.logo} title={logo.name}>
                          {logo.src ? <img src={logo.src} alt={logo.name} /> : <span className="visually-hidden">{logo.name}</span>}
                        </span>
                      ))}
                    </span>
                  )}
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
                <span className={s["item-price"]}>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
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
          <button type="submit" className={`btn btn-primary btn-block ${s.submit}`}>
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
