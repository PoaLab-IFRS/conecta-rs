import { useState } from "react";
import { getErrorMessage } from "../parse";
import { deleteUser } from "./deleteUser";

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: string): Promise<boolean> {
    setLoading(true);
    setError(null);

    try {
      await deleteUser(id);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao excluir usuário"));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}