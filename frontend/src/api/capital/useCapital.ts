import { useEffect, useState } from "react";
import type { Capital } from "../../models/capital";
import { getErrorMessage } from "../parse";
import { getCapital } from "./getCapital";

type UseCapitalResult = {
  data: Capital | null;
  loading: boolean;
  error: string | null;
};

export function useCapital(id: number | null): UseCapitalResult {
  const [data, setData] = useState<Capital | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const capitalId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getCapital(capitalId);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Erro ao carregar a capital"));
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}