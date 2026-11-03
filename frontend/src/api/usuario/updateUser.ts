import {
    createUserResponseSchema,
    createUserSchema,
    type CreateUserInput,
    type CreateUserResponse,
} from "../../models/usuario";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function updateUser(
    id: number,
    input: CreateUserInput
): Promise<CreateUserResponse> {
    const body = parseWithSchema(createUserSchema, input);
    const response = await api.put(`/user/${id}`, body);
    return parseWithSchema(createUserResponseSchema, response.data);
}