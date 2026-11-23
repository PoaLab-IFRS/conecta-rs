import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/authClient";
import poalabSymbol from "../../assets/poalab-symbol.svg";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="login-page">
      <div className="container-fluid login-container">
        <div className="login-card row g-0">
          <section className="login-brand col-lg-5 d-none d-lg-flex">
            <div className="login-brand-content">
              <img
                src={poalabSymbol}
                alt=""
                width="96"
                height="96"
                aria-hidden="true"
                className="login-brand-symbol"
              />
              <h2>Transformando ideias em protótipos reais</h2>
              <p>
                Gerencie consumos, patrimônio e usuários em um único ambiente.
              </p>
            </div>
          </section>

          <section className="login-form-panel col-12 col-lg-7">
            <div className="login-form-wrapper">
              <div className="text-center text-lg-start mb-4">
                <img
                  src={poalabSymbol}
                  alt="POALab"
                  width="72"
                  height="72"
                  className="d-lg-none login-mobile-symbol"
                />
                <span className="login-eyebrow">Área administrativa</span>
                <h1 className="h2 login-title mt-2 mb-2">Bem-vindo ao POALab</h1>
                <p className="text-muted mb-0">
                  Entre com sua conta para continuar.
                </p>
              </div>

              {error && (
                <div id="login-error" className="alert alert-danger login-alert" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    E-mail
                  </label>
                  <div className="login-input-group">
                    <i className="bi bi-envelope login-input-icon" aria-hidden="true" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control login-input ${error ? "is-invalid" : ""}`}
                      placeholder="usuario@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={loading}
                      autoComplete="email"
                      aria-describedby={error ? "login-error" : undefined}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Senha
                  </label>
                  <div className="login-input-group">
                    <i className="bi bi-lock login-input-icon" aria-hidden="true" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control login-input login-password-input ${error ? "is-invalid" : ""}`}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={loading}
                      autoComplete="current-password"
                      aria-describedby={error ? "login-error" : undefined}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      disabled={loading}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      aria-pressed={showPassword}
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary login-submit w-100"
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
                      <i className="bi bi-box-arrow-in-right me-2" aria-hidden="true" />
                      Acessar sistema
                    </>
                  )}
                </button>
              </form>

              <p className="login-security-note">
                <i className="bi bi-shield-check" aria-hidden="true" />
                Seu Login e Protegido.
              </p>
            </div>

            <footer className="login-footer">
              © {new Date().getFullYear()} POALab
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}