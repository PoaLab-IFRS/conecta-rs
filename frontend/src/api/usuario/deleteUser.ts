import { api } from "../client";

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/user/${id}`);
}