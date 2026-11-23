import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { zodIssuesToFieldErrors } from "../lib/zodFieldErrors";
import {
  createCapitalSchema,
  type Capital,
  type CreateCapitalInput,
} from "../models/capital";

type CapitalFormInitial = Pick<
  Capital,
  | "nome"
  | "assetNum"
  | "descricao"
  | "observacao"
  | "notaFiscal"
  | "valor"
  | "nomeEscola"
  | "numeroSerie"
>;

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
  const [observacao, setObservacao] = useState(initial?.observacao ?? "");
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});
  const [notaFiscal, setNotaFiscal] = useState(initial?.notaFiscal ?? "");
  const [valor, setValor] = useState(initial?.valor ?? "");
  const [nomeEscola, setNomeEscola] = useState(initial?.nomeEscola ?? "");
  const [numeroSerie, setNumeroSerie] = useState(
    initial?.numeroSerie ?? "",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    onClearError?.();

    const parsed = createCapitalSchema.safeParse({
      nome,
      assetNum,
      descricao,
      observacao,
      notaFiscal,
      valor,
      nomeEscola,
      numeroSerie,
    });

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
    <main className="management-page">
      <div className="container management-form-container">
        <header className="management-header management-form-header">
          <div>
            <Link to="/capital" className="management-breadcrumb">
              <i className="bi bi-arrow-left me-1" aria-hidden="true" />
              Voltar aos itens
            </Link>
            <h1>{title}</h1>
            <p>Preencha os dados de identificação e registro do patrimônio.</p>
          </div>
        </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="management-form-card">
        <section className="management-form-section">
          <div className="management-form-section-heading">
            <span><i className="bi bi-info-circle" aria-hidden="true" /></span>
            <div>
              <h2>Identificação</h2>
              <p>Dados principais usados para localizar o item.</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-8">
          <label className="form-label" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            className={`form-control ${
              fieldErrors.nome ? "is-invalid" : ""
            }`}
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            maxLength={191}
            required
          />
          {fieldErrors.nome && (
            <div className="invalid-feedback">{fieldErrors.nome}</div>
          )}
            </div>

            <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="assetNum">
            Número patrimonial
          </label>
          <input
            id="assetNum"
            className={`form-control ${
              fieldErrors.assetNum ? "is-invalid" : ""
            }`}
            value={assetNum}
            onChange={(event) => setAssetNum(event.target.value)}
            maxLength={191}
            required
          />
          {fieldErrors.assetNum && (
            <div className="invalid-feedback">{fieldErrors.assetNum}</div>
          )}
            </div>

            <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="notaFiscal">
            Nota fiscal
          </label>
          <input
            id="notaFiscal"
            className={`form-control ${
              fieldErrors.notaFiscal ? "is-invalid" : ""
            }`}
            value={notaFiscal}
            onChange={(event) => setNotaFiscal(event.target.value)}
            maxLength={191}
            required
          />
          {fieldErrors.notaFiscal && (
            <div className="invalid-feedback">{fieldErrors.notaFiscal}</div>
          )}
            </div>

            <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="valor">
            Valor
          </label>
          <input
            id="valor"
            type="text"
            inputMode="decimal"
            className={`form-control ${
              fieldErrors.valor ? "is-invalid" : ""
            }`}
            value={valor}
            onChange={(event) => setValor(event.target.value)}
            required
          />
          {fieldErrors.valor && (
            <div className="invalid-feedback">{fieldErrors.valor}</div>
          )}
            </div>

            <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="nomeEscola">
            Nome da escola
          </label>
          <input
            id="nomeEscola"
            className={`form-control ${
              fieldErrors.nomeEscola ? "is-invalid" : ""
            }`}
            value={nomeEscola}
            onChange={(event) => setNomeEscola(event.target.value)}
            maxLength={191}
            required
          />
          {fieldErrors.nomeEscola && (
            <div className="invalid-feedback">
              {fieldErrors.nomeEscola}
            </div>
          )}
            </div>

            <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="numeroSerie">
            Número de série
          </label>
          <input
            id="numeroSerie"
            className={`form-control ${
              fieldErrors.numeroSerie ? "is-invalid" : ""
            }`}
            value={numeroSerie}
            onChange={(event) => setNumeroSerie(event.target.value)}
            maxLength={191}
            required
          />
          {fieldErrors.numeroSerie && (
            <div className="invalid-feedback">
              {fieldErrors.numeroSerie}
            </div>
          )}
            </div>
          </div>
        </section>

        <section className="management-form-section">
          <div className="management-form-section-heading">
            <span><i className="bi bi-text-paragraph" aria-hidden="true" /></span>
            <div>
              <h2>Detalhes adicionais</h2>
              <p>Inclua informações úteis para consultas futuras.</p>
            </div>
          </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            id="descricao"
            className={`form-control ${
              fieldErrors.descricao ? "is-invalid" : ""
            }`}
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            maxLength={191}
            rows={3}
          />
          <div className="form-text">{descricao.length}/191</div>
          {fieldErrors.descricao && (
            <div className="invalid-feedback d-block">
              {fieldErrors.descricao}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="observacao">
            Observação <span className="text-muted">(opcional)</span>
          </label>
          <textarea
            id="observacao"
            className={`form-control ${
              fieldErrors.observacao ? "is-invalid" : ""
            }`}
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            maxLength={191}
            rows={3}
          />
          <div className="form-text">{observacao.length}/191</div>
          {fieldErrors.observacao && (
            <div className="invalid-feedback d-block">
              {fieldErrors.observacao}
            </div>
          )}
        </div>
        </section>

        <div className="management-form-actions">
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Salvando..." : submitLabel}
            </button>
          </div>
        </div>
      </form>
      </div>
    </main>
  );
}