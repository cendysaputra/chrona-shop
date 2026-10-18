import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles/tokens.css";
import "./styles/global.css";
import "lenis/dist/lenis.css";

function SmoothScroll({ children }) {
  const [reducedMotion, setReducedMotion] = React.useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  React.useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);

    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: !reducedMotion, anchors: !reducedMotion }}>
      {children}
    </ReactLenis>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SmoothScroll>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </SmoothScroll>
  </React.StrictMode>
);
