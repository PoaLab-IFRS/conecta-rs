import {
    createCapitalResponseSchema,
    createCapitalSchema,
    type CreateCapitalInput,
    type CreateCapitalResponse,
} from "../../models/capital";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function updateCapital(
    id: number,
    input: CreateCapitalInput
): Promise<CreateCapitalResponse> {
    const body = parseWithSchema(createCapitalSchema, input);
    const response = await api.put(`/capitais/${id}`, body);
    return parseWithSchema(createCapitalResponseSchema, response.data);
}