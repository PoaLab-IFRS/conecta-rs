import { useEffect, useState } from "react";
import type { User } from "../../models/user";
import { getErrorMessage } from "../parse";
import { getUser } from "./getUser";

type UseUserResult = {
  data: User | null;
  loading: boolean;
  error: string | null;
};

export function useUser(id: string | null): UseUserResult {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setData(null);
        setLoading(false);
        setError("ID de usuário inválido.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getUser(id);

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(getErrorMessage(err, "Falha ao carregar usuário"));
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