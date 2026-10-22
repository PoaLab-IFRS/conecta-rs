import { z } from "zod";

export const tipoUserEnum = z.enum(["ADMIN", "PROFESSOR", "USUARIO"]);

const requiredText = (label: string) => z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z
    .string()
    .trim()
    .min(1, `${label} é obrigatório preencher esse campo`)
    .max(191, `${label} deve ter no máximo 191 caracteres`)
);

const requiredDecimal = z.preprocess(
  (value) => {
    if (value === "" || value === undefined) return null;
    return typeof value === "string" ? value.trim().replace(",", ".") : value;
  },
  z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, "Informe um valor com até duas casas decimais")
);

export const listUserQuery = z.object({
  nome: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});


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
