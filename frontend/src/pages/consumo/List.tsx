import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useConsumos } from "../../api/consumo/useConsumos";
import { EstoqueEditor } from "../../components/EstoqueEditor";
import { Pagination } from "../../components/Pagination";
import { PageSearch } from "../../components/PageSearch";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { formatAtributoValor } from "../../lib/formatAtributo";

const PAGE_SIZE = 10;
const FILTER_DEBOUNCE_MS = 500;

export function ConsumoList() {
  const [nome, setNome] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const debouncedNome = useDebouncedValue(nome.trim(), FILTER_DEBOUNCE_MS);
  const [filtro, setFiltro] = useState(debouncedNome);

  useEffect(() => {
    setFiltro(debouncedNome);
    setPage(1);
    setExpandedId(null);
  }, [debouncedNome]);

  const {
    data: result,
    loading,
    error,
    reload,
  } = useConsumos({
    nome: filtro || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setExpandedId(null);
  }, [page]);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;

  function toggleExpand(id: number) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="h3 mb-0">Consumos</h1>
        <Link to="/consumo/novo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2" aria-hidden="true" />
          Novo consumo
        </Link>
      </div>

      <div className="surface">
        <PageSearch>
          <div className="search-field">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              className="form-control"
              placeholder="Pesquisar..."
              aria-label="Filtrar consumos por nome, descrição ou atributo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>
        </PageSearch>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-muted" role="status">
            Carregando...
          </p>
        ) : (
          <>
            <div
              className="table-responsive table-scroll"
              role="region"
              aria-label="Materiais de consumo"
              tabIndex={0}
            >
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="visually-hidden">Detalhes</span>
                    </th>
                    <th scope="col">Nome</th>
                    <th scope="col">Descrição</th>
                    <th scope="col" className="text-end">
                      Estoque
                    </th>
                    <th scope="col">
                      <span className="visually-hidden">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result?.data.length ? (
                    result.data.map((consumo) => {
                      const expanded = expandedId === consumo.id;
                      return (
                        <Fragment key={consumo.id}>
                          <tr className="expandable-row" onClick={() => toggleExpand(consumo.id)}>
                            <td>
                              <button
                                type="button"
                                className="expand-toggle"
                                aria-label={`${expanded ? "Recolher" : "Expandir"} ${consumo.nome}`}
                                aria-expanded={expanded}
                                aria-controls={expanded ? `consumo-${consumo.id}` : undefined}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleExpand(consumo.id);
                                }}
                              >
                                <i
                                  className={`bi bi-chevron-${expanded ? "down" : "right"}`}
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                            <td>{consumo.nome}</td>
                            <td>{consumo.descricao ?? "—"}</td>
                            <td className="text-end">{consumo.quantidadeEstoque}</td>
                            <td className="text-end">
                              <Link
                                to={`/consumo/${consumo.id}/editar`}
                                className="btn btn-sm btn-outline-secondary"
                                title="Editar"
                                aria-label={`Editar ${consumo.nome}`}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <i className="bi bi-pencil" aria-hidden="true" />
                              </Link>
                            </td>
                          </tr>
                          {expanded && (
                            <tr id={`consumo-${consumo.id}`} className="expanded-row">
                              <td />
                              <td colSpan={4}>
                                <div className="mb-3">
                                  {consumo.atributos.length ? (
                                    <table className="table table-sm mb-0">
                                      <thead>
                                        <tr>
                                          <th scope="col">Atributo</th>
                                          <th scope="col">Valor</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {consumo.atributos.map((atributo) => (
                                          <tr key={atributo.nome}>
                                            <td>{atributo.nome}</td>
                                            <td>{formatAtributoValor(atributo)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <span className="text-muted">Nenhum atributo cadastrado.</span>
                                  )}
                                </div>

                                <EstoqueEditor
                                  key={`${consumo.id}-${consumo.quantidadeEstoque}`}
                                  consumoId={consumo.id}
                                  quantidadeInicial={consumo.quantidadeEstoque}
                                  onSaved={() => reload()}
                                />
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-muted">
                        Nenhum material de consumo encontrado.
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
    </div>
  );
}
