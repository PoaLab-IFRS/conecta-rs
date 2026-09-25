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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Consumos</h1>
        <Link to="/consumo/novo" className="btn btn-primary">
          Novo consumo
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
  );
}
