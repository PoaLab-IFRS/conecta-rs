import axios from "axios";
import {
  createConsumoConflictSchema,
  createConsumoResponseSchema,
  createConsumoSchema,
  type CreateConsumoConflict,
  type CreateConsumoInput,
  type CreateConsumoResponse,
} from "../../models/consumo";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export class ConsumoDuplicadoError extends Error {
  readonly conflict: CreateConsumoConflict;

  constructor(conflict: CreateConsumoConflict) {
    super(conflict.error);
    this.name = "ConsumoDuplicadoError";
    this.conflict = conflict;
  }
}

export async function createConsumo(input: CreateConsumoInput): Promise<CreateConsumoResponse> {
  const body = parseWithSchema(createConsumoSchema, input);

  try {
    const response = await api.post("/consumos", body);
    return parseWithSchema(createConsumoResponseSchema, response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      const conflict = parseWithSchema(createConsumoConflictSchema, error.response.data);
      throw new ConsumoDuplicadoError(conflict);
    }
    throw error;
  }
}
