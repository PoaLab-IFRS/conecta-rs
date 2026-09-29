import { capitalSchema, type Capital } from "../../models/capital";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function getCapital(id: number): Promise<Capital> {
  const response = await api.get(`/capitais/${id}`);
  return parseWithSchema(capitalSchema, response.data);
}