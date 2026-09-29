import {
    createCapitalResponseSchema,
    createCapitalSchema,
    type CreateCapitalInput,
    type CreateCapitalResponse,
} from "../../models/capital";
import { api } from "../client";
import { parseWithSchema } from "../parse";

export async function createCapital(
    input: CreateCapitalInput,
): Promise<CreateCapitalResponse> {
    const data = parseWithSchema(createCapitalSchema, input);
    const response = await api.post("/capitais", data);
    return parseWithSchema(createCapitalResponseSchema, response.data);
}