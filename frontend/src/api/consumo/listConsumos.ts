import {
  listConsumosQuerySchema,
  listConsumosResponseSchema,
  type ListConsumosQuery,
  type ListConsumosResponse,
} from "../../models/consumo";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function listConsumos(query: ListConsumosQuery): Promise<ListConsumosResponse> {
  const params = parseWithSchema(listConsumosQuerySchema, query);
  const response = await api.get("/consumos", { params });
  return parseWithSchema(listConsumosResponseSchema, response.data);
}
