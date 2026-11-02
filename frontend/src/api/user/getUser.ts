import { userSchema, type User } from "../../models/user";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function getUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return parseWithSchema(userSchema, response.data);
}