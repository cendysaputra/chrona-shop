import { useState } from "react";
import { imageUrl } from "../utils/format";
import s from "./ProductImage.module.css";

export default function ProductImage({ src, alt, className = "", fallback, eager = false }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      fallback || (
        <div className={`${s.placeholder} ${className}`} role="img" aria-label={alt}>
          <span className={s.mark} aria-hidden="true" />
        </div>
      )
    );
  }

  return (
    <img
      src={imageUrl(src)}
      alt={alt}
      className={`${s.img} ${className}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
