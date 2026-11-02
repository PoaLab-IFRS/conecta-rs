import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../../lib/authClient";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Link de redefinição inválido ou incompleto.");
      return;
    }

    if (password.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(
          result.error.message ??
            "Não foi possível redefinir a senha.",
        );
        return;
      }

      setSuccess("Senha redefinida com sucesso.");
      window.setTimeout(() => {
        void navigate("/login", { replace: true });
      }, 1500);
    } catch {
      setError("Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="alert alert-danger" role="alert">
              Link de redefinição inválido ou expirado.
            </div>

            <Link to="/login" className="btn btn-primary w-100">
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <i
                  className="bi bi-key display-6 text-primary"
                  aria-hidden="true"
                />
                <h1 className="h3 mt-2 mb-1">Nova senha</h1>
                <p className="text-muted mb-0">
                  Informe sua nova senha.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Nova senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    maxLength={128}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    minLength={8}
                    maxLength={128}
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Redefinindo..." : "Redefinir senha"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}