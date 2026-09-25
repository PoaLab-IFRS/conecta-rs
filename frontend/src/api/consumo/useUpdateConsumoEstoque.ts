import { useState } from "react";
import type {
  UpdateConsumoEstoqueInput,
  UpdateConsumoEstoqueResponse,
} from "../../models/consumo";
import { getErrorMessage } from "../parse";
import { updateConsumoEstoque } from "./updateConsumoEstoque";

type UseUpdateConsumoEstoqueResult = {
  update: (
    consumoId: number,
    input: UpdateConsumoEstoqueInput,
  ) => Promise<UpdateConsumoEstoqueResponse | null>;
  loading: boolean;
  error: string | null;
};

export function useUpdateConsumoEstoque(): UseUpdateConsumoEstoqueResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(consumoId: number, input: UpdateConsumoEstoqueInput) {
    setLoading(true);
    setError(null);

    try {
      return await updateConsumoEstoque(consumoId, input);
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao atualizar estoque"));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}
