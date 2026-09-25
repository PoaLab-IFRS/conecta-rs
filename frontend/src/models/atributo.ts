import { z } from "zod";
import { tipoValorSchema } from "./consumo";

export const atributoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  tipoValor: tipoValorSchema,
});

export const listAtributosQuerySchema = z.object({
  nome: z.string().optional(),
});

export const listAtributosResponseSchema = z.array(atributoSchema);

export const listAtributoValoresResponseSchema = z.array(z.string());

export type Atributo = z.infer<typeof atributoSchema>;
export type ListAtributosQuery = z.infer<typeof listAtributosQuerySchema>;
