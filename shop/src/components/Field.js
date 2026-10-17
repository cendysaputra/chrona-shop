import s from "./Field.module.css";

export default function Field({ id, label, error, hint, as = "input", children, ...props }) {
  const Tag = as;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        className={as === "select" ? "select" : "input"}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Tag>
      {hint && !error && (
        <p id={`${id}-hint`} className={s.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  );
}
