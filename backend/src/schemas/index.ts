import { z } from "zod";

export const userIdParam = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "O id deve ser um número inteiro positivo")
    .transform((value) => Number(value)),
});

export const createUserSchema = z.object({
  email: z.email("E-mail inválido"),
  name: z.string().optional(),
});

export const updateUserSchema = z
  .object({
    email: z.email("E-mail inválido").optional(),
    name: z.string().nullable().optional(),
  })
  .refine((data) => data.email !== undefined || data.name !== undefined, {
    message: "Pelo menos um campo é obrigatório",
  });
