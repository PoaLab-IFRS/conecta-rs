import { useState } from "react";
import type {
  CreateUserInput,
  CreateUserResponse,
} from "../../models/usuario";
import { getErrorMessage } from "../parse";
import { updateUser } from "./updateUser";

type UpdateUserResult =
  | { status: "updated"; data: CreateUserResponse }
  | { status: "error" };

type UseUpdateUserResult = {
  update: (id: number, input: CreateUserInput) => Promise<UpdateUserResult>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useUpdateUser(): UseUpdateUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function update(
    id: number,
    input: CreateUserInput
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