import { useState } from "react";
import { getErrorMessage } from "../parse";
import { deleteUser } from "./deleteUser";

type UseDeleteUserResult = {
  remove: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export function useDeleteUser(): UseDeleteUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: number): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      await deleteUser(id);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao remover usuário"));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}