import axios from "axios";
import {
  createConsumoConflictSchema,
  createConsumoResponseSchema,
  createConsumoSchema,
  type CreateConsumoInput,
  type CreateConsumoResponse,
} from "../../models/consumo";
import { api } from "../client";
import { parseWithSchema } from "../parse";
import { ConsumoDuplicadoError } from "./createConsumo";

export async function updateConsumo(
  id: number,
  input: CreateConsumoInput,
): Promise<CreateConsumoResponse> {
  const body = parseWithSchema(createConsumoSchema, input);

  try {
    const response = await api.put(`/consumos/${id}`, body);
    return parseWithSchema(createConsumoResponseSchema, response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      const conflict = parseWithSchema(createConsumoConflictSchema, error.response.data);
      throw new ConsumoDuplicadoError(conflict);
    }
    throw error;
  }
}
