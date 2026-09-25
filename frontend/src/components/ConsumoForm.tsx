import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAtributos } from "../api/atributo/useAtributos";
import { useUpdateConsumoEstoque } from "../api/consumo/useUpdateConsumoEstoque";
import { AtributoValorInput } from "./AtributoValorInput";
import { Autocomplete } from "./Autocomplete";
import { buildConsumoNomeFromAtributos } from "../lib/buildConsumoNome";
import { formatAtributoValor } from "../lib/formatAtributo";
import { zodIssuesToFieldErrors } from "../lib/zodFieldErrors";
import type {
  AtributoValor,
  CreateConsumoConflict,
  CreateConsumoInput,
  TipoValor,
} from "../models/consumo";
import { createConsumoSchema } from "../models/consumo";

export type ConsumoFormInitial = {
  nome: string;
  descricao: string | null;
  quantidadeEstoque: number;
  atributos: AtributoValor[];
};

type AtributoFormRow = {
  key: string;
  atributoId?: number;
  nome: string;
  tipoValor: TipoValor | "";
  valor: string;
  isNew: boolean;
};

type SubmitResult =
  | { status: "ok" }
  | { status: "conflict"; conflict: CreateConsumoConflict }
  | { status: "error" };

type ConsumoFormProps = {
  title: string;
  initial?: ConsumoFormInitial;
  submitLabel?: string;
  forceActionLabel?: string;
  loading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  onSubmit: (input: CreateConsumoInput) => Promise<SubmitResult>;
  onSuccess: () => void;
  onDeleteClick?: () => void;
};

const TIPO_VALOR_OPTIONS: Array<{ value: TipoValor; label: string }> = [
  { value: "TEXTO", label: "Texto" },
  { value: "INTEIRO", label: "Inteiro" },
  { value: "DECIMAL", label: "Decimal" },
  { value: "BOOLEANO", label: "Booleano" },
];

function createEmptyRow(): AtributoFormRow {
  return {
    key: crypto.randomUUID(),
    nome: "",
    tipoValor: "",
    valor: "",
    isNew: true,
  };
}

function valorToInput(atributo: AtributoValor): string {
  if (atributo.valor === null || atributo.valor === undefined) {
    return "";
  }
  if (atributo.tipoValor === "BOOLEANO") {
    return atributo.valor ? "true" : "false";
  }
  return String(atributo.valor);
}

function rowsFromInitial(initial?: ConsumoFormInitial): AtributoFormRow[] {
  if (!initial) {
    return [];
  }

  return initial.atributos.map((atributo) => ({
    key: crypto.randomUUID(),
    nome: atributo.nome,
    tipoValor: atributo.tipoValor,
    valor: valorToInput(atributo),
    isNew: false,
    // atributoId resolved after atributos catalog loads
  }));
}

function parseValor(tipoValor: TipoValor, valor: string): string | number | boolean | null {
  const trimmed = valor.trim();
  if (trimmed === "" && tipoValor !== "BOOLEANO") {
    return null;
  }

  switch (tipoValor) {
    case "TEXTO":
      return trimmed;
    case "INTEIRO":
      return Number.parseInt(trimmed, 10);
    case "DECIMAL":
      return Number(trimmed);
    case "BOOLEANO":
      return trimmed === "true";
    default:
      return null;
  }
}

export function ConsumoForm({
  title,
  initial,
  submitLabel = "Salvar",
  forceActionLabel = "Salvar mesmo assim",
  loading = false,
  error = null,
  onClearError,
  onSubmit,
  onSuccess,
  onDeleteClick,
}: ConsumoFormProps) {
  const { data: atributos } = useAtributos();
  const {
    update: updateEstoque,
    loading: savingEstoque,
    error: estoqueError,
  } = useUpdateConsumoEstoque();

  const initialRows = useMemo(() => rowsFromInitial(initial), [initial]);
  const generatedFromInitial = useMemo(
    () => buildConsumoNomeFromAtributos(initialRows),
    [initialRows],
  );

  const [gerarNomeAutomatico, setGerarNomeAutomatico] = useState(
    () => !initial || initial.nome === generatedFromInitial,
  );
  const [nomeCustomizado, setNomeCustomizado] = useState(initial?.nome ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [quantidade, setQuantidade] = useState(String(initial?.quantidadeEstoque ?? 0));
  const [rows, setRows] = useState<AtributoFormRow[]>(initialRows);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [conflict, setConflict] = useState<CreateConsumoConflict | null>(null);
  const [pendingPayload, setPendingPayload] = useState<CreateConsumoInput | null>(null);
  const [initialized, setInitialized] = useState(!initial);

  useEffect(() => {
    if (!initial || initialized || atributos.length === 0) {
      return;
    }

    setRows(
      initial.atributos.map((atributo) => {
        const found = atributos.find((item) => item.nome === atributo.nome);
        return {
          key: crypto.randomUUID(),
          atributoId: found?.id,
          nome: atributo.nome,
          tipoValor: atributo.tipoValor,
          valor: valorToInput(atributo),
          isNew: !found,
        };
      }),
    );
    setNomeCustomizado(initial.nome);
    setDescricao(initial.descricao ?? "");
    setQuantidade(String(initial.quantidadeEstoque));
    setGerarNomeAutomatico(initial.nome === buildConsumoNomeFromAtributos(
      initial.atributos.map((atributo) => ({
        nome: atributo.nome,
        tipoValor: atributo.tipoValor,
        valor: valorToInput(atributo),
      })),
    ));
    setInitialized(true);
  }, [atributos, initial, initialized]);

  const nomeGerado = useMemo(() => buildConsumoNomeFromAtributos(rows), [rows]);
  const nome = gerarNomeAutomatico ? nomeGerado : nomeCustomizado;

  const options = useMemo(
    () =>
      atributos.map((atributo) => ({
        id: atributo.id,
        label: atributo.nome,
      })),
    [atributos],
  );

  useEffect(() => {
    if (gerarNomeAutomatico) {
      setNomeCustomizado(nomeGerado);
    }
  }, [gerarNomeAutomatico, nomeGerado]);

  function updateRow(key: string, patch: Partial<AtributoFormRow>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row.key !== key));
  }

  function buildPayload(forceCreate = false) {
    return {
      nome,
      descricao,
      quantidade,
      forceCreate,
      atributos: rows.map((row) => ({
        atributoId: row.atributoId,
        nome: row.nome.trim() || undefined,
        tipoValor: row.isNew ? row.tipoValor || undefined : undefined,
        valor: row.tipoValor ? parseValor(row.tipoValor, row.valor) : null,
      })),
    };
  }

  async function submitPayload(forceCreate = false) {
    setFieldErrors({});
    setConflict(null);
    onClearError?.();

    if (gerarNomeAutomatico && !nomeGerado) {
      setFieldErrors({
        nome: "Adicione atributos com valor ou desmarque a geração automática do nome.",
      });
      return;
    }

    const parsed = createConsumoSchema.safeParse(buildPayload(forceCreate));
    if (!parsed.success) {
      setFieldErrors(zodIssuesToFieldErrors(parsed.error));
      return;
    }

    const result = await onSubmit(parsed.data);
    if (result.status === "ok") {
      onSuccess();
      return;
    }

    if (result.status === "conflict") {
      setConflict(result.conflict);
      setPendingPayload(parsed.data);
    }
  }

  async function handleConfirmAddEstoque() {
    if (!conflict || !pendingPayload) {
      return;
    }

    const result = await updateEstoque(conflict.consumoExistente.id, {
      quantidade: conflict.consumoExistente.quantidadeEstoque + pendingPayload.quantidade,
    });

    if (result) {
      onSuccess();
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: "880px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">{title}</h1>
        <Link to="/consumo" className="btn btn-outline-secondary">
          Voltar
        </Link>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submitPayload(false);
        }}
        noValidate
      >
        <div className="mb-3">
          <div className="form-check mb-2">
            <input
              id="gerar-nome"
              className="form-check-input"
              type="checkbox"
              checked={gerarNomeAutomatico}
              onChange={(event) => setGerarNomeAutomatico(event.target.checked)}
            />
            <label className="form-check-label" htmlFor="gerar-nome">
              Gerar nome automaticamente a partir dos atributos
            </label>
          </div>
          <label className="form-label" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            className={`form-control ${fieldErrors.nome ? "is-invalid" : ""}`}
            value={nome}
            onChange={(event) => setNomeCustomizado(event.target.value)}
            disabled={gerarNomeAutomatico}
            maxLength={191}
            placeholder={
              gerarNomeAutomatico ? "Preencha os atributos para gerar o nome" : "Nome do consumo"
            }
          />
          {fieldErrors.nome && <div className="invalid-feedback d-block">{fieldErrors.nome}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            id="descricao"
            className={`form-control ${fieldErrors.descricao ? "is-invalid" : ""}`}
            rows={2}
            value={descricao}
            maxLength={191}
            onChange={(event) => setDescricao(event.target.value)}
          />
          <div className="form-text">{descricao.length}/191</div>
          {fieldErrors.descricao && (
            <div className="invalid-feedback d-block">{fieldErrors.descricao}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="quantidade">
            Quantidade em estoque
          </label>
          <input
            id="quantidade"
            type="number"
            min={0}
            className={`form-control input-no-spin ${fieldErrors.quantidade ? "is-invalid" : ""}`}
            value={quantidade}
            onChange={(event) => setQuantidade(event.target.value)}
          />
          {fieldErrors.quantidade && (
            <div className="invalid-feedback d-block">{fieldErrors.quantidade}</div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Atributos</h2>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setRows((current) => [...current, createEmptyRow()])}
          >
            Adicionar atributo
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="text-muted">Nenhum atributo adicionado.</p>
        ) : (
          <div className="d-flex flex-column gap-3 mb-4">
            {rows.map((row, index) => {
              const atributoSelecionado = atributos.find((item) => item.id === row.atributoId);
              const nomeError = fieldErrors[`atributos.${index}.nome`];
              const tipoError = fieldErrors[`atributos.${index}.tipoValor`];
              const valorError = fieldErrors[`atributos.${index}.valor`];

              return (
                <div key={row.key} className="border rounded p-3">
                  <div className="row g-2 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Atributo</label>
                      <Autocomplete
                        value={row.nome}
                        options={options}
                        placeholder="Buscar ou criar atributo"
                        onChange={(value) =>
                          updateRow(row.key, {
                            nome: value,
                            atributoId: undefined,
                            isNew: true,
                            tipoValor: row.isNew ? row.tipoValor : "",
                          })
                        }
                        onSelect={(option) => {
                          if (!option) {
                            updateRow(row.key, {
                              atributoId: undefined,
                              isNew: true,
                            });
                            return;
                          }

                          const atributo = atributos.find((item) => item.id === option.id);
                          if (!atributo) {
                            return;
                          }

                          updateRow(row.key, {
                            atributoId: atributo.id,
                            nome: atributo.nome,
                            tipoValor: atributo.tipoValor,
                            isNew: false,
                            valor: row.atributoId === atributo.id ? row.valor : "",
                          });
                        }}
                      />
                      {nomeError && <div className="invalid-feedback d-block">{nomeError}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Tipo</label>
                      {row.isNew ? (
                        <select
                          className={`form-select ${tipoError ? "is-invalid" : ""}`}
                          value={row.tipoValor}
                          onChange={(event) =>
                            updateRow(row.key, {
                              tipoValor: event.target.value as TipoValor | "",
                              valor: "",
                            })
                          }
                        >
                          <option value="">Selecione</option>
                          {TIPO_VALOR_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="form-control"
                          value={
                            TIPO_VALOR_OPTIONS.find(
                              (option) =>
                                option.value === (atributoSelecionado?.tipoValor ?? row.tipoValor),
                            )?.label ?? row.tipoValor
                          }
                          disabled
                        />
                      )}
                      {tipoError && <div className="invalid-feedback d-block">{tipoError}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Valor</label>
                      <AtributoValorInput
                        atributoId={row.atributoId}
                        tipoValor={row.tipoValor}
                        value={row.valor}
                        disabled={!row.tipoValor}
                        onChange={(value) => updateRow(row.key, { valor: value })}
                      />
                      {valorError && <div className="invalid-feedback d-block">{valorError}</div>}
                    </div>

                    <div className="col-md-1">
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() => removeRow(row.key)}
                        aria-label="Remover atributo"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {row.isNew && row.nome.trim() && (
                    <div className="form-text mt-2">Novo atributo será criado ao salvar.</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(fieldErrors._form || error) && (
          <div className="alert alert-danger">{fieldErrors._form ?? error}</div>
        )}

        <div className="d-flex flex-wrap gap-2 justify-content-between">
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading || savingEstoque}>
              {loading ? "Salvando..." : submitLabel}
            </button>
            <Link to="/consumo" className="btn btn-outline-secondary">
              Cancelar
            </Link>
          </div>
          {onDeleteClick && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onDeleteClick}
              disabled={loading || savingEstoque}
            >
              <i className="bi bi-trash me-1" aria-hidden="true" />
              Remover material
            </button>
          )}
        </div>
      </form>

      {conflict && (
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
                  {conflict.tipo === "exato" ? "Consumo já existe" : "Consumo parecido encontrado"}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fechar"
                  onClick={() => setConflict(null)}
                />
              </div>
              <div className="modal-body">
                {conflict.tipo === "exato" ? (
                  <p className="mb-2">
                    Já existe o material <strong>{conflict.consumoExistente.nome}</strong> com os
                    mesmos atributos.
                  </p>
                ) : conflict.motivo === "subconjunto_do_existente" ? (
                  <p className="mb-2">
                    Os atributos informados correspondem a parte do material{" "}
                    <strong>{conflict.consumoExistente.nome}</strong>. Você pode adicionar a
                    quantidade a esse material ou continuar mesmo assim.
                  </p>
                ) : (
                  <p className="mb-2">
                    Os atributos informados incluem o material{" "}
                    <strong>{conflict.consumoExistente.nome}</strong>, com atributos extras. Você
                    pode adicionar a quantidade a esse material ou continuar mesmo assim.
                  </p>
                )}

                {conflict.consumoExistente.atributos.length > 0 && (
                  <div className="table-responsive mb-3">
                    <table className="table table-sm table-bordered mb-0">
                      <thead>
                        <tr>
                          <th>Atributo</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflict.consumoExistente.atributos.map((atributo) => (
                          <tr key={atributo.nome}>
                            <td>{atributo.nome}</td>
                            <td>{formatAtributoValor(atributo)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="mb-0 text-muted">
                  Estoque atual: {conflict.consumoExistente.quantidadeEstoque}. Quantidade a
                  adicionar: {pendingPayload?.quantidade ?? 0}. Novo total:{" "}
                  {conflict.consumoExistente.quantidadeEstoque + (pendingPayload?.quantidade ?? 0)}.
                </p>
                {estoqueError && <div className="alert alert-danger mt-3 mb-0">{estoqueError}</div>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setConflict(null)}
                  disabled={savingEstoque || loading}
                >
                  Cancelar
                </button>
                {conflict.tipo === "parcial" && (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setConflict(null);
                      void submitPayload(true);
                    }}
                    disabled={savingEstoque || loading}
                  >
                    {loading ? "Salvando..." : forceActionLabel}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void handleConfirmAddEstoque()}
                  disabled={savingEstoque || loading}
                >
                  {savingEstoque ? "Adicionando..." : "Adicionar ao existente"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
