import { useState } from "react";
import type {
  CreateCapitalInput,
  CreateCapitalResponse,
} from "../../models/capital";
import { getErrorMessage } from "../parse";
import { updateCapital } from "./updateCapital";

type UpdateCapitalResult =
  | { status: "updated"; data: CreateCapitalResponse }
  | { status: "error" };

type UseUpdateCapitalResult = {
  update: (id: number, input: CreateCapitalInput) => Promise<UpdateCapitalResult>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useUpdateCapital(): UseUpdateCapitalResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function update(
    id: number, 
    input: CreateCapitalInput
): Promise<UpdateCapitalResult> {
    setLoading(true);
    setError(null);

    try {
      const data = await updateCapital(id, input);
      return { status: "updated", data };
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao atualizar capital"));
      return { status: "error" };
    } finally {
      setLoading(false);
    }
}
return { update, loading, error, clearError };
}