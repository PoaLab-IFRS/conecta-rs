import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { zodIssuesToFieldErrors } from "../lib/zodFieldErrors";
import {
	createCapitalSchema,
	type Capital,
	type CreateCapitalInput,
} from "../models/capital";

type CapitalFormInitial = Pick<Capital, "nome" | "assetNum" | "descricao">;

type SubmitResult = { status: "ok" } | { status: "error" };

type CapitalFormProps = {
	title: string;
	initial?: CapitalFormInitial;
	submitLabel?: string;
	loading?: boolean;
	error?: string | null;
	onClearError?: () => void;
	onSubmit: (input: CreateCapitalInput) => Promise<SubmitResult>;
	onSuccess: () => void;
	onDeleteClick?: () => void;
};

export function CapitalForm({
	title,
	initial,
	submitLabel = "Salvar",
	loading = false,
	error = null,
	onClearError,
	onSubmit,
	onSuccess,
	onDeleteClick,
}: CapitalFormProps) {
	const [nome, setNome] = useState(initial?.nome ?? "");
	const [assetNum, setAssetNum] = useState(initial?.assetNum ?? "");
	const [descricao, setDescricao] = useState(initial?.descricao ?? "");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFieldErrors({});
		onClearError?.();

		const parsed = createCapitalSchema.safeParse({ nome, assetNum, descricao });
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
				<Link to="/capital" className="btn btn-outline-secondary">
					Voltar
				</Link>
			</div>

			{error && <div className="alert alert-danger" role="alert">{error}</div>}

			<form onSubmit={handleSubmit} noValidate>
				<div className="mb-3">
					<label className="form-label" htmlFor="nome">
						Nome
					</label>
					<input
						id="nome"
						className={`form-control ${fieldErrors.nome ? "is-invalid" : ""}`}
						value={nome}
						onChange={(event) => setNome(event.target.value)}
						maxLength={191}
						required
					/>
					{fieldErrors.nome && <div className="invalid-feedback">{fieldErrors.nome}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label" htmlFor="assetNum">
						Número patrimonial
					</label>
					<input
						id="assetNum"
						className={`form-control ${fieldErrors.assetNum ? "is-invalid" : ""}`}
						value={assetNum}
						onChange={(event) => setAssetNum(event.target.value)}
						maxLength={191}
						required
					/>
					{fieldErrors.assetNum && (
						<div className="invalid-feedback">{fieldErrors.assetNum}</div>
					)}
				</div>

				<div className="mb-4">
					<label className="form-label" htmlFor="descricao">
						Descrição
					</label>
					<textarea
						id="descricao"
						className={`form-control ${fieldErrors.descricao ? "is-invalid" : ""}`}
						value={descricao}
						onChange={(event) => setDescricao(event.target.value)}
						maxLength={191}
						rows={3}
					/>
					<div className="form-text">{descricao.length}/191</div>
					{fieldErrors.descricao && (
						<div className="invalid-feedback d-block">{fieldErrors.descricao}</div>
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
						<Link to="/capital" className="btn btn-outline-secondary">
							Cancelar
						</Link>
						<button type="submit" className="btn btn-primary" disabled={loading}>
							{loading ? "Salvando..." : submitLabel}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
