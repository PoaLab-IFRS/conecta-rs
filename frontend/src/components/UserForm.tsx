import { useState, type FormEvent } from "react"; 
import { Link } from "react-router-dom"; 
import { zodIssuesToFieldErrors } from "../lib/zodFieldErrors"; 
import { createUserSchema, type User, type CreateUserInput, type TipoUser, } from "../models/usuario";

type UserFormInitial = Pick<User, "email" | "name" | "tipoUser">;

type SubmitResult = { status: "ok" } | { status: "error" };

type UserFormProps = { 
	title: string; initial?: UserFormInitial; 
	submitLabel?: string; loading?: boolean; 
	error?: string | null; 
	onClearError?: () => void; 
	onSubmit: (input: CreateUserInput) => Promise<SubmitResult>; 
	onSuccess: () => void; onDeleteClick?: () => void; 
	};

export function UserForm({ title, initial, submitLabel = "Salvar", loading = false, error = null, onClearError, onSubmit, onSuccess, onDeleteClick, }: UserFormProps) { const [name, setName] = useState(initial?.name ?? ""); const [email, setEmail] = useState(initial?.email ?? ""); const [senha, setSenha] = useState(""); const [tipoUser, setTipoUser] = useState<TipoUser>( initial?.tipoUser ?? "USUARIO" ); const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
	event.preventDefault();
	setFieldErrors({});
	onClearError?.();

	const parsed = createUserSchema.safeParse({
		name,
		email,
		senha,
		tipoUser,
	});

	if (!parsed.success) {
		setFieldErrors(zodIssuesToFieldErrors(parsed.error));
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
			<Link to="/user" className="btn btn-outline-secondary">
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
					className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
					value={name}
					onChange={(event) => setName(event.target.value)}
					maxLength={191}
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
					className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					maxLength={191}
					required
				/>
				{fieldErrors.email && (
					<div className="invalid-feedback">{fieldErrors.email}</div>
				)}
			</div>

			<div className="mb-3">
				<label className="form-label" htmlFor="senha">
					Senha
				</label>
				<input
					id="senha"
					type="password"
					className={`form-control ${fieldErrors.senha ? "is-invalid" : ""}`}
					value={senha}
					onChange={(event) => setSenha(event.target.value)}
					autoComplete="new-password"
					required
				/>
				{fieldErrors.senha && (
					<div className="invalid-feedback">{fieldErrors.senha}</div>
				)}
				{initial && (
					<div className="form-text">
						Informe uma nova senha para alterar a senha atual.
					</div>
				)}
			</div>

			<div className="mb-4">
				<label className="form-label" htmlFor="tipoUser">
					Tipo de usuário
				</label>
				<select
					id="tipoUser"
					className={`form-select ${fieldErrors.tipoUser ? "is-invalid" : ""}`}
					value={tipoUser}
					onChange={(event) =>
						setTipoUser(event.target.value as TipoUser)
					}
					required
				>
					<option value="ADMIN">Administrador</option>
					<option value="PROFESSOR">Professor</option>
					<option value="USUARIO">Usuário</option>
				</select>
				{fieldErrors.tipoUser && (
					<div className="invalid-feedback">{fieldErrors.tipoUser}</div>
				)}
			</div>

			<div className="d-flex justify-content-between">
				{onDeleteClick ? (
					<button
						type="button"
						className="btn btn-outline-danger"
						onClick={onDeleteClick}
						disabled={loading}
					>
						Remover
					</button>
				) : (
					<span />
				)}

				<div className="d-flex gap-2">
					<Link to="/user" className="btn btn-outline-secondary">
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
			</div>
		</form>
	</div>
);


}