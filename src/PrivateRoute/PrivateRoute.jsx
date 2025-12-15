import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // When context is loading after reload
  if (loading) {
    return <p>Loading...</p>; 
  }

  // If no token or role mismatch
  if (!token || (role && user?.role !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export { PrivateRoute };
