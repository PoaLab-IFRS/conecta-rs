import { consumoSchema, type Consumo } from "../../models/consumo";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function getConsumo(id: number): Promise<Consumo> {
  const response = await api.get(`/consumos/${id}`);
  return parseWithSchema(consumoSchema, response.data);
}
