import { MinusIcon, PlusIcon } from "./Icons";
import s from "./QtyInput.module.css";

export default function QtyInput({ value, max, onChange, label = "Quantity", size = "md" }) {
  return (
    <div className={`${s.qty} ${s[size]}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <MinusIcon />
      </button>
      <output className="mono" aria-live="polite">
        {value}
      </output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <PlusIcon />
      </button>
    </div>
  );
}
