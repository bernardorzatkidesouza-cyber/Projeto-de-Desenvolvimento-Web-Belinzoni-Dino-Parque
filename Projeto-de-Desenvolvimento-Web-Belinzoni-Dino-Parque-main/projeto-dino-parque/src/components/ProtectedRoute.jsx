import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const autenticado = Boolean(localStorage.getItem("token")) &&
    localStorage.getItem("adminAutenticado") === "true";

  if (!autenticado) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
