import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

// Halaman lazy
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
  }, [pathname, hash, lenis]);
  return null;
}

function LegacyShopRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${pathname.replace(/^\/products(?=\/|$)/, "/shop")}${search}${hash}`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Suspense fallback={<p className="visually-hidden" role="status">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Products />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/products" element={<LegacyShopRedirect />} />
            <Route path="/products/:slug" element={<LegacyShopRedirect />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
