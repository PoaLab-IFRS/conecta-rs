import { useEffect, useState } from "react";
import { useUpdateConsumoEstoque } from "../api/consumo/useUpdateConsumoEstoque";
import { updateConsumoEstoqueSchema } from "../models/consumo";

type EstoqueEditorProps = {
  consumoId: number;
  quantidadeInicial: number;
  onSaved: (quantidade: number) => void;
};

export function EstoqueEditor({ consumoId, quantidadeInicial, onSaved }: EstoqueEditorProps) {
  const [valor, setValor] = useState(String(quantidadeInicial));
  const [formError, setFormError] = useState<string | null>(null);
  const { update, loading, error } = useUpdateConsumoEstoque();

  useEffect(() => {
    setValor(String(quantidadeInicial));
    setFormError(null);
  }, [consumoId, quantidadeInicial]);

  function adjust(delta: number) {
    const parsed = Number.parseInt(valor, 10);
    const current = Number.isInteger(parsed) ? parsed : quantidadeInicial;
    setValor(String(Math.max(0, current + delta)));
    setFormError(null);
  }

  async function handleSave() {
    setFormError(null);
    const parsed = updateConsumoEstoqueSchema.safeParse({ quantidade: valor });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Quantidade inválida");
      return;
    }

    const result = await update(consumoId, parsed.data);
    if (result) {
      setValor(String(result.quantidade));
      onSaved(result.quantidade);
    }
  }

  return (
    <div
      className="d-flex flex-column align-items-end"
      onClick={(event) => event.stopPropagation()}
    >
      <label className="form-label">Estoque</label>
      <div className="input-group" style={{ maxWidth: "220px" }}>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => adjust(-1)}
          aria-label="Diminuir quantidade"
          disabled={loading}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          step={1}
          className="form-control text-center input-no-spin"
          value={valor}
          onChange={(event) => {
            setValor(event.target.value);
            setFormError(null);
          }}
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => adjust(1)}
          aria-label="Aumentar quantidade"
          disabled={loading}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm mt-2"
        onClick={() => void handleSave()}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
      {(formError || error) && (
        <div className="text-danger small mt-2 text-end">{formError ?? error}</div>
      )}
    </div>
  );
}
