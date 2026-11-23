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
      <main className="login-page">
        <div className="container reset-password-container">
          <div className="reset-password-card">
            <div className="reset-password-icon reset-password-icon-error" aria-hidden="true">
              <i className="bi bi-link-45deg" />
            </div>
            <h1>Link inválido</h1>
            <div className="alert alert-danger reset-password-alert" role="alert">
              Link de redefinição inválido ou expirado.
            </div>
            <Link to="/login" className="btn login-submit w-100">
              Voltar ao login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="login-page">
      <div className="container reset-password-container">
        <div className="reset-password-card">
          <div className="text-center mb-4">
            <div className="reset-password-icon" aria-hidden="true">
              <i className="bi bi-key" />
            </div>
            <span className="login-eyebrow">Recuperação de acesso</span>
            <h1 className="h2 login-title mt-2 mb-2">Criar nova senha</h1>
            <p className="text-muted mb-0">
              Defina uma senha segura para sua conta.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger reset-password-alert" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success reset-password-alert" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Nova senha
              </label>
              <div className="login-input-group">
                <i className="bi bi-lock login-input-icon" aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control login-input"
                  placeholder="Mínimo de 8 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  maxLength={128}
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="form-text">Use entre 8 e 128 caracteres.</div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">
                Confirmar nova senha
              </label>
              <div className="login-input-group">
                <i className="bi bi-shield-lock login-input-icon" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-control login-input"
                  placeholder="Repita a nova senha"
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
            </div>

            <button
              type="submit"
              className="btn login-submit w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Redefinindo...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2" aria-hidden="true" />
                  Redefinir senha
                </>
              )}
            </button>
          </form>

          <Link to="/login" className="reset-password-back">
            <i className="bi bi-arrow-left me-1" aria-hidden="true" />
            Voltar ao login
          </Link>
        </div>
      </div>
    </main>
  );
}