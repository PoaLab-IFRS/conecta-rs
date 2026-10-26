
import { z } from "zod";

export const tipoUserSchema = z.enum([
  "ADMIN",
  "PROFESSOR",
  "USUARIO",
]);

const requiredText = (label: string) =>
  z.preprocess(
    (value) =>
      value === "" || value === undefined ? null : value,
    z
      .string()
      .trim()
      .min(1, `${label} é obrigatório preencher esse campo`)
      .max(191, `${label} deve ter no máximo 191 caracteres`)
  );

export const listUserQuery = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  tipoUser: tipoUserSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const createUserSchema = z.object({
  name: requiredText("Nome"),

  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .max(191, "E-mail deve ter no máximo 191 caracteres"),

  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .max(191, "Senha deve ter no máximo 191 caracteres"),

  tipoUser: tipoUserSchema,
});

export const updateUserSchema = z.object({
  name: requiredText("Nome").optional(),

  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido")
    .max(191, "E-mail deve ter no máximo 191 caracteres")
    .optional(),

  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .max(191, "Senha deve ter no máximo 191 caracteres")
    .optional(),

  tipoUser: tipoUserSchema.optional(),
});

export const userIdParam = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "O id deve ser um número inteiro positivo")
    .transform(Number)
    .pipe(z.number().int().safe()),
});

export const userResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().email(),
  tipoUser: tipoUserSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const listUserResponseSchema = z.object({
  data: z.array(userResponseSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const userErrorResponseSchema = z.object({
  error: z.string(),
}).loose();

export const deleteUserResponseSchema = z.undefined();

export type TipoUser = z.infer<typeof tipoUserSchema>;
export type ListUserQuery = z.infer<typeof listUserQuery>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;



// //
// export const tipoUserEnum = z.enum(["ADMIN", "PROFESSOR", "USUARIO"]);

// export const userIdParam = z.object({
//   id: z
//     .string()
//     .regex(/^\d+$/, "O id deve ser um número inteiro positivo")
//     .transform((value) => Number(value)),
// });

// export const createUserSchema = z.object({
//   email: z.email("E-mail inválido"),
//   name: z.string().optional(),
// });

// export const updateUserSchema = z
//   .object({
//     email: z.email("E-mail inválido").optional(),
//     name: z.string().nullable().optional(),
//   })
//   .refine((data) => data.email !== undefined || data.name !== undefined, {
//     message: "Pelo menos um campo é obrigatório",
//   });

// export type CreateUserInput = z.infer<typeof createUserSchema>;
// export type UpdateUserInput = z.infer<typeof updateUserSchema>;
