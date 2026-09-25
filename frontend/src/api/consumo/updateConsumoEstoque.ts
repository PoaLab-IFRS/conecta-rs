import {
  updateConsumoEstoqueResponseSchema,
  updateConsumoEstoqueSchema,
  type UpdateConsumoEstoqueInput,
  type UpdateConsumoEstoqueResponse,
} from "../../models/consumo";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function updateConsumoEstoque(
  consumoId: number,
  input: UpdateConsumoEstoqueInput,
): Promise<UpdateConsumoEstoqueResponse> {
  const body = parseWithSchema(updateConsumoEstoqueSchema, input);
  const response = await api.patch(`/consumos/${consumoId}/estoque`, body);
  return parseWithSchema(updateConsumoEstoqueResponseSchema, response.data);
}
