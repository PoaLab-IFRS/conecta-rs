import { listAtributoValoresResponseSchema } from "../../models/atributo";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function listAtributoValores(atributoId: number): Promise<string[]> {
  const response = await api.get(`/atributos/${atributoId}/valores`);
  return parseWithSchema(listAtributoValoresResponseSchema, response.data);
}
