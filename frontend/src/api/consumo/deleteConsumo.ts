import { api } from "../client";

export async function deleteConsumo(id: number): Promise<void> {
  await api.delete(`/consumos/${id}`);
}
