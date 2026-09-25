import { z } from "zod";
import { tipoValorEnum } from "./atributo.js";

export const listConsumoQuery = z.object({
  nome: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const createConsumoAtributoSchema = z
  .object({
    atributoId: z.number().int().positive().optional(),
    nome: z
      .string()
      .trim()
      .min(1, "Nome do atributo é obrigatório")
      .max(191, "Nome do atributo deve ter no máximo 191 caracteres")
      .optional(),
    tipoValor: tipoValorEnum.optional(),
    valor: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  })
  .superRefine((data, ctx) => {
    if (!data.atributoId && !data.nome) {
      ctx.addIssue({
        code: "custom",
        message: "Informe um atributo existente ou o nome de um novo",
        path: ["nome"],
      });
    }
    if (!data.atributoId && !data.tipoValor) {
      ctx.addIssue({
        code: "custom",
        message: "O tipo do valor é obrigatório para atributo novo",
        path: ["tipoValor"],
      });
    }

    if (data.tipoValor === "INTEIRO" && data.valor !== null && data.valor !== "") {
      const parsed = typeof data.valor === "number" ? data.valor : Number(data.valor);
      if (!Number.isInteger(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: "Valor inteiro inválido",
          path: ["valor"],
        });
      }
    }

    if (data.tipoValor === "DECIMAL" && data.valor !== null && data.valor !== "") {
      const parsed = typeof data.valor === "number" ? data.valor : Number(data.valor);
      if (Number.isNaN(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: "Valor decimal inválido",
          path: ["valor"],
        });
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
  quantidade: z.number().int().min(0, "Quantidade não pode ser negativa"),
  atributos: z.array(createConsumoAtributoSchema).default([]),
  forceCreate: z.boolean().optional().default(false),
});

export const consumoIdParam = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "O id deve ser um número inteiro positivo")
    .transform((value) => Number(value)),
});

export const updateConsumoEstoqueSchema = z.object({
  quantidade: z.number().int().min(0, "Quantidade não pode ser negativa"),
});

export type ListConsumoQuery = z.infer<typeof listConsumoQuery>;
export type CreateConsumoInput = z.infer<typeof createConsumoSchema>;
export type UpdateConsumoEstoqueInput = z.infer<typeof updateConsumoEstoqueSchema>;
