import {
  createUserResponseSchema,
  createUserSchema,
  type CreateUserInput,
  type CreateUserResponse,
} from "../../models/user";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function createUser(
  input: CreateUserInput,
): Promise<CreateUserResponse> {
  const data = parseWithSchema(createUserSchema, input);

  const response = await api.post("/users", data);

  return parseWithSchema(createUserResponseSchema, response.data);
}