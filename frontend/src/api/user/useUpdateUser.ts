import { useState } from "react";
import type {
  UpdateUserInput,
  User,
} from "../../models/user";
import { getErrorMessage } from "../parse";
import { updateUser } from "./updateUser";

type UpdateUserResult =
  | { status: "updated"; data: User }
  | { status: "error" };

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function update(
    id: string,
    input: UpdateUserInput,
  ): Promise<UpdateUserResult> {
    setLoading(true);
    setError(null);

    try {
      const data = await updateUser(id, input);
      return { status: "updated", data };
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao atualizar usuário"));
      return { status: "error" };
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error, clearError };
}