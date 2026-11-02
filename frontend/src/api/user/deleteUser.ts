import { api } from "../client";

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}