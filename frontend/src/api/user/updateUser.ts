import {
  updateUserSchema,
  userSchema,
  type UpdateUserInput,
  type User,
} from "../../models/user";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  const body = parseWithSchema(updateUserSchema, input);
  const response = await api.put(`/users/${id}`, body);
  return parseWithSchema(userSchema, response.data);
}