
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const autenticado = sessionStorage.getItem("adminAutenticado") === "true";

  if (!autenticado) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
