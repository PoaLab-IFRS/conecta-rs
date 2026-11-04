import { z } from "zod";
import { paginatedResponseSchema, paginationQuerySchema } from "./pagination";

const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} é obrigatório`)
    .max(191, `${label} deve ter no máximo 191 caracteres`);

export const tipoUserSchema = z.enum([
  "ADMIN",
  "PROFESSOR",
  "USUARIO",
]);

export const userSchema = z.object({
    id: z.number().int(),
    email: z.string().email(),
    name: z.string(),
    senha: z.string().optional(),
    tipoUser: tipoUserSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const listUserQuerySchema = paginationQuerySchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  tipoUser: tipoUserSchema.optional(),
});

export const listUserResponseSchema = paginatedResponseSchema(userSchema);

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .max(191, "E-mail deve ter no máximo 191 caracteres"),
  name: requiredText("Nome"),
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  tipoUser: tipoUserSchema,
});

export const createUserResponseSchema = userSchema;

export type TipoUser = z.infer<typeof tipoUserSchema>;
export type User = z.infer<typeof userSchema>;
export type ListUserQuery = z.infer<typeof listUserQuerySchema>;
export type ListUserResponse = z.infer<typeof listUserResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;