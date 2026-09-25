import { useEffect, useState } from "react";
import { getErrorMessage } from "../parse";
import { listAtributoValores } from "./listAtributoValores";

type UseAtributoValoresResult = {
  data: string[];
  loading: boolean;
  error: string | null;
};

export function useAtributoValores(atributoId?: number): UseAtributoValoresResult {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!atributoId) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await listAtributoValores(atributoId!);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Falha ao carregar valores"));
          setData([]);
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
  }, [atributoId]);

  return { data, loading, error };
}
