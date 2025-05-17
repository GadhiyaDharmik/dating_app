// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated =
    localStorage.getItem("authToken") && localStorage.getItem("user_Data");

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
