import { api } from "../client";

export async function deleteCapital(id: number): Promise<void> {
  await api.delete(`/capitais/${id}`);
}