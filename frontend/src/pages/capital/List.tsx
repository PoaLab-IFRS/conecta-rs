import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCapitais } from "../../api/capital/listCapitais";
import { getErrorMessage } from "../../api/parse";
import { Pagination } from "../../components/Pagination";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { ListCapitalResponse } from "../../models/capital";

const PAGE_SIZE = 10;
const FILTER_DEBOUNCE_MS = 500;
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

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
		<main className="management-page">
			<div className="container management-container">
				<header className="management-header">
					<div>
						<Link to="/menu" className="management-breadcrumb">
							<i className="bi bi-arrow-left me-1" aria-hidden="true" />
							Voltar ao menu
						</Link>
						<h1>Itens de capital</h1>
						<p>Patrimônio e equipamentos cadastrados no laboratório.</p>
					</div>
					<Link to="/capital/novo" className="btn management-primary-button">
						<i className="bi bi-plus-lg me-2" aria-hidden="true" />
						Novo item
					</Link>
				</header>

				<div className="management-toolbar">
					<label htmlFor="capital-search" className="management-search">
						<i className="bi bi-search" aria-hidden="true" />
						<input
							id="capital-search"
							type="search"
							className="form-control"
							placeholder="Buscar por nome ou descrição"
							value={nome}
							onChange={(event) => setNome(event.target.value)}
						/>
					</label>
					{result && (
						<span className="management-result-count">
							{result.total} {result.total === 1 ? "item" : "itens"}
						</span>
					)}
				</div>

			{error && <div className="alert alert-danger">{error}</div>}

			{loading ? (
				<div className="management-loading">
					<span className="spinner-border spinner-border-sm" aria-hidden="true" />
					<span>Carregando itens...</span>
				</div>
			) : (
				<>
					<div className="management-table-card table-responsive">
						<table className="table management-table align-middle mb-0">
							<thead>
								<tr>
									<th scope="col">Nome</th>
									<th scope="col">Patrimônio</th>
									<th scope="col">Valor</th>
									<th scope="col">Escola</th>
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
											<td>
												<div className="management-item-name">
													<span className="management-item-icon">
														<i className="bi bi-currency-dollar" aria-hidden="true" />
													</span>
													<div>
														<strong>{capital.nome}</strong>
														<small>{capital.numeroSerie}</small>
													</div>
												</div>
											</td>
											<td>{capital.assetNum}</td>
											<td>{currencyFormatter.format(Number(capital.valor))}</td>
											<td>{capital.nomeEscola}</td>
											<td>{capital.descricao ?? "—"}</td>
											<td className="text-end">
												<Link
													to={`/capital/${capital.id}/editar`}
													className="btn management-edit-button"
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
										<td colSpan={6}>
											<div className="management-empty-state">
												<i className="bi bi-currency-dollar" aria-hidden="true" />
												<strong>Nenhum item encontrado</strong>
												<span>Tente outro termo ou cadastre um novo item.</span>
											</div>
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
		</main>
	);
}
