import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) return <Navigate to="/" replace />;

  if (allowedRole && userRole !== allowedRole) {
    alert("Unauthorized access!");
    return <Navigate to="/dash" replace />;
  }

  return children;
};

export default ProtectedRoute;
