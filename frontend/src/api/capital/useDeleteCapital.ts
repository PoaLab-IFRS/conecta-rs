import { useState } from "react";
import { getErrorMessage } from "../parse";
import { deleteCapital } from "./deleteCapital";

type UseDeleteCapitalResult = {
  remove: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export function useDeleteCapital(): UseDeleteCapitalResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: number): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      await deleteCapital(id);
      return true;
        } catch (err) {
            setError(getErrorMessage(err, "Falha ao remover capital"));
            return false;
        } finally {
            setLoading(false);
        } 
    }
return { remove, loading, error };
}
