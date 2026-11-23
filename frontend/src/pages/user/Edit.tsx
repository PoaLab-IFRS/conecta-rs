import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../api/user/useUser";
import { useUpdateUser } from "../../api/user/useUpdateUser";
import {
  updateUserSchema,
  type TipoUser,
  type UpdateUserInput,
} from "../../models/user";
import { zodIssuesToFieldErrors } from "../../lib/zodFieldErrors";

export function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    loading: loadingUser,
    error: loadError,
  } = useUser(id ?? null);

  const { update, loading, error, clearError } = useUpdateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tipoUser, setTipoUser] = useState<TipoUser>("USUARIO");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setTipoUser(user.tipoUser);
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      return;
    }

    setFieldErrors({});
    clearError();

    const parsed = updateUserSchema.safeParse({
      name,
      email,
      tipoUser,
    });

    if (!parsed.success) {
      setFieldErrors(zodIssuesToFieldErrors(parsed.error));
      return;
    }

    const input: UpdateUserInput = parsed.data;
    const result = await update(id, input);

    if (result.status === "updated") {
      void navigate("/usuarios");
    }
  }

  if (!id) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">ID de usuário inválido.</div>
      </div>
    );
  }

  if (loadingUser) {
    return (
      <main className="management-page">
        <div className="container management-form-container">
          <div className="management-loading">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            <span>Carregando usuário...</span>
          </div>
        </div>
      </main>
    );
  }

  if (loadError || !user) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          {loadError ?? "Usuário não encontrado."}
        </div>
      </div>
    );
  }

  return (
    <main className="management-page">
      <div className="container management-form-container">
        <header className="management-header management-form-header">
          <div>
            <Link to="/usuarios" className="management-breadcrumb">
              <i className="bi bi-arrow-left me-1" aria-hidden="true" />
              Voltar aos usuários
            </Link>
            <h1>Editar usuário</h1>
            <p>Atualize os dados de identificação e nível de acesso.</p>
          </div>
        </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="management-form-card">
        <section className="management-form-section">
          <div className="management-form-section-heading">
            <span><i className="bi bi-person" aria-hidden="true" /></span>
            <div>
              <h2>Dados da conta</h2>
              <p>Informações de identificação e permissão.</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Nome
          </label>
          <input
            id="name"
            type="text"
            className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={191}
            disabled={loading}
            required
          />
          {fieldErrors.name && (
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
            </div>

            <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={191}
            disabled={loading}
            required
          />
          {fieldErrors.email && (
            <div className="invalid-feedback">{fieldErrors.email}</div>
          )}
            </div>

            <div className="col-12">
          <label htmlFor="tipoUser" className="form-label">
            Papel
          </label>
          <select
            id="tipoUser"
            className={`form-select ${
              fieldErrors.tipoUser ? "is-invalid" : ""
            }`}
            value={tipoUser}
            onChange={(event) =>
              setTipoUser(event.target.value as TipoUser)
            }
            disabled={loading}
            required
          >
            <option value="USUARIO">Usuário</option>
            <option value="PROFESSOR">Professor</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {fieldErrors.tipoUser && (
            <div className="invalid-feedback">
              {fieldErrors.tipoUser}
            </div>
          )}
            </div>
          </div>
        </section>

        <div className="management-form-actions">
          <span />
          <div className="d-flex gap-2">
          <Link to="/usuarios" className="btn btn-outline-secondary">
            Cancelar
          </Link>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
          </div>
        </div>
      </form>
      </div>
    </main>
  );
}