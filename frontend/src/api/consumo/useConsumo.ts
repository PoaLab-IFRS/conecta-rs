import { useEffect, useState } from "react";
import type { Consumo } from "../../models/consumo";
import { getErrorMessage } from "../parse";
import { getConsumo } from "./getConsumo";

type UseConsumoResult = {
  data: Consumo | null;
  loading: boolean;
  error: string | null;
};

export function useConsumo(id: number | null): UseConsumoResult {
  const [data, setData] = useState<Consumo | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getConsumo(id!);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Falha ao carregar consumo"));
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
