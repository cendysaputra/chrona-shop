import s from "./AuthLayout.module.css";

export default function AuthLayout({ children }) {
  return (
    <div className={s.layout}>
      <div className={s.showcase} aria-hidden="true">
        <div className={s.clock}>
          <img src="/assets/pattern.svg" alt="" />
        </div>
        <img className={s.watch} src="/assets/hero-img.png" alt="" />
      </div>

      <div className={s.content}>{children}</div>
    </div>
  );
}
