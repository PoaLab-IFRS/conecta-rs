import { Link, Outlet, useNavigate } from "react-router-dom";
import { authClient } from "../lib/authClient";
import poalabSymbol from "../assets/poalab-symbol.svg";
import { CurrentUser } from "./CurrentUser";

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
      <nav className="navbar app-navbar">
        <div className="container app-navbar-container">
          <Link className="navbar-brand app-navbar-brand mb-0" to="/menu">
            <img
              src={poalabSymbol}
              alt=""
              width="38"
              height="38"
              aria-hidden="true"
            />
            <span>
              <strong>POALab</strong>
              <small>Sistema de gestão</small>
            </span>
          </Link>

          <div className="app-navbar-actions">
            <CurrentUser />
            <button
              type="button"
              className="btn app-logout-button"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}