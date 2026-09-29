import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCapitais } from "../../api/capital/listCapitais";
import { getErrorMessage } from "../../api/parse";
import { Pagination } from "../../components/Pagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { ListCapitalResponse } from "../../models/capital";

const PAGE_SIZE = 10;
const FILTER_DEBOUNCE_MS = 500;

export function CapitalList() {
	const [nome, setNome] = useState("");
	const [filtro, setFiltro] = useState("");
	const [page, setPage] = useState(1);
	const [result, setResult] = useState<ListCapitalResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const debouncedNome = useDebouncedValue(nome.trim(), FILTER_DEBOUNCE_MS);

	useEffect(() => {
		setFiltro(debouncedNome);
		setPage(1);
	}, [debouncedNome]);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);

			try {
				const response = await listCapitais({
					nome: filtro || undefined,
					page,
					pageSize: PAGE_SIZE,
				});

				if (!cancelled) {
					setResult(response);
				}
			} catch (err) {
				if (!cancelled) {
					setError(getErrorMessage(err, "Falha ao carregar itens de capital"));
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
				<h1 className="h3 mb-0">Itens de capital</h1>
				<Link to="/capital/novo" className="btn btn-primary">
					Novo item
				</Link>
			</div>

			<div className="mb-4">
				<input
					type="search"
					className="form-control"
					placeholder="Filtrar por nome ou descrição"
					value={nome}
					onChange={(event) => setNome(event.target.value)}
				/>
			</div>

			{error && <div className="alert alert-danger">{error}</div>}

			{loading ? (
				<p className="text-muted">Carregando...</p>
			) : (
				<>
					<div className="table-responsive">
						<table className="table table-striped table-hover align-middle">
							<thead>
								<tr>
									<th scope="col">Nome</th>
									<th scope="col">Número patrimonial</th>
									<th scope="col">Descrição</th>
									<th scope="col" className="text-end">
										Ações
									</th>
								</tr>
							</thead>
							<tbody>
								{result?.data.length ? (
									result.data.map((capital) => (
										<tr key={capital.id}>
											<td>{capital.nome}</td>
											<td>{capital.assetNum}</td>
											<td>{capital.descricao ?? "—"}</td>
											<td className="text-end">
												<Link
													to={`/capital/${capital.id}/editar`}
													className="btn btn-sm btn-outline-secondary"
													title="Editar"
													aria-label={`Editar ${capital.nome}`}
												>
													<i className="bi bi-pencil" aria-hidden="true" />
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={4} className="text-muted">
											Nenhum item de capital encontrado.
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
