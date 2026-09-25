import { z } from "zod";

export const tipoValorEnum = z.enum(["TEXTO", "INTEIRO", "DECIMAL", "BOOLEANO"]);

export const listAtributoQuery = z.object({
  nome: z.string().optional(),
});

export const atributoIdParam = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "O id deve ser um número inteiro positivo")
    .transform((value) => Number(value)),
});

export type ListAtributoQuery = z.infer<typeof listAtributoQuery>;
