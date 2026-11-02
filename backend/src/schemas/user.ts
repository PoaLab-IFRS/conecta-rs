import { z } from "zod";

export const tipoUserEnum = z.enum(["ADMIN", "PROFESSOR", "USUARIO"]);

export const listUserQuery = z.object({
  nome: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const userIdParam = z.object({
  id: z
    .string()
    .trim()
    .min(1, "O ID do usuário é obrigatório")
    .max(191, "ID de usuário inválido"),
});

export const createUserSchema = z
  .object({
    email: z.email("E-mail inválido"),
    name: z
      .string()
      .trim()
      .min(1, "Nome é obrigatório")
      .max(191, "Nome deve ter no máximo 191 caracteres"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(128, "A senha deve ter no máximo 128 caracteres"),
    tipoUser: tipoUserEnum,
  })
  .strict();

export const updateUserSchema = z
  .object({
    email: z.email("E-mail inválido").optional(),
    name: z
      .string()
      .trim()
      .min(1, "Nome não pode ser vazio")
      .max(191, "Nome deve ter no máximo 191 caracteres")
      .optional(),
    tipoUser: tipoUserEnum.optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.email !== undefined ||
      data.name !== undefined ||
      data.tipoUser !== undefined,
    { message: "Informe ao menos um campo para atualizar" },
  );

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

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
