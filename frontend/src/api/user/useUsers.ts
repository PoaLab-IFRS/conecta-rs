import { useCallback, useEffect, useState } from "react";
import type { UserResponse } from "../../models/user";
import { getErrorMessage } from "../parse";
import { listUsers } from "./listUsers";

type UseUsersResult = {
  data: UserResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useUsers(): UseUsersResult {
  const [data, setData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await listUsers();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Falha ao carregar usuários"));
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
  }, [reloadToken]);

  return { data, loading, error, reload };
}