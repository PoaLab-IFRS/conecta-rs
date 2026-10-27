import { Prisma } from "@prisma/client";
import argon2 from "argon2";

import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { UpdateUserInput } from "../../schemas/user.js";

export async function updateUser(
  id: number,
  input: UpdateUserInput,
) {
  const data: Prisma.UserUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.email !== undefined) {
    data.email = input.email;
  }

  if (input.tipoUser !== undefined) {
    data.tipoUser = input.tipoUser;
  }

  if (input.senha !== undefined && input.senha.length > 0) {
    data.senha = await argon2.hash(input.senha, {
      type: argon2.argon2id,
    });
  }

  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        tipoUser: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2025") {
        throw new AppError("Usuário não encontrado", 404);
      }

      if (error.code === "P2002") {
        throw new AppError(
          "Já existe um usuário com este e-mail",
          409,
        );
      }
    }

    throw error;
  }
}