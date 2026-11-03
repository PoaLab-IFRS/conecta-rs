import {
    listUserQuerySchema,
    listUserResponseSchema,
    type ListUserQuery,
    type ListUserResponse,
} from "../../models/usuario";
import {api} from "../client";
import {parseWithSchema} from "../parse";

export async function listUser(
    query: ListUserQuery,
): Promise<ListUserResponse> {
    const params = parseWithSchema(listUserQuerySchema, query);
    const response = await api.get("/user", {params});
    return parseWithSchema(listUserResponseSchema, response.data);
}
