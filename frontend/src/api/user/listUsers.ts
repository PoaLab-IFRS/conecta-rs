import {
    userResponseSchema,
  type UserResponse,
} from "../../models/user";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function listUsers(): Promise<UserResponse> {
  const response = await api.get("/users");

  return parseWithSchema(userResponseSchema, response.data);
}