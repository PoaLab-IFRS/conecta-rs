import { z } from "zod";

export const tipoUserSchema = z.enum([
  "ADMIN",
  "PROFESSOR",
  "USUARIO",
]);

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  tipoUser: tipoUserSchema,
});

export const userResponseSchema = z.array(userSchema);

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido"),

  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(191, "Nome deve ter no máximo 191 caracteres"),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(128, "A senha deve ter no máximo 128 caracteres"),

  tipoUser: tipoUserSchema,
});

export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string().nullable().optional(),
  tipoUser: tipoUserSchema,
});

export const updateUserSchema = z.object({
  email: z.string().trim().email("E-mail inválido").optional(),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  tipoUser: tipoUserSchema,
});

export type TipoUser = z.infer<typeof tipoUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;