import { Link, Outlet, useNavigate } from "react-router-dom";
import { authClient } from "../lib/authClient";

export function AppLayout() {
  const navigate = useNavigate();

  async function handleLogout() {

    try {
      await authClient.signOut();

    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <>
      <nav className="navbar navbar-light bg-light border-bottom">
        <div className="container">
          <Link className="navbar-brand mb-0" to="/menu">
            Conecta RS
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2" />
            Sair
          </button>
        </div>
      </nav>

      <Outlet />
    </>
  );
}