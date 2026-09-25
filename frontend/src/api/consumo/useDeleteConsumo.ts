import { useState } from "react";
import { getErrorMessage } from "../parse";
import { deleteConsumo } from "./deleteConsumo";

type UseDeleteConsumoResult = {
  remove: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export function useDeleteConsumo(): UseDeleteConsumoResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: number) {
    setLoading(true);
    setError(null);

    try {
      await deleteConsumo(id);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao remover consumo"));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}
