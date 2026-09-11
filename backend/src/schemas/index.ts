import { z } from "zod";
import { Prisma } from "@prisma/client";
import type { TipoValor } from "@prisma/client";

export const bigIntId = z
  .string()
  .regex(/^\d+$/, "Must be a positive integer id")
  .transform((value) => BigInt(value));

export const idParam = z.object({
  id: bigIntId,
});

export const idAndAtributoParam = z.object({
  id: bigIntId,
  atributoId: bigIntId,
});

export const userIdParam = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Must be a positive integer id")
    .transform((value) => Number(value)),
});

export const tipoMaterialSchema = z.enum(["CAPITAL", "CONSUMIVEL"]);
export const tipoValorSchema = z.enum(["TEXTO", "INTEIRO", "DECIMAL", "BOOLEANO"]);

export const createMaterialSchema = z.object({
  nome: z.string().trim().min(1),
  descricao: z.string().nullable().optional(),
  tipo: tipoMaterialSchema,
});

export const updateMaterialSchema = z
  .object({
    nome: z.string().trim().min(1).optional(),
    descricao: z.string().nullable().optional(),
    tipo: tipoMaterialSchema.optional(),
  })
  .refine(
    (data) => data.nome !== undefined || data.descricao !== undefined || data.tipo !== undefined,
    { message: "At least one field is required" },
  );

export const linkAtributoSchema = z.object({
  atributoId: z.coerce.bigint(),
});

export const createVarianteSchema = z.object({
  quantidadeInicial: z.number().int().nonnegative().optional().default(0),
});

export const createAtributoSchema = z.object({
  nome: z.string().trim().min(1),
  tipoValor: tipoValorSchema,
});

export const updateAtributoSchema = z
  .object({
    nome: z.string().trim().min(1).optional(),
    tipoValor: tipoValorSchema.optional(),
  })
  .refine((data) => data.nome !== undefined || data.tipoValor !== undefined, {
    message: "At least one field is required",
  });

export const updateEstoqueSchema = z.object({
  quantidade: z.number().int().nonnegative(),
});

export const createItemCapitalSchema = z.object({
  numeroPatrimonio: z.string().trim().min(1),
  dataBaixa: z.coerce.date().nullable().optional(),
});

export const updateItemCapitalSchema = z
  .object({
    numeroPatrimonio: z.string().trim().min(1).optional(),
    dataBaixa: z.coerce.date().nullable().optional(),
  })
  .refine((data) => data.numeroPatrimonio !== undefined || data.dataBaixa !== undefined, {
    message: "At least one field is required",
  });

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
});

export const updateUserSchema = z
  .object({
    email: z.email().optional(),
    name: z.string().nullable().optional(),
  })
  .refine((data) => data.email !== undefined || data.name !== undefined, {
    message: "At least one field is required",
  });

export type ValorAtributoFields = {
  valorTexto: string | null;
  valorInteiro: bigint | null;
  valorDecimal: Prisma.Decimal | null;
  valorBooleano: boolean | null;
};

const emptyValores: ValorAtributoFields = {
  valorTexto: null,
  valorInteiro: null,
  valorDecimal: null,
  valorBooleano: null,
};

const inteiroSchema = z
  .union([z.bigint(), z.number().int(), z.string()])
  .transform((value, ctx) => {
    try {
      return BigInt(value);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "valorInteiro must be an integer",
      });
      return z.NEVER;
    }
  });

const decimalSchema = z.union([z.string(), z.number()]).transform((value, ctx) => {
  try {
    return new Prisma.Decimal(value);
  } catch {
    ctx.addIssue({
      code: "custom",
      message: "valorDecimal must be a number",
    });
    return z.NEVER;
  }
});

export function valorAtributoSchema(tipoValor: TipoValor): z.ZodType<ValorAtributoFields> {
  switch (tipoValor) {
    case "TEXTO":
      return z.object({ valorTexto: z.string() }).transform((data): ValorAtributoFields => ({
        ...emptyValores,
        valorTexto: data.valorTexto,
      }));
    case "INTEIRO":
      return z.object({ valorInteiro: inteiroSchema }).transform((data): ValorAtributoFields => ({
        ...emptyValores,
        valorInteiro: data.valorInteiro,
      }));
    case "DECIMAL":
      return z.object({ valorDecimal: decimalSchema }).transform((data): ValorAtributoFields => ({
        ...emptyValores,
        valorDecimal: data.valorDecimal,
      }));
    case "BOOLEANO":
      return z.object({ valorBooleano: z.boolean() }).transform((data): ValorAtributoFields => ({
        ...emptyValores,
        valorBooleano: data.valorBooleano,
      }));
  }
}
