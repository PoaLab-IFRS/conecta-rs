import axios from "axios";
import type { z } from "zod";

export function parseWithSchema<T>(schema: z.ZodType<T>, value: unknown): T {
  return schema.parse(value);
}

export function getErrorMessage(error: unknown, fallback = "Erro inesperado"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    if (data?.error) {
      return data.error;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
