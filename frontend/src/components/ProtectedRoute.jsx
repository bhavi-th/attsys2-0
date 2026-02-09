import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  // 1. Not logged in?
  if (!user) return <Navigate to="/" replace />;

  // 2. Logged in but profile incomplete?
  if (!user.isOnboarded) {
    // Add a check: If we are already headed to onboarding, don't redirect again!
    if (location.pathname.startsWith("/onboard")) {
      return children;
    }
    return <Navigate to={`/onboard/${user.role}`} replace />;
  }

  // 3. Trying to access teacher page as student (or vice versa)?
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/dash" replace />;
  }

  return children;
};

export default ProtectedRoute;
