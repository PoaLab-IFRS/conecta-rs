import { Link } from "react-router-dom";
import { CurrentUser } from "../components/CurrentUser";
import { authClient } from "../lib/authClient";

export function Menu() {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="h3 mb-1">Menu principal</h1>
          <p className="text-muted mb-0">Escolha uma área para continuar.</p>
        </div>
        <CurrentUser />
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <i className="bi bi-box-seam fs-2 text-primary" aria-hidden="true" />
              <h2 className="h5 mt-3">Consumos</h2>
              <p className="text-muted flex-grow-1">
                Consulte, cadastre e gerencie os itens de consumo.
              </p>
              <Link to="/consumo" className="btn btn-primary">
                Acessar consumos
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <i className="bi bi-building fs-2 text-primary" aria-hidden="true" />
              <h2 className="h5 mt-3">Capital</h2>
              <p className="text-muted flex-grow-1">
                Consulte, cadastre e gerencie os itens patrimoniais.
              </p>
              <Link to="/capital" className="btn btn-primary">
                Acessar capital
              </Link>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-primary">
              <div className="card-body d-flex flex-column">
                <i className="bi bi-people fs-2 text-primary" aria-hidden="true" />
                <h2 className="h5 mt-3">Usuários</h2>

                <p className="text-muted flex-grow-1">
                  Consulte os usuários cadastrados ou adicione novos usuários.
                </p>

                <div className="d-grid gap-2">
                  <Link to="/usuarios" className="btn btn-primary">
                    Listar usuários
                  </Link>

                  <Link to="/usuarios/novo" className="btn btn-outline-primary">
                    Criar usuário
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}