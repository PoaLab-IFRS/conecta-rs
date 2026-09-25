import { useState } from "react";
import type {
  CreateConsumoConflict,
  CreateConsumoInput,
  CreateConsumoResponse,
} from "../../models/consumo";
import { getErrorMessage } from "../parse";
import { ConsumoDuplicadoError } from "./createConsumo";
import { updateConsumo } from "./updateConsumo";

type UpdateConsumoResult =
  | { status: "updated"; data: CreateConsumoResponse }
  | { status: "conflict"; conflict: CreateConsumoConflict }
  | { status: "error" };

type UseUpdateConsumoResult = {
  update: (id: number, input: CreateConsumoInput) => Promise<UpdateConsumoResult>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useUpdateConsumo(): UseUpdateConsumoResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function update(id: number, input: CreateConsumoInput): Promise<UpdateConsumoResult> {
    setLoading(true);
    setError(null);

    try {
      const data = await updateConsumo(id, input);
      return { status: "updated", data };
    } catch (err) {
      if (err instanceof ConsumoDuplicadoError) {
        return { status: "conflict", conflict: err.conflict };
      }
      setError(getErrorMessage(err, "Falha ao atualizar consumo"));
      return { status: "error" };
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error, clearError };
}
