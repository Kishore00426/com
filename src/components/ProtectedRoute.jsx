// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector(state => state.auth);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
