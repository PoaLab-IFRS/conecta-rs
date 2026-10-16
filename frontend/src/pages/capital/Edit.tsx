import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCapital } from "../../api/capital/useCapital";
import { useDeleteCapital } from "../../api/capital/useDeleteCapital";
import { useUpdateCapital } from "../../api/capital/useUpdateCapital";
import { CapitalForm } from "../../components/CapitalForm";

export function CapitalEdit() {
	const navigate = useNavigate();
	const params = useParams();
	const id = params.id ? Number(params.id) : null;
	const validId = id !== null && Number.isInteger(id) && id > 0 ? id : null;

	const { data, loading: loadingCapital, error: loadError } = useCapital(validId);
	const { update, loading, error, clearError } = useUpdateCapital();
	const { remove, loading: deleting, error: deleteError } = useDeleteCapital();
	const [confirmDelete, setConfirmDelete] = useState(false);

	if (validId === null) {
		return (
			<div className="container py-4">
				<div className="alert alert-danger">ID de Capital inválido.</div>
			</div>
		);
	}

	if (loadingCapital) {
		return (
			<div className="container py-4">
				<p className="text-muted">Carregando...</p>
			</div>
		);
	}

	if (loadError || !data) {
		return (
			<div className="container py-4">
				<div className="alert alert-danger">
					{loadError ?? "Capital não encontrado."}
				</div>
			</div>
		);
	}

	return (
		<>
			<CapitalForm
				title="Editar Capital"
				initial={data}
				submitLabel="Salvar alterações"
				loading={loading || deleting}
				error={error ?? deleteError}
				onClearError={clearError}
				onSuccess={() => {
					void navigate("/capital");
				}}
				onDeleteClick={() => setConfirmDelete(true)}
				onSubmit={async (input) => {
					const result = await update(validId, input);
					return result.status === "updated" ? { status: "ok" } : { status: "error" };
				}}
			/>

			{confirmDelete && (
				<div
					className="modal fade show d-block"
					tabIndex={-1}
					role="dialog"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h2 className="modal-title fs-5">Remover Capital</h2>
								<button
									type="button"
									className="btn-close"
									aria-label="Fechar"
									onClick={() => setConfirmDelete(false)}
								/>
							</div>
							<div className="modal-body">
								<p>
									Tem certeza que deseja remover <strong>{data.nome}</strong>?
								</p>
								<p className="mb-0 text-danger">Esta ação é irreversível.</p>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-outline-secondary"
									onClick={() => setConfirmDelete(false)}
									disabled={deleting}
								>
									Cancelar
								</button>
								<button
									type="button"
									className="btn btn-danger"
									disabled={deleting}
									onClick={() => {
										void (async () => {
											const deleted = await remove(validId);
											if (deleted) {
												void navigate("/capital");
											}
										})();
									}}
								>
									{deleting ? "Removendo..." : "Remover definitivamente"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
