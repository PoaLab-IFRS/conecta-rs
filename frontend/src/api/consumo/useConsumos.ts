import { useCallback, useEffect, useState } from "react";
import type { ListConsumosQuery, ListConsumosResponse } from "../../models/consumo";
import { getErrorMessage } from "../parse";
import { listConsumos } from "./listConsumos";

type UseConsumosResult = {
  data: ListConsumosResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useConsumos(query: ListConsumosQuery): UseConsumosResult {
  const [data, setData] = useState<ListConsumosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const nome = query.nome;
  const page = query.page;
  const pageSize = query.pageSize;

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await listConsumos({ nome, page, pageSize });
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Falha ao carregar consumos"));
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
  }, [nome, page, pageSize, reloadToken]);

  return { data, loading, error, reload };
}
