import { useState } from "react";
import type {
  CreateCapitalInput,
  CreateCapitalResponse,
} from "../../models/capital";
import { getErrorMessage } from "../parse";
import { createCapital } from "./createCapital";

type CreateCapitalResult =
  | { status: "created"; data: CreateCapitalResponse }
  | { status: "error" };

type UseCreateCapitalResult = {
  create: (input: CreateCapitalInput) => Promise<CreateCapitalResult>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useCreateCapital(): UseCreateCapitalResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function create(input: CreateCapitalInput): Promise<CreateCapitalResult> {
    setLoading(true);
    setError(null);

    try {
      const result = await createCapital(input);
      return { status: "created", data: result };
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao criar o capital"));
      return { status: "error" };
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error, clearError };
}
