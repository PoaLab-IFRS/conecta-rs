import { useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom"; 
import { useUser } from "../../api/usuario/useUser"; 
import { useDeleteUser } from "../../api/usuario/useDeleteUser"; 
import { useUpdateUser } from "../../api/usuario/useUpdateUser"; 
import { UserForm } from "../../components/UserForm";

const mockUser = {
    id: 1,
    name: "Usuário de Teste",
    email: "teste@email.com",
    tipoUser: "ADMIN",
	createdAt: new Date(),
    updatedAt: new Date()
} as const;

export function UserEdit() { 
    const navigate = useNavigate(); 
    // const params = useParams();
    // const id = params.id ? Number(params.id) : null;
    // const validId = id !== null && Number.isInteger(id) && id > 0 ? id : null;
	const params = useParams();

	const isTestMode = !params.id;

	const id = params.id ? Number(params.id) : null;

	const validId = isTestMode
		? 1
		: id !== null && Number.isInteger(id) && id > 0
			? id
			: null;

// const {
// 	data,
// 	loading: loadingUser,
// 	error: loadError,
// } = useUser(validId);

const {
    data: userData,
    loading: loadingUser,
    error: loadError,
} = useUser(isTestMode ? null : validId);

const data = isTestMode ? mockUser : userData;

const {
	update,
	loading,
	error,
	clearError,
} = useUpdateUser();

const {
	remove,
	loading: deleting,
	error: deleteError,
} = useDeleteUser();

const [confirmDelete, setConfirmDelete] = useState(false);

if (validId === null) {
	return (
		<div className="container py-4">
			<div className="alert alert-danger">
				ID de usuário inválido.
			</div>
		</div>
	);
}

if (loadingUser) {
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
				{loadError ?? "Usuário não encontrado."}
			</div>
		</div>
	);
}

return (
	<>
		<UserForm
			title="Editar Usuário"
			initial={data}
			submitLabel="Salvar alterações"
			loading={loading || deleting}
			error={error ?? deleteError}
			onClearError={clearError}
			onSuccess={() => {
				void navigate("/user");
			}}
			onDeleteClick={() => setConfirmDelete(true)}
			// onSubmit={async (input) => {
			// 	const result = await update(validId, input);

			// 	return result.status === "updated"
			// 		? { status: "ok" }
			// 		: { status: "error" };
			// }}
			onSubmit={async (input) => {
			if (isTestMode) {
				console.log("Dados do usuário de teste:", input);

				return { status: "ok" };
			}

			const result = await update(validId!, input);

			return result.status === "updated"
				? { status: "ok" }
				: { status: "error" };
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
							<h2 className="modal-title fs-5">
								Remover Usuário
							</h2>

							<button
								type="button"
								className="btn-close"
								aria-label="Fechar"
								onClick={() => setConfirmDelete(false)}
							/>
						</div>

						<div className="modal-body">
							<p>
								Tem certeza que deseja remover{" "}
								<strong>{data.name}</strong>?
							</p>

							<p className="mb-0 text-danger">
								Esta ação é irreversível.
							</p>
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
											void navigate("/user");
										}
									})();
								}}
							>
								{deleting
									? "Removendo..."
									: "Remover definitivamente"}
							</button>
						</div>
					</div>
				</div>
			</div>
		)}
	</>
);


}