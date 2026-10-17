import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Status from "./Status";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="page container">
        <Status>Checking your session…</Status>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname, reason: "checkout" }} />;
  }

  return children;
}
