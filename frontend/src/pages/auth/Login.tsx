import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/authClient";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationState = location.state as { from?: string } | null;
  const requestedPath =
    locationState?.from?.startsWith("/") &&
    !locationState.from.startsWith("//")
      ? locationState.from
      : "/menu";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      navigate(requestedPath, { replace: true });
    } catch {
      setError("Não foi possível realizar o login.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <div className="container py-5 text-center text-muted">
        Verificando sessão...
      </div>
    );
  }

  if (session) {
    return <Navigate to={requestedPath} replace />;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <i
                  className="bi bi-box-seam display-6 text-primary"
                  aria-hidden="true"
                />
                <h1 className="h3 mt-2 mb-1">Conecta RS</h1>
                <p className="text-muted mb-0">
                  Entre com sua conta para continuar
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    minLength={8}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2" />
                      Entrar
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}