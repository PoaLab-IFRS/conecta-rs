import { z } from "zod";
import { paginatedResponseSchema, paginationQuerySchema } from "./pagination";

export const tipoValorSchema = z.enum(["TEXTO", "INTEIRO", "DECIMAL", "BOOLEANO"]);

export const atributoValorSchema = z.object({
  nome: z.string(),
  tipoValor: tipoValorSchema,
  valor: z.union([z.string(), z.number(), z.boolean(), z.null()]),
});

export const consumoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  descricao: z.string().nullable(),
  quantidadeEstoque: z.number().int(),
  atributos: z.array(atributoValorSchema),
});

export const listConsumosQuerySchema = paginationQuerySchema.extend({
  nome: z.string().optional(),
});

export const listConsumosResponseSchema = paginatedResponseSchema(consumoSchema);

export const createConsumoAtributoSchema = z
  .object({
    atributoId: z.number().int().positive().optional(),
    nome: z
      .string()
      .trim()
      .min(1, "Nome do atributo é obrigatório")
      .max(191, "Nome do atributo deve ter no máximo 191 caracteres")
      .optional(),
    tipoValor: tipoValorSchema.optional(),
    valor: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  })
  .superRefine((data, ctx) => {
    if (!data.atributoId && !data.nome) {
      ctx.addIssue({
        code: "custom",
        message: "Selecione ou informe um atributo",
        path: ["nome"],
      });
    }
    if (!data.atributoId && !data.tipoValor) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o tipo do novo atributo",
        path: ["tipoValor"],
      });
    }
    if (data.tipoValor === "INTEIRO" && data.valor !== null && data.valor !== "") {
      const parsed = typeof data.valor === "number" ? data.valor : Number(data.valor);
      if (!Number.isInteger(parsed)) {
        ctx.addIssue({ code: "custom", message: "Valor inteiro inválido", path: ["valor"] });
      }
    }
    if (data.tipoValor === "DECIMAL" && data.valor !== null && data.valor !== "") {
      const parsed = typeof data.valor === "number" ? data.valor : Number(data.valor);
      if (Number.isNaN(parsed)) {
        ctx.addIssue({ code: "custom", message: "Valor decimal inválido", path: ["valor"] });
      }
    }
  });

export const createConsumoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(191, "Nome deve ter no máximo 191 caracteres"),
  descricao: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z
      .string()
      .trim()
      .max(191, "Descrição deve ter no máximo 191 caracteres")
      .nullable(),
  ),
  quantidade: z.coerce.number().int().min(0, "Quantidade não pode ser negativa"),
  atributos: z.array(createConsumoAtributoSchema).default([]),
  forceCreate: z.boolean().optional().default(false),
});

export const createConsumoResponseSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  descricao: z.string().nullable(),
});

export const consumoExistenteSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  quantidadeEstoque: z.number().int(),
  atributos: z.array(atributoValorSchema),
});

export const createConsumoConflictSchema = z.object({
  error: z.string(),
  tipo: z.enum(["exato", "parcial"]),
  motivo: z.enum(["extras_no_novo", "subconjunto_do_existente"]).optional(),
  consumoExistente: consumoExistenteSchema,
});

export const updateConsumoEstoqueSchema = z.object({
  quantidade: z.coerce.number().int().min(0, "Quantidade deve ser um inteiro ≥ 0"),
});

export const updateConsumoEstoqueResponseSchema = z.object({
  consumoId: z.number().int(),
  quantidade: z.number().int(),
});

export type TipoValor = z.infer<typeof tipoValorSchema>;
export type AtributoValor = z.infer<typeof atributoValorSchema>;
export type Consumo = z.infer<typeof consumoSchema>;
export type ListConsumosQuery = z.infer<typeof listConsumosQuerySchema>;
export type ListConsumosResponse = z.infer<typeof listConsumosResponseSchema>;
export type CreateConsumoInput = z.infer<typeof createConsumoSchema>;
export type CreateConsumoResponse = z.infer<typeof createConsumoResponseSchema>;
export type ConsumoExistente = z.infer<typeof consumoExistenteSchema>;
export type CreateConsumoConflict = z.infer<typeof createConsumoConflictSchema>;
export type UpdateConsumoEstoqueInput = z.infer<typeof updateConsumoEstoqueSchema>;
export type UpdateConsumoEstoqueResponse = z.infer<typeof updateConsumoEstoqueResponseSchema>;
