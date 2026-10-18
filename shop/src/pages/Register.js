import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage, getFieldErrors } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import Status from "../components/Status";
import s from "./Auth.module.css";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from && !["/login", "/register"].includes(location.state.from) ? location.state.from : "/";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) return <Navigate to={from} replace />;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password.length < 6) {
      setFieldErrors({ password: "Use at least 6 characters." });
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const fields = getFieldErrors(err);
      setFieldErrors(fields);
      if (!Object.keys(fields).length) setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className={s.card}>
        <p className={s.eyebrow}>Account</p>
        <h1 className={s.title}>Create your account<span>.</span></h1>
        <p className={s.sub}>One account for the Chrona web store and app.</p>

        {error && <Status tone="error">{error}</Status>}

        <form className={s.form} onSubmit={onSubmit} noValidate>
          <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={onChange} error={fieldErrors.name} required />
          <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={onChange} error={fieldErrors.email} required />
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            hint="At least 6 characters."
            value={form.password}
            onChange={onChange}
            error={fieldErrors.password}
            required
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className={s.switch}>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="text-link">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
