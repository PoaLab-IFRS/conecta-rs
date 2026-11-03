import { useState } from "react";
import type {
  CreateUserInput,
  CreateUserResponse,
} from "../../models/usuario";
import { getErrorMessage } from "../parse";
import { createUser } from "./createUser";

type CreateUserResult =
  | { status: "created"; data: CreateUserResponse }
  | { status: "error" };

type UseCreateUserResult = {
  create: (input: CreateUserInput) => Promise<CreateUserResult>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useCreateUser(): UseCreateUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function create(input: CreateUserInput): Promise<CreateUserResult> {
    setLoading(true);
    setError(null);

    try {
      const result = await createUser(input);
      return { status: "created", data: result };
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao criar o usuário"));
      return { status: "error" };
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error, clearError };
}