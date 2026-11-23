import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useConsumos } from "../../api/consumo/useConsumos";
import { EstoqueEditor } from "../../components/EstoqueEditor";
import { Pagination } from "../../components/Pagination";
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

  const { data: result, loading, error, reload } = useConsumos({
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
    <main className="management-page">
      <div className="container management-container">
        <header className="management-header">
          <div>
            <Link to="/menu" className="management-breadcrumb">
              <i className="bi bi-arrow-left me-1" aria-hidden="true" />
              Voltar ao menu
            </Link>
            <h1>Itens de consumo</h1>
            <p>Materiais disponíveis e seus atributos cadastrados.</p>
          </div>
          <Link to="/consumo/novo" className="btn management-primary-button">
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Novo consumo
          </Link>
        </header>

        <div className="management-toolbar">
          <label htmlFor="consumo-search" className="management-search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              id="consumo-search"
              type="search"
              className="form-control"
              placeholder="Buscar por nome, descrição ou atributo"
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
                  <th scope="col" style={{ width: "2rem" }} />
                  <th scope="col">Nome</th>
                  <th scope="col">Descrição</th>
                  <th scope="col" className="text-end">
                    Estoque
                  </th>
                  <th scope="col" style={{ width: "3rem" }} />
                </tr>
              </thead>
              <tbody>
                {result?.data.length ? (
                  result.data.map((consumo) => {
                    const expanded = expandedId === consumo.id;
                    return (
                      <Fragment key={consumo.id}>
                        <tr
                          role="button"
                          onClick={() => toggleExpand(consumo.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-muted">{expanded ? "▾" : "▸"}</td>
                          <td>
                            <div className="management-item-name">
                              <span className="management-item-icon">
                                <i className="bi bi-box-seam" aria-hidden="true" />
                              </span>
                              <div>
                                <strong>{consumo.nome}</strong>
                              </div>
                            </div>
                          </td>
                          <td>{consumo.descricao ?? "—"}</td>
                          <td className="text-end">{consumo.quantidadeEstoque}</td>
                          <td className="text-end">
                            <Link
                              to={`/consumo/${consumo.id}/editar`}
                              className="btn management-edit-button"
                              title="Editar"
                              aria-label={`Editar ${consumo.nome}`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <i className="bi bi-pencil" aria-hidden="true" />
                            </Link>
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="table-light">
                            <td />
                            <td colSpan={4}>
                              <div className="mb-3">
                                {consumo.atributos.length ? (
                                  <table className="table table-sm mb-0">
                                    <thead>
                                      <tr>
                                        <th>Atributo</th>
                                        <th>Valor</th>
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
                    <td colSpan={5}>
                      <div className="management-empty-state">
                        <i className="bi bi-box-seam" aria-hidden="true" />
                        <strong>Nenhum item encontrado</strong>
                        <span>Tente outro termo ou cadastre um novo consumo.</span>
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
