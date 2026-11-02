import { z } from "zod";

export const createProfileRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(191, "Nome deve ter no máximo 191 caracteres"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("E-mail inválido")),
});

export const profileRequestIdParam = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "O id deve ser um número inteiro positivo")
    .transform(Number)
    .pipe(z.number().int().positive()),
});

export const reviewProfileRequestSchema = z.object({
  status: z.enum(["APROVADA", "REJEITADA"]),
});

export type CreateProfileRequestInput = z.infer<
  typeof createProfileRequestSchema
>;

export type ReviewProfileRequestInput = z.infer<
  typeof reviewProfileRequestSchema
>;