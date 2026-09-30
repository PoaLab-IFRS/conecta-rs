import {
    listCapitalQuerySchema,
    listCapitalResponseSchema,
    type ListCapitalQuery,
    type ListCapitalResponse,
} from "../../models/capital";
import {api} from "../client";
import {parseWithSchema} from "../parse";

export async function listCapitais(
    query: ListCapitalQuery,
): Promise<ListCapitalResponse> {
    const params = parseWithSchema(listCapitalQuerySchema, query);
    const response = await api.get("/capitais", {params});
    return parseWithSchema(listCapitalResponseSchema, response.data);
}
