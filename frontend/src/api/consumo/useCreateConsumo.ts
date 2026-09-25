import { useState } from "react";
import type {
  CreateConsumoConflict,
  CreateConsumoInput,
  CreateConsumoResponse,
} from "../../models/consumo";
import { getErrorMessage } from "../parse";
import { ConsumoDuplicadoError, createConsumo } from "./createConsumo";

type CreateConsumoResult =
  | { status: "created"; data: CreateConsumoResponse }
  | { status: "conflict"; conflict: CreateConsumoConflict }
  | { status: "error" };

type UseCreateConsumoResult = {
  create: (input: CreateConsumoInput) => Promise<CreateConsumoResult>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useCreateConsumo(): UseCreateConsumoResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function create(input: CreateConsumoInput): Promise<CreateConsumoResult> {
    setLoading(true);
    setError(null);

    try {
      const data = await createConsumo(input);
      return { status: "created", data };
    } catch (err) {
      if (err instanceof ConsumoDuplicadoError) {
        return { status: "conflict", conflict: err.conflict };
      }
      setError(getErrorMessage(err, "Falha ao criar consumo"));
      return { status: "error" };
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error, clearError };
}
