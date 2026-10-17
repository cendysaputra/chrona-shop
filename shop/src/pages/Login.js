import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage, getFieldErrors } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import Field from "../components/Field";
import Status from "../components/Status";
import s from "./Auth.module.css";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from && location.state.from !== "/login" ? location.state.from : "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) return <Navigate to={from} replace />;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className={`page container ${s.wrap}`}>
      <div className={s.card}>
        <p className="eyebrow">Account</p>
        <h1 className={s.title}>Welcome back.</h1>
        <p className={s.sub}>
          {location.state?.reason === "checkout" ? "Log in to finish your order." : "Log in to check out faster."}
        </p>

        {error && <Status tone="error">{error}</Status>}

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={onChange} error={fieldErrors.email} required />
          <Field id="password" label="Password" type="password" autoComplete="current-password" value={form.password} onChange={onChange} error={fieldErrors.password} required />
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className={s.switch}>
          New to Chrona?{" "}
          <Link to="/register" state={location.state} className="text-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
