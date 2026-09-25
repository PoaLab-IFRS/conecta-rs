import {
  listAtributosQuerySchema,
  listAtributosResponseSchema,
  type Atributo,
  type ListAtributosQuery,
} from "../../models/atributo";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function listAtributos(query: ListAtributosQuery = {}): Promise<Atributo[]> {
  const params = parseWithSchema(listAtributosQuerySchema, query);
  const response = await api.get("/atributos", { params });
  return parseWithSchema(listAtributosResponseSchema, response.data);
}
