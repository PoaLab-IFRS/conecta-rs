import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "../lib/authClient";

export function RequireAdmin() {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="container py-5 text-center text-muted">
        Verificando sessão...
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (session.user.role !== "admin") {
    return <Navigate to="/consumo" replace />;
  }

  return <Outlet />;
}