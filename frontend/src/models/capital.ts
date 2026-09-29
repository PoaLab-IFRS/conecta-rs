import {z} from "zod";
import {paginatedResponseSchema, paginationQuerySchema} from "./pagination";

export const capitalSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  assetNum: z.string(),
  descricao: z.string().nullable(),
});

export const listCapitalQuerySchema = paginationQuerySchema.extend({
  nome: z.string().optional(),
});

export const listCapitalResponseSchema = paginatedResponseSchema(capitalSchema);

export const createCapitalSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome da capital é obrigatório")
    .max(191, "Nome da capital deve ter no máximo 191 caracteres"),
  assetNum: z
    .string()
    .trim()
    .min(1, "Número patrimonial é obrigatório")
    .max(191, "Número patrimonial deve ter no máximo 191 caracteres"),
  descricao: z.preprocess(
    (value: unknown) => (value === "" || value === undefined ? null : value),
    z.string().trim().max(191, "Descrição deve ter no máximo 191 caracteres").nullable()
  ),
});

export const createCapitalResponseSchema = capitalSchema;

export type Capital = z.infer<typeof capitalSchema>;
export type ListCapitalQuery = z.infer<typeof listCapitalQuerySchema>;
export type ListCapitalResponse = z.infer<typeof listCapitalResponseSchema>;
export type CreateCapitalInput = z.infer<typeof createCapitalSchema>;
export type CreateCapitalResponse = z.infer<typeof createCapitalResponseSchema>;