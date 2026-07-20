import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { jwt } = useSelector((state) => state.auth);

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;