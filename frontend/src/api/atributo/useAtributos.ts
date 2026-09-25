import { useCallback, useEffect, useState } from "react";
import type { Atributo, ListAtributosQuery } from "../../models/atributo";
import { getErrorMessage } from "../parse";
import { listAtributos } from "./listAtributos";

type UseAtributosResult = {
  data: Atributo[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useAtributos(query: ListAtributosQuery = {}): UseAtributosResult {
  const [data, setData] = useState<Atributo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const nome = query.nome;

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await listAtributos({ nome });
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Falha ao carregar atributos"));
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
  }, [nome, reloadToken]);

  return { data, loading, error, reload };
}
