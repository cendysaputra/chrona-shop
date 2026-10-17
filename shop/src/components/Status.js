import s from "./Status.module.css";

export default function Status({ tone = "info", children, action }) {
  return (
    <div className={`${s.status} ${s[tone]}`} role={tone === "error" ? "alert" : "status"}>
      <p>{children}</p>
      {action}
    </div>
  );
}
