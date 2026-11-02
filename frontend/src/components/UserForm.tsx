import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { zodIssuesToFieldErrors } from "../lib/zodFieldErrors";
import {
  createUserSchema,
  type CreateUserInput,
  type TipoUser,
} from "../models/user";

type SubmitResult = { status: "ok" } | { status: "error" };

type UserFormProps = {
  title: string;
  submitLabel?: string;
  loading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  onSubmit: (input: CreateUserInput) => Promise<SubmitResult>;
  onSuccess: () => void;
};

export function UserForm({
  title,
  submitLabel = "Salvar",
  loading = false,
  error = null,
  onClearError,
  onSubmit,
  onSuccess,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tipoUser, setTipoUser] = useState<TipoUser>("USUARIO");
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    onClearError?.();

    const parsed = createUserSchema.safeParse({
      name,
      email,
      password,
      tipoUser,
    });

    if (!parsed.success) {
      setFieldErrors(zodIssuesToFieldErrors(parsed.error));
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({
        confirmPassword: "As senhas não coincidem",
      });
      return;
    }

    const result = await onSubmit(parsed.data);

    if (result.status === "ok") {
      onSuccess();
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: "720px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">{title}</h1>

        <Link to="/usuarios" className="btn btn-outline-secondary">
          Voltar
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            type="text"
            className={`form-control ${
              fieldErrors.name ? "is-invalid" : ""
            }`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={191}
            autoComplete="name"
            required
          />
          {fieldErrors.name && (
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${
              fieldErrors.email ? "is-invalid" : ""
            }`}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={191}
            autoComplete="email"
            required
          />
          {fieldErrors.email && (
            <div className="invalid-feedback">{fieldErrors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={`form-control ${
              fieldErrors.password ? "is-invalid" : ""
            }`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            required
          />
          {fieldErrors.password && (
            <div className="invalid-feedback">
              {fieldErrors.password}
            </div>
          )}
          <div className="form-text">
            A senha deve ter entre 8 e 128 caracteres.
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`form-control ${
              fieldErrors.confirmPassword ? "is-invalid" : ""
            }`}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          {fieldErrors.confirmPassword && (
            <div className="invalid-feedback">
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="tipoUser">
            Tipo de usuário
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

        <div className="d-flex justify-content-end gap-2">
          <Link to="/usuarios" className="btn btn-outline-secondary">
            Cancelar
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Salvando..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}