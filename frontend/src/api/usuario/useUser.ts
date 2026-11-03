
import { useEffect, useState } from "react";
import type { User } from "../../models/usuario";
import { getErrorMessage } from "../parse";
import { getUser } from "./getUser";

type UseUserResult = {
  data: User | null;
  loading: boolean;
  error: string | null;
};

export function useUser(id: number | null): UseUserResult {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const userId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getUser(userId);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Erro ao carregar o usuário"));
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