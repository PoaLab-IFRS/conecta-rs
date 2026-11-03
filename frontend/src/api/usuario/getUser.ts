import { userSchema, type User } from "../../models/usuario";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function getUser(id: number): Promise<User> {
  const response = await api.get(`/user/${id}`);
  return parseWithSchema(userSchema, response.data);
}