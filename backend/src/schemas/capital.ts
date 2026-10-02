import {z} from "zod";

export const listCapitalQuery = z.object({
  nome: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

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
        (value) => (value === "" || value === undefined ? null : value),
         z
         .string()
         .trim()
         .max(191, "Descrição deve ter no máximo 191 caracteres")
         .nullable()
        ),
});

export const capitalIdParam = z.object({
  id: z
  .string()
  .regex(/^\d+$/, "O id deve ser um número inteiro positivo")
  .transform(Number),
});

export const capitalResponseSchema = z.object({
  id: z.number(),
  nome: z.string(), 
  assetNum: z.string(),
  descricao: z.string().nullable(),
});

export const listCapitalResponseSchema = z.object({
  data: z.array(capitalResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const capitalErrorResponseSchema = z.object({
  error: z.string(),
}).loose();

export const deleteCapitalResponseSchema = z.undefined();

export type ListCapitalQuery = z.infer<typeof listCapitalQuery>;
export type CreateCapitalInput = z.infer<typeof createCapitalSchema>;