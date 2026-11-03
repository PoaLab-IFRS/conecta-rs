import { useEffect, useState } from "react"; import { Link } from "react-router-dom"; 
import { listUser } from "../../api/usuario/listUser"; 
import { getErrorMessage } from "../../api/parse"; 
import { Pagination } from "../../components/Pagination"; 
import { useDebouncedValue } from "../../hooks/useDebouncedValue"; 
import type { ListUserResponse } from "../../models/usuario";

const PAGE_SIZE = 10; const FILTER_DEBOUNCE_MS = 500;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", });

const tipoUserLabel: Record<string, string> = { ADMIN: "Administrador", PROFESSOR: "Professor", USUARIO: "Usuário", };

export function UserList() { const [name, setName] = useState(""); const [filtro, setFiltro] = useState(""); const [page, setPage] = useState(1); const [result, setResult] = useState<ListUserResponse | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);

const debouncedName = useDebouncedValue(
	name.trim(),
	FILTER_DEBOUNCE_MS
);

useEffect(() => {
	setFiltro(debouncedName);
	setPage(1);
}, [debouncedName]);

useEffect(() => {
	let cancelled = false;

	async function load() {
		setLoading(true);
		setError(null);

		try {
			const response = await listUser({
				name: filtro || undefined,
				page,
				pageSize: PAGE_SIZE,
			});

			if (!cancelled) {
				setResult(response);
			}
		} catch (err) {
			if (!cancelled) {
				setError(
					getErrorMessage(err, "Falha ao carregar usuários")
				);
				setResult(null);
			}
		} finally {
			if (!cancelled) {
				setLoading(false);
			}
		}
	}

	void load();

	return () => {
		cancelled = true;
	};
}, [filtro, page]);

const totalPages = result
	? Math.max(1, Math.ceil(result.total / result.pageSize))
	: 1;

return (
	<div className="container py-4">
		<div className="d-flex justify-content-between align-items-center mb-4">
			<h1 className="h3 mb-0">Usuários</h1>

			<Link to="/user/novo" className="btn btn-primary">
				Novo usuário
			</Link>
		</div>

		<div className="mb-4">
			<input
				type="search"
				className="form-control"
				placeholder="Filtrar por nome"
				value={name}
				onChange={(event) => setName(event.target.value)}
			/>
		</div>

		{error && (
			<div className="alert alert-danger" role="alert">
				{error}
			</div>
		)}

		{loading ? (
			<p className="text-muted">Carregando...</p>
		) : (
			<>
				<div className="table-responsive">
					<table className="table table-striped table-hover align-middle">
						<thead>
							<tr>
								<th scope="col">Nome</th>
								<th scope="col">E-mail</th>
								<th scope="col">Tipo de usuário</th>
								<th scope="col">Data de criação</th>
								<th scope="col" className="text-end">
									Ações
								</th>
							</tr>
						</thead>

						<tbody>
							{result?.data.length ? (
								result.data.map((user) => (
									<tr key={user.id}>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td>
											{tipoUserLabel[user.tipoUser]}
										</td>
										<td>
											{dateFormatter.format(
												new Date(user.createdAt)
											)}
										</td>
										<td className="text-end">
											<Link
												to={`/user/${user.id}/editar`}
												className="btn btn-sm btn-outline-secondary"
												title="Editar"
												aria-label={`Editar ${user.name}`}
											>
												<i
													className="bi bi-pencil"
													aria-hidden="true"
												/>
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="text-muted"
									>
										Nenhum usuário encontrado.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<Pagination
					page={page}
					totalPages={totalPages}
					total={result?.total ?? 0}
					onPageChange={setPage}
				/>
			</>
		)}
	</div>
);


}